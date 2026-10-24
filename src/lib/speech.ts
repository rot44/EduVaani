import { sarvamService } from './sarvam';

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechLang: string;
  voiceNames: string[];
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', speechLang: 'en-IN', voiceNames: ['Google Indian English', 'Microsoft Ravi', 'en-IN'] },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', speechLang: 'hi-IN', voiceNames: ['Google हिन्दी', 'Microsoft Hemant', 'Microsoft Kalpana'] },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', speechLang: 'mr-IN', voiceNames: ['Google मराठी', 'Microsoft Manohar'] },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', speechLang: 'gu-IN', voiceNames: ['Google ગુજરાતી', 'Microsoft Kalika'] },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speechLang: 'ta-IN', voiceNames: ['Google தமிழ்', 'Microsoft Valluvar'] },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', speechLang: 'te-IN', voiceNames: ['Google తెలుగు'] },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', speechLang: 'kn-IN', voiceNames: ['Google ಕನ್ನಡ'] },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', speechLang: 'bn-IN', voiceNames: ['Google বাংলা'] },
];

export type VoiceEngine = 'sarvam' | 'browser';

export function encodePcmToWav(samples: Float32Array, sampleRate: number): Blob {
  const dataLength = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // Mono channel
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // Byte rate
  view.setUint16(32, 2, true); // Block align
  view.setUint16(34, 16, true); // 16-bit
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

export type SpeechInputState =
  | 'idle'
  | 'listening'
  | 'speech_detected'
  | 'silence_countdown'
  | 'restarting'
  | 'processing'
  | 'error';

export interface AudioRecorderMetrics {
  ambientNoiseFloor: number;
  peakSignal: number;
  vadFramesCount: number;
  snrRatio: number;
}

class AudioRecorder {
  private audioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private chunks: Float32Array[] = [];
  private totalSamples = 0;
  private isRecording = false;

  // Adaptive noise-gate tracking
  private ambientNoiseFloor = 0.001;
  private noiseFramesCount = 0;
  private isCalibrating = true;
  private calibrationLimit = 6; // First ~300ms
  private peakSignal = 0;
  private vadFramesCount = 0;

  async start(): Promise<boolean> {
    try {
      this.chunks = [];
      this.totalSamples = 0;
      this.ambientNoiseFloor = 0.001;
      this.noiseFramesCount = 0;
      this.isCalibrating = true;
      this.peakSignal = 0;
      this.vadFramesCount = 0;
      this.isRecording = true;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass || !navigator.mediaDevices?.getUserMedia) return false;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      this.mediaStream = stream;

      const ctx = new AudioContextClass({ sampleRate: 16000 });
      this.audioCtx = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      this.processor = processor;

      processor.onaudioprocess = (e) => {
        if (!this.isRecording) return;
        const input = e.inputBuffer.getChannelData(0);
        const copy = new Float32Array(input.length);
        copy.set(input);
        this.chunks.push(copy);
        this.totalSamples += copy.length;

        // Compute frame RMS & peak
        let sumSquares = 0;
        for (let i = 0; i < input.length; i++) {
          const val = input[i];
          sumSquares += val * val;
          const absVal = Math.abs(val);
          if (absVal > this.peakSignal) this.peakSignal = absVal;
        }
        const frameRms = Math.sqrt(sumSquares / input.length);

        if (this.isCalibrating) {
          this.ambientNoiseFloor =
            (this.ambientNoiseFloor * this.noiseFramesCount + frameRms) /
            (this.noiseFramesCount + 1);
          this.noiseFramesCount++;
          if (this.noiseFramesCount >= this.calibrationLimit) {
            this.isCalibrating = false;
          }
        } else {
          // Dynamic adaptive gate: 1.7x ambient noise floor or 0.0025 baseline
          const adaptiveGate = Math.max(0.0025, this.ambientNoiseFloor * 1.7);
          if (frameRms > adaptiveGate) {
            this.vadFramesCount++;
          }
        }
      };

      source.connect(processor);
      processor.connect(ctx.destination);
      return true;
    } catch (err) {
      console.warn("Audio recorder init notice:", err);
      return false;
    }
  }

  getMetrics(): AudioRecorderMetrics {
    const snr = this.ambientNoiseFloor > 0 ? this.peakSignal / this.ambientNoiseFloor : 1;
    return {
      ambientNoiseFloor: this.ambientNoiseFloor,
      peakSignal: this.peakSignal,
      vadFramesCount: this.vadFramesCount,
      snrRatio: Math.round(snr * 10) / 10,
    };
  }

  stop(): Blob | null {
    this.isRecording = false;
    if (this.processor) {
      try { this.processor.disconnect(); } catch {}
      this.processor = null;
    }
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach(t => t.stop());
      } catch {}
      this.mediaStream = null;
    }
    const sampleRate = this.audioCtx?.sampleRate || 16000;
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try { this.audioCtx.close(); } catch {}
      this.audioCtx = null;
    }

    if (this.totalSamples < 3200) {
      return null;
    }

    const merged = new Float32Array(this.totalSamples);
    let offset = 0;
    for (const chunk of this.chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    // Adaptive noise gate check:
    // If not a single VAD frame exceeded adaptive noise floor and peak signal is below 0.015,
    // discard as ambient background room hum.
    if (this.vadFramesCount < 2 && this.peakSignal < 0.015) {
      return null;
    }

    return encodePcmToWav(merged, sampleRate);
  }
}

export class SpeechService {
  private synthesis: SpeechSynthesis;
  private currentRecognition: any = null;
  private isListening: boolean = false;
  private currentLanguage: string = 'en'; // TTS/Vernacular guidance language
  private speechInputLanguage: string = 'en-IN'; // STT input language (defaults to Indian English)
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private voiceEngine: VoiceEngine = 'sarvam';
  private finishCurrentListen: ((text: string) => void) | null = null;
  private currentTranscript: string = '';
  private stateListeners: Set<(state: SpeechInputState, details?: any) => void> = new Set();
  private currentState: SpeechInputState = 'idle';

  constructor() {
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : (null as any);
    if (this.synthesis && this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => this.selectBestVoice();
    }
    if (typeof window !== 'undefined') {
      setTimeout(() => this.selectBestVoice(), 200);
    }

    if (!sarvamService.isConfigured()) {
      this.voiceEngine = 'browser';
    }
  }

  setLanguage(code: string): void {
    this.currentLanguage = code;
    this.selectBestVoice();
  }

  setSpeechInputLanguage(langCodeOrSpeechLang: string): void {
    const found = SUPPORTED_LANGUAGES.find(l => l.code === langCodeOrSpeechLang || l.speechLang === langCodeOrSpeechLang);
    this.speechInputLanguage = found ? found.speechLang : langCodeOrSpeechLang;
  }

  getSpeechInputLanguage(): string {
    return this.speechInputLanguage;
  }

  setVoiceEngine(engine: VoiceEngine): void {
    this.voiceEngine = engine;
  }

  getVoiceEngine(): VoiceEngine {
    return this.voiceEngine;
  }

  isSarvamEnabled(): boolean {
    return sarvamService.isConfigured() && this.voiceEngine === 'sarvam';
  }

  private selectBestVoice(): void {
    if (!this.synthesis) return;
    const voices = this.synthesis.getVoices();
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === this.currentLanguage);
    if (!lang || voices.length === 0) { this.selectedVoice = null; return; }
    for (const name of lang.voiceNames) {
      const v = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase().split(' ')[0]));
      if (v) { this.selectedVoice = v; return; }
    }
    const fallback = voices.find(v => v.lang.startsWith(lang.speechLang.split('-')[0]));
    this.selectedVoice = fallback || null;
  }

  /**
   * Speaks using either Sarvam AI (Bulbul TTS) or Browser SpeechSynthesis
   */
  async speak(text: string, rate: number = 0.9): Promise<void> {
    this.stopSpeaking();

    // Try Sarvam AI first if enabled
    if (this.isSarvamEnabled()) {
      try {
        await sarvamService.speak(text, this.currentLanguage, { pace: rate });
        return;
      } catch (err) {
        console.warn('Sarvam TTS unavailable, falling back to browser voice:', err);
      }
    }

    // Fallback: Browser SpeechSynthesis
    return new Promise((resolve) => {
      if (!this.synthesis) { resolve(); return; }
      this.synthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.0;
      utterance.volume = 1;
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
        utterance.lang = this.selectedVoice.lang;
      } else {
        const lang = SUPPORTED_LANGUAGES.find(l => l.code === this.currentLanguage);
        if (lang) utterance.lang = lang.speechLang;
      }
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      this.synthesis.speak(utterance);
    });
  }



  /**
   * High-reliability speech recognition with live interim streaming,
   * natural silence window, and Sarvam AI Saaras STT fallback
   */
  subscribeState(listener: (state: SpeechInputState, details?: any) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.currentState);
    return () => this.stateListeners.delete(listener);
  }

  getCurrentState(): SpeechInputState {
    return this.currentState;
  }

  private setState(state: SpeechInputState, details?: any): void {
    this.currentState = state;
    this.stateListeners.forEach((fn) => {
      try { fn(state, details); } catch {}
    });
  }

  /**
   * Pre-flight permission check querying navigator.permissions or mediaDevices
   */
  async checkMicrophonePermission(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      return 'unsupported';
    }
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        return status.state as 'granted' | 'denied' | 'prompt';
      }
    } catch {
      // Permission API fallback
    }
    return 'prompt';
  }

  /**
   * High-reliability speech recognition with live interim streaming,
   * adaptive silence window (2.8s), graceful no-speech auto-restart (15s window),
   * and Sarvam AI Saaras STT fallback
   */
  async listen(
    onInterim?: (text: string) => void,
    overrideInputLang?: string
  ): Promise<string> {
    this.stopSpeaking();
    this.stopListening();

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const audioRecorder = new AudioRecorder();
    await audioRecorder.start();

    this.setState('listening');

    return new Promise((resolve) => {
      let finalTranscript = '';
      let latestInterim = '';
      let hasFinished = false;
      let silenceTimer: any = null;
      let countdownTimer: any = null;
      let safetyTimeout: any = null;
      let restartAttempts = 0;
      const MAX_RESTART_WINDOW = 15000; // 15 seconds grace window for no-speech recovery
      const startTime = Date.now();

      this.currentTranscript = '';

      const targetLang = overrideInputLang || this.speechInputLanguage || 'en-IN';

      const finish = async (resultText: string) => {
        if (hasFinished) return;
        hasFinished = true;
        this.isListening = false;
        this.finishCurrentListen = null;

        if (silenceTimer) clearTimeout(silenceTimer);
        if (countdownTimer) clearTimeout(countdownTimer);
        if (safetyTimeout) clearTimeout(safetyTimeout);

        if (this.currentRecognition) {
          try {
            this.currentRecognition.abort();
          } catch {}
          this.currentRecognition = null;
        }

        this.setState('processing');
        const wavBlob = audioRecorder.stop();

        // 1. If Web Speech API captured text, use it immediately
        if (resultText && resultText.trim().length > 0) {
          this.setState('idle');
          resolve(resultText.trim());
          return;
        }

        // 2. If Web Speech returned empty but audio was captured, transcribe with Sarvam AI Saaras
        if (wavBlob && sarvamService.isConfigured()) {
          try {
            if (onInterim) onInterim("Processing your voice with Sarvam AI...");
            const sarvamText = await sarvamService.transcribeAudio(wavBlob, targetLang);
            if (sarvamText && sarvamText.trim().length > 0) {
              this.setState('idle');
              resolve(sarvamText.trim());
              return;
            }
          } catch (err) {
            console.warn("Sarvam AI STT notice:", err);
          }
        }

        this.setState('idle');
        resolve(resultText.trim());
      };

      this.finishCurrentListen = (overrideText?: string) => {
        const text = overrideText !== undefined ? overrideText : (finalTranscript + ' ' + latestInterim).trim();
        finish(text);
      };

      // Extended natural silence timer: 2800ms
      const resetSilenceTimer = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        if (countdownTimer) clearTimeout(countdownTimer);

        // Warn/notify after 1800ms of silence that turn is wrapping up
        countdownTimer = setTimeout(() => {
          if (this.isListening && !hasFinished) {
            this.setState('silence_countdown');
          }
        }, 1800);

        // Finalize turn after 2800ms silence
        silenceTimer = setTimeout(() => {
          const currentText = (finalTranscript + ' ' + latestInterim).trim();
          if (currentText.length > 0) {
            finish(currentText);
          }
        }, 2800);
      };

      // Safety timeout after 30 seconds
      safetyTimeout = setTimeout(() => {
        const text = (finalTranscript + ' ' + latestInterim).trim();
        finish(text);
      }, 30000);

      if (!SpeechRecognitionClass) {
        // Browser without Web Speech API (e.g. Firefox) -> Sarvam MediaRecorder fallback
        return;
      }

      const startRecognitionInstance = () => {
        try {
          const recognition = new SpeechRecognitionClass();
          this.currentRecognition = recognition;
          this.isListening = true;

          recognition.lang = targetLang;
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.maxAlternatives = 1;

          recognition.onresult = (event: any) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const res = event.results[i];
              const text = res[0].transcript;
              if (res.isFinal) {
                finalTranscript += (finalTranscript ? ' ' : '') + text;
              } else {
                interim += text;
              }
            }

            latestInterim = interim;
            const currentCombined = (finalTranscript + ' ' + latestInterim).trim();
            this.currentTranscript = currentCombined;

            if (onInterim && currentCombined) {
              onInterim(currentCombined);
            }

            if (currentCombined.length > 0) {
              this.setState('speech_detected', { text: currentCombined });
              resetSilenceTimer();
            }
          };

          recognition.onerror = (event: any) => {
            console.warn("Speech recognition event:", event.error);
            if (event.error === 'no-speech' && this.isListening && !hasFinished) {
              // If user paused or hasn't spoken yet within 15s window, retry gracefully
              if (Date.now() - startTime < MAX_RESTART_WINDOW && restartAttempts < 4) {
                restartAttempts++;
                this.setState('restarting', { attempt: restartAttempts });
                return; // Let onend cleanly restart
              }
            }
            const currentCombined = (finalTranscript + ' ' + latestInterim).trim();
            finish(currentCombined);
          };

          recognition.onend = () => {
            if (this.isListening && !hasFinished) {
              const currentCombined = (finalTranscript + ' ' + latestInterim).trim();
              if (!currentCombined && Date.now() - startTime < MAX_RESTART_WINDOW && restartAttempts < 4) {
                restartAttempts++;
                this.setState('restarting', { attempt: restartAttempts });
                // Clean restart after micro-delay avoiding InvalidStateError
                setTimeout(() => {
                  if (this.isListening && !hasFinished) {
                    startRecognitionInstance();
                  }
                }, 150);
                return;
              }
              finish(currentCombined);
            }
          };

          recognition.start();
        } catch (err: unknown) {
          console.warn("SpeechRecognition start notice:", err);
        }
      };

      startRecognitionInstance();
    });
  }

  /**
   * Finalizes the current listening turn immediately and resolves with whatever has been spoken
   */
  finishListening(): string {
    const text = this.currentTranscript.trim();
    if (this.finishCurrentListen) {
      this.finishCurrentListen(text);
    } else {
      this.stopListening();
    }
    return text;
  }

  /**
   * Cancels and stops listening without submitting
   */
  stopListening(): void {
    if (this.currentRecognition) {
      try {
        this.currentRecognition.abort();
      } catch {}
      this.currentRecognition = null;
    }
    this.isListening = false;
    this.finishCurrentListen = null;
    this.currentTranscript = '';
    this.setState('idle');
  }

  stopSpeaking(): void {
    sarvamService.stopSpeaking();
    if (this.synthesis) {
      try {
        this.synthesis.cancel();
      } catch {}
    }
  }

  get listening(): boolean { return this.isListening; }
  getCurrentLanguage(): string { return this.currentLanguage; }
  static getSupportedLanguages(): SupportedLanguage[] { return SUPPORTED_LANGUAGES; }
  static isSupported(): boolean {
    return !!(
      (typeof window !== 'undefined' && window.speechSynthesis && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
      (typeof navigator !== 'undefined' && navigator.mediaDevices && sarvamService.isConfigured())
    );
  }
}

export const speechService = new SpeechService();

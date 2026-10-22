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

class AudioRecorder {
  private audioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private chunks: Float32Array[] = [];
  private totalSamples = 0;
  private isRecording = false;

  async start(): Promise<boolean> {
    try {
      this.chunks = [];
      this.totalSamples = 0;
      this.isRecording = true;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass || !navigator.mediaDevices?.getUserMedia) return false;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      };

      source.connect(processor);
      processor.connect(ctx.destination);
      return true;
    } catch (err) {
      console.warn("Audio recorder init notice:", err);
      return false;
    }
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

    let sum = 0;
    for (let i = 0; i < merged.length; i++) {
      sum += merged[i] * merged[i];
    }
    const rms = Math.sqrt(sum / merged.length);
    if (rms < 0.002) {
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

  constructor() {
    this.synthesis = window.speechSynthesis;
    if (this.synthesis && this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => this.selectBestVoice();
    }
    setTimeout(() => this.selectBestVoice(), 200);

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
  async listen(
    onInterim?: (text: string) => void,
    overrideInputLang?: string
  ): Promise<string> {
    this.stopSpeaking();
    this.stopListening();

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const audioRecorder = new AudioRecorder();
    await audioRecorder.start();

    return new Promise((resolve) => {
      let finalTranscript = '';
      let latestInterim = '';
      let hasFinished = false;
      let silenceTimer: any = null;
      let safetyTimeout: any = null;
      const startTime = Date.now();

      this.currentTranscript = '';

      const targetLang = overrideInputLang || this.speechInputLanguage || 'en-IN';

      const finish = async (resultText: string) => {
        if (hasFinished) return;
        hasFinished = true;
        this.isListening = false;
        this.finishCurrentListen = null;

        if (silenceTimer) clearTimeout(silenceTimer);
        if (safetyTimeout) clearTimeout(safetyTimeout);

        if (this.currentRecognition) {
          try {
            this.currentRecognition.abort();
          } catch {}
          this.currentRecognition = null;
        }

        const wavBlob = audioRecorder.stop();

        // 1. If Web Speech API captured text, use it immediately
        if (resultText && resultText.trim().length > 0) {
          resolve(resultText.trim());
          return;
        }

        // 2. If Web Speech returned empty but audio was captured, transcribe with Sarvam AI Saaras
        if (wavBlob && sarvamService.isConfigured()) {
          try {
            if (onInterim) onInterim("Processing your voice with Sarvam AI...");
            const sarvamText = await sarvamService.transcribeAudio(wavBlob, targetLang);
            if (sarvamText && sarvamText.trim().length > 0) {
              resolve(sarvamText.trim());
              return;
            }
          } catch (err) {
            console.warn("Sarvam AI STT notice:", err);
          }
        }

        resolve(resultText.trim());
      };

      this.finishCurrentListen = (overrideText?: string) => {
        const text = overrideText !== undefined ? overrideText : (finalTranscript + ' ' + latestInterim).trim();
        finish(text);
      };

      const resetSilenceTimer = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          const currentText = (finalTranscript + ' ' + latestInterim).trim();
          if (currentText.length > 0) {
            finish(currentText);
          }
        }, 1800);
      };

      // Safety timeout after 25 seconds
      safetyTimeout = setTimeout(() => {
        const text = (finalTranscript + ' ' + latestInterim).trim();
        finish(text);
      }, 25000);

      if (!SpeechRecognitionClass) {
        // Browser without Web Speech API (e.g. Firefox) -> Sarvam MediaRecorder fallback
        return;
      }

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
            resetSilenceTimer();
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition event:", event.error);
          if (event.error === 'no-speech' && this.isListening && !hasFinished) {
            // If user hasn't spoken yet and under 8 seconds, keep waiting instead of aborting
            if (Date.now() - startTime < 8000) {
              try {
                recognition.start();
                return;
              } catch {}
            }
          }
          const currentCombined = (finalTranscript + ' ' + latestInterim).trim();
          finish(currentCombined);
        };

        recognition.onend = () => {
          if (this.isListening && !hasFinished) {
            const currentCombined = (finalTranscript + ' ' + latestInterim).trim();
            if (!currentCombined && Date.now() - startTime < 8000) {
              try {
                recognition.start();
                return;
              } catch {}
            }
            finish(currentCombined);
          }
        };

        recognition.start();
      } catch (err: unknown) {
        console.warn("SpeechRecognition start notice:", err);
      }
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
      (window.speechSynthesis && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
      (typeof navigator !== 'undefined' && navigator.mediaDevices && sarvamService.isConfigured())
    );
  }
}

export const speechService = new SpeechService();

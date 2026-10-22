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
   * Prompts the browser for mic permission if not yet granted
   */
  async ensureMicPermission(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return true; // Older browser, proceed to SpeechRecognition directly
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      return true;
    } catch (err) {
      console.warn("Microphone permission check failed:", err);
      return false;
    }
  }

  /**
   * High-reliability speech recognition with live interim streaming,
   * natural 1.8s silence window, and instant finishListening capability
   */
  async listen(
    onInterim?: (text: string) => void,
    overrideInputLang?: string
  ): Promise<string> {
    this.stopSpeaking();
    this.stopListening();

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      throw new Error('STT is not supported in this browser. Please use Chrome, Edge, or Safari.');
    }

    const hasPermission = await this.ensureMicPermission();
    if (!hasPermission) {
      throw new Error('Microphone permission was denied. Please allow microphone in your browser address bar.');
    }

    return new Promise((resolve) => {
      let finalTranscript = '';
      let latestInterim = '';
      let hasFinished = false;
      let silenceTimer: any = null;
      let safetyTimeout: any = null;

      this.currentTranscript = '';

      const recognition = new SpeechRecognitionClass();
      this.currentRecognition = recognition;
      this.isListening = true;

      // Use specified STT language or default Indian English
      const targetLang = overrideInputLang || this.speechInputLanguage || 'en-IN';
      recognition.lang = targetLang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      const finish = (resultText: string) => {
        if (hasFinished) return;
        hasFinished = true;
        this.isListening = false;
        this.finishCurrentListen = null;

        if (silenceTimer) clearTimeout(silenceTimer);
        if (safetyTimeout) clearTimeout(safetyTimeout);

        if (this.currentRecognition === recognition) {
          this.currentRecognition = null;
        }
        try {
          recognition.abort();
        } catch {}
        resolve(resultText.trim());
      };

      // Expose finish hook so the UI mic button can immediately finalize and submit
      this.finishCurrentListen = (overrideText?: string) => {
        const text = overrideText !== undefined ? overrideText : (finalTranscript + ' ' + latestInterim).trim();
        finish(text);
      };

      const resetSilenceTimer = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        // Once the user has spoken, wait 1.8s of silence to finalize
        silenceTimer = setTimeout(() => {
          const currentText = (finalTranscript + ' ' + latestInterim).trim();
          if (currentText.length > 0) {
            finish(currentText);
          }
        }, 1800);
      };

      // Safety timeout after 30 seconds
      safetyTimeout = setTimeout(() => {
        const text = (finalTranscript + ' ' + latestInterim).trim();
        finish(text);
      }, 30000);

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
        console.warn("Speech recognition notice:", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          finish('');
        } else {
          // If no-speech or aborted, resolve whatever words we captured
          const currentCombined = (finalTranscript + ' ' + latestInterim).trim();
          finish(currentCombined);
        }
      };

      recognition.onend = () => {
        const currentCombined = (finalTranscript + ' ' + latestInterim).trim();
        finish(currentCombined);
      };

      try {
        recognition.start();
      } catch (err: unknown) {
        this.isListening = false;
        console.error("SpeechRecognition start error:", err);
        finish('');
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
    return !!(window.speechSynthesis && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
  }
}

export const speechService = new SpeechService();

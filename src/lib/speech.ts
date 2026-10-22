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
  private recognition: any = null;
  private isListening: boolean = false;
  private currentLanguage: string = 'en';
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private voiceEngine: VoiceEngine = 'sarvam'; // Default to Sarvam if key available

  constructor() {
    this.synthesis = window.speechSynthesis;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SR();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-IN';
    }
    if (this.synthesis && this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => this.selectBestVoice();
    }
    setTimeout(() => this.selectBestVoice(), 200);

    // If Sarvam is not configured, fallback to browser engine
    if (!sarvamService.isConfigured()) {
      this.voiceEngine = 'browser';
    }
  }

  setLanguage(code: string): void {
    this.currentLanguage = code;
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (lang && this.recognition) { this.recognition.lang = lang.speechLang; }
    this.selectBestVoice();
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

    // Try Sarvam AI first if enabled and configured
    if (this.isSarvamEnabled()) {
      try {
        await sarvamService.speak(text, this.currentLanguage, { pace: rate });
        return;
      } catch (err) {
        console.warn('Sarvam TTS failed, falling back to browser speech:', err);
      }
    }

    // Fallback: Browser SpeechSynthesis
    return new Promise((resolve, reject) => {
      if (!this.synthesis) { reject(new Error('TTS not supported')); return; }
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
      utterance.onerror = (e) => reject(e.error);
      this.synthesis.speak(utterance);
    });
  }

  listen(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) { reject(new Error('STT not supported')); return; }
      if (this.isListening) { reject(new Error('Already listening')); return; }
      this.isListening = true;
      this.recognition.onresult = (event: any) => {
        this.isListening = false;
        resolve(event.results[0][0].transcript);
      };
      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        reject(new Error(`STT error: ${event.error}`));
      };
      this.recognition.onend = () => { this.isListening = false; };
      this.recognition.start();
    });
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  stopSpeaking(): void {
    sarvamService.stopSpeaking();
    if (this.synthesis) this.synthesis.cancel();
  }

  get listening(): boolean { return this.isListening; }
  getCurrentLanguage(): string { return this.currentLanguage; }
  static getSupportedLanguages(): SupportedLanguage[] { return SUPPORTED_LANGUAGES; }
  static isSupported(): boolean {
    return !!(window.speechSynthesis && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
  }
}

export const speechService = new SpeechService();

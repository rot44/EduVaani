// Sarvam AI Service for Indian Regional Languages
// Powers realistic Indian TTS (Bulbul), Translation (Mayura), and STT (Saaras)

export interface SarvamTTSOptions {
  speaker?: 'kavya' | 'priya' | 'aditya' | 'rahul' | 'neha' | 'pooja' | 'rohan' | 'shreya' | 'shruti';
  pace?: number; // 0.5 to 2.0
  loudness?: number; // 0.5 to 2.0
}

const LANGUAGE_CODE_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  bn: 'bn-IN',
};

class SarvamService {
  private apiKey: string;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_SARVAM_API_KEY || '';
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.trim().length > 0 && this.apiKey !== 'your_sarvam_api_key_here';
  }

  getApiKey(): string {
    return this.apiKey;
  }

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  private getEndpoint(path: string): string {
    // In Vite dev mode, use the proxy to prevent browser CORS issues
    return `/api/sarvam${path}`;
  }

  /**
   * Text to Speech using Sarvam AI Bulbul v3
   * Returns a promise that resolves when audio finishes playing
   */
  async speak(
    text: string,
    languageCode: string = 'en',
    options?: SarvamTTSOptions
  ): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Sarvam AI API key is not configured.');
    }

    this.stopSpeaking();

    const targetLang = LANGUAGE_CODE_MAP[languageCode] || languageCode;
    const speaker = options?.speaker || 'kavya';
    const pace = options?.pace ?? 0.95;

    // Truncate if exceeding 500 characters per Sarvam limit per single sentence
    const safeText = text.slice(0, 500);

    const payload = {
      inputs: [safeText],
      target_language_code: targetLang,
      speaker: speaker,
      pitch: 0,
      pace: pace,
      loudness: options?.loudness ?? 1.2,
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      model: 'bulbul:v3',
    };

    const endpoint = this.getEndpoint('/text-to-speech');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': this.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Sarvam TTS error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    if (!data.audios || data.audios.length === 0) {
      throw new Error('No audio returned from Sarvam AI');
    }

    const base64Audio = data.audios[0];
    const audioUrl = `data:audio/wav;base64,${base64Audio}`;

    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.onended = () => {
        this.currentAudio = null;
        resolve();
      };

      audio.onerror = (e) => {
        this.currentAudio = null;
        reject(new Error(`Audio playback error: ${e}`));
      };

      audio.play().catch(reject);
    });
  }

  /**
   * Translate text between Indian languages using Sarvam Mayura
   */
  async translate(
    text: string,
    targetLanguageCode: string,
    sourceLanguageCode: string = 'en'
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Sarvam AI API key is not configured.');
    }

    const sourceLang = LANGUAGE_CODE_MAP[sourceLanguageCode] || sourceLanguageCode;
    const targetLang = LANGUAGE_CODE_MAP[targetLanguageCode] || targetLanguageCode;

    if (sourceLang === targetLang) return text;

    const payload = {
      input: text,
      source_language_code: sourceLang,
      target_language_code: targetLang,
      speaker_gender: 'Female',
      mode: 'formal',
      model: 'mayura:v1',
    };

    const endpoint = this.getEndpoint('/translate');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': this.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Sarvam Translation error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    return data.translated_text || text;
  }

  /**
   * Speech to Text using Sarvam AI Saaras v3
   * Transcribes recorded audio buffer directly through Sarvam AI
   */
  async transcribeAudio(
    audioBlob: Blob,
    languageCode?: string
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Sarvam AI API key is not configured.');
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'speech.wav');
    formData.append('model', 'saaras:v3');
    if (languageCode) {
      const targetLang = LANGUAGE_CODE_MAP[languageCode] || languageCode;
      formData.append('language_code', targetLang);
    }

    const endpoint = this.getEndpoint('/speech-to-text');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'api-subscription-key': this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Sarvam STT error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    return (data.transcript || '').trim();
  }

  stopSpeaking(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }
}

export const sarvamService = new SarvamService();

import { GoogleGenerativeAI } from "@google/generative-ai";
import { sarvamService } from "./sarvam";

const LANG_NAMES: Record<string, string> = {
  hi: 'Hindi (हिंदी)',
  mr: 'Marathi (मराठी)',
  gu: 'Gujarati (ગુજરાતી)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  kn: 'Kannada (ಕನ್ನಡ)',
  bn: 'Bengali (বাংলা)',
};

class TranslationService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    }
  }

  async translateToLanguage(text: string, targetLang: string): Promise<string> {
    if (targetLang === 'en') return text;

    // 1. Try Sarvam AI Mayura Translation if key is configured
    if (sarvamService.isConfigured()) {
      try {
        const translated = await sarvamService.translate(text, targetLang, 'en');
        if (translated && translated.trim().length > 0) {
          return translated.trim();
        }
      } catch (err) {
        console.warn('Sarvam translation error, falling back to Gemini:', err);
      }
    }

    // 2. Fallback to Google Gemini Generative AI translation
    if (this.model) {
      const langName = LANG_NAMES[targetLang] || targetLang;
      try {
        const prompt = `Translate the following English text to ${langName}. Keep it natural, conversational, and suitable for language learning. Maintain the friendly and encouraging tone.\n\nEnglish: "${text}"\n\nTranslation:`;
        const result = await this.model.generateContent(prompt);
        return result.response.text().trim();
      } catch {
        return text;
      }
    }

    return text;
  }
}

export const translationService = new TranslationService();

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { SectionHeading } from '../ui/section-heading';
import { speechService } from '../../lib/speech';

export const LANGUAGES_DEMO = [
  { code: 'hi', name: 'Hindi', script: 'हिंदी', flag: '🇮🇳', greeting: 'नमस्ते! आज आप कैसे हैं?' },
  { code: 'mr', name: 'Marathi', script: 'मराठी', flag: '🇮🇳', greeting: 'नमस्कार! आज तुमचा दिवस कसा गेला?' },
  { code: 'gu', name: 'Gujarati', script: 'ગુજરાતી', flag: '🇮🇳', greeting: 'નમસ્તે! ચાલો આજે અંગ્રેજી બોલવાની પ્રેક્ટિસ કરીએ!' },
  { code: 'ta', name: 'Tamil', script: 'தமிழ்', flag: '🇮🇳', greeting: 'வணக்கம்! இன்று ஆங்கிலம் பேசலாம் வாருங்கள்!' },
  { code: 'te', name: 'Telugu', script: 'తెలుగు', flag: '🇮🇳', greeting: 'నమస్కారం! ఈరోజు ఇంగ్లీష్ మాట్లాడటం ప్రాక్టీస్ చేద్దాం!' },
  { code: 'kn', name: 'Kannada', script: 'ಕನ್ನಡ', flag: '🇮🇳', greeting: 'ನಮಸ್ಕಾರ! ಇಂದು ಇಂಗ್ಲಿಷ್ ಅಭ್ಯಾಸ ಮಾಡೋಣ ಬನ್ನಿ!' },
  { code: 'bn', name: 'Bengali', script: 'বাংলা', flag: '🇮🇳', greeting: 'নমস্কার! আসুন আজ একসাথে ইংরেজি বলা অনুশীলন করি!' },
  { code: 'en', name: 'English', script: 'Indian English', flag: '🇮🇳', greeting: 'Namaste! Ready to speak English fluently?' },
];

export function LanguageShowcase() {
  const [playingCode, setPlayingCode] = useState<string | null>(null);

  const testAudioGreeting = async (text: string, code: string) => {
    try {
      setPlayingCode(code);
      speechService.setLanguage(code);
      await speechService.speak(text, 0.9);
    } finally {
      setPlayingCode(null);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-cream-white via-warm-ivory/30 to-cream-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Zero Language Barriers"
          badgeVariant="teal"
          title="Learn English in Your Mother Tongue"
          subtitle="Click any language card below to hear how EduVaani greets and guides you in your native language."
          align="center"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {LANGUAGES_DEMO.map((lang, index) => {
            const isPlaying = playingCode === lang.code;
            return (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => testAudioGreeting(lang.greeting, lang.code)}
                className={`group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-warm-sm hover:shadow-warm ${
                  isPlaying
                    ? 'bg-warm-ivory border-peacock-teal ring-2 ring-peacock-teal/20'
                    : 'bg-warm-ivory border-warm-sand hover:border-peacock-teal/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        testAudioGreeting(lang.greeting, lang.code);
                      }}
                      title="Play native audio greeting"
                      className={`p-2 rounded-xl transition-all ${
                        isPlaying
                          ? 'bg-peacock-teal text-cream-white shadow-teal scale-105'
                          : 'bg-warm-sand/60 text-peacock-teal group-hover:bg-peacock-teal group-hover:text-cream-white'
                      }`}
                    >
                      <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                    </button>
                  </div>

                  <div className="font-bold text-deep-brown text-lg font-display">
                    {lang.name}
                  </div>
                  <div className="text-sm text-terracotta font-semibold mb-2">
                    {lang.script}
                  </div>

                  <p className="text-xs text-deep-brown/70 italic leading-relaxed bg-cream-white/70 p-2.5 rounded-xl border border-warm-sand/60">
                    "{lang.greeting}"
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-warm-sand/60 text-[11px] text-deep-brown/60 flex items-center justify-between font-medium">
                  <span>{isPlaying ? '🔊 Speaking...' : 'Tap to listen'}</span>
                  <span className="text-peacock-teal group-hover:translate-x-0.5 transition-transform">
                    Hear voice →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

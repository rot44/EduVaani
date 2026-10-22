import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  User as UserIcon,
  Mail,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Check,
  HeartHandshake,
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import type { EnglishLevel } from '../lib/auth';

const MOTHER_TONGUES = [
  { code: 'hi', name: 'Hindi', script: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', script: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', script: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', script: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', script: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', script: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', script: 'বাংলা', flag: '🇮🇳' },
  { code: 'en', name: 'English', script: 'English', flag: '🇮🇳' },
];

const ENGLISH_LEVELS: Array<{
  id: EnglishLevel;
  title: string;
  emoji: string;
  description: string;
}> = [
  {
    id: 'beginner',
    title: 'Beginner',
    emoji: '🌱',
    description: 'Starting with basic everyday words & short phrases',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    emoji: '🌿',
    description: 'Understand English, want to speak fluently without hesitation',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    emoji: '🌳',
    description: 'Polishing grammar, accent, and job interview confidence',
  },
];

export default function Login() {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [motherTongue, setMotherTongue] = useState('hi');
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>('beginner');
  const [usesSignLanguage, setUsesSignLanguage] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStep(2);
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      login(name.trim(), email.trim(), {
        motherTongue,
        englishLevel,
        usesSignLanguage,
        onboardingCompleted: true,
      });
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-white text-deep-brown p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Decorative Warm Sand & Terracotta Ambient Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl animate-gentle-float" />
        <div className="absolute top-1/2 -right-32 w-[30rem] h-[30rem] bg-turmeric/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-peacock-teal/10 rounded-full blur-3xl" />
        {/* Soft geometric accent lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4A373_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <div className="w-full max-w-xl relative z-10 py-8">
        {/* Brand Header with Gentle Breathing Logo Orb */}
        <div className="text-center mb-6 sm:mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-terracotta via-turmeric to-terracotta shadow-warm-lg mb-4 animate-breathe group"
            title="EduVaani Home"
          >
            <Mic className="h-10 w-10 text-cream-white group-hover:scale-110 transition-transform" />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-deep-brown font-display tracking-tight">
            EduVaani
          </h1>
          <p className="text-terracotta font-bold text-sm sm:text-base mt-1 font-display">
            आपकी आवाज़, आपकी पहचान
          </p>
          <p className="text-deep-brown/60 text-xs sm:text-sm mt-0.5">
            AI Voice & Indian Sign Language Tutor for Bharat 🇮🇳
          </p>
        </div>

        {/* Centered Main Card */}
        <div className="bg-warm-ivory border border-warm-sand rounded-3xl p-6 sm:p-8 shadow-warm-lg backdrop-blur-md relative">
          
          {/* Step Progress Pills */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-warm-sand/80">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                  step === 1
                    ? 'bg-terracotta text-cream-white shadow-xs'
                    : 'bg-peacock-teal text-cream-white'
                }`}
              >
                {step === 2 ? '✓' : '1'}
              </span>
              <span
                className={`text-xs font-bold font-display ${
                  step === 1 ? 'text-deep-brown' : 'text-deep-brown/60'
                }`}
              >
                Identity
              </span>
            </div>

            <div className="w-12 h-0.5 bg-warm-sand rounded-full overflow-hidden">
              <div
                className={`h-full bg-terracotta transition-all duration-300 ${
                  step === 1 ? 'w-1/2' : 'w-full'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                  step === 2
                    ? 'bg-terracotta text-cream-white shadow-xs'
                    : 'bg-warm-sand text-deep-brown/60'
                }`}
              >
                2
              </span>
              <span
                className={`text-xs font-bold font-display ${
                  step === 2 ? 'text-deep-brown' : 'text-deep-brown/60'
                }`}
              >
                Preferences
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* ================= STEP 1: IDENTITY ================= */
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-terracotta" />
                    <h2 className="text-base sm:text-lg font-bold text-deep-brown font-display">
                      Create Your Learner Profile
                    </h2>
                  </div>
                  <Badge variant="turmeric" className="text-[10px]">
                    Free Instant Access
                  </Badge>
                </div>

                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-deep-brown/80 mb-1.5 font-display">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep-brown/45" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        required
                        className="w-full pl-11 pr-4 py-3 bg-warm-sand/40 border border-warm-sand focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 rounded-2xl text-deep-brown placeholder:text-deep-brown/40 outline-none transition-all text-sm font-medium shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-deep-brown/80 mb-1.5 font-display">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep-brown/45" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. priya@example.com"
                        required
                        className="w-full pl-11 pr-4 py-3 bg-warm-sand/40 border border-warm-sand focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 rounded-2xl text-deep-brown placeholder:text-deep-brown/40 outline-none transition-all text-sm font-medium shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full text-base font-bold shadow-warm-sm group"
                    >
                      <span>Continue to Preferences</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </form>

                {/* Social Proof */}
                <div className="mt-6 pt-5 border-t border-warm-sand/80 text-center space-y-3">
                  <p className="text-xs font-semibold text-deep-brown/70 flex items-center justify-center gap-1.5">
                    <span>🌟</span>
                    <span>Join 10,000+ learners speaking English with confidence across India</span>
                  </p>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                    {[
                      { icon: '🎤', label: 'Voice-First' },
                      { icon: '🇮🇳', label: '8 Languages' },
                      { icon: '💎', label: '100% Free' },
                      { icon: '🤟', label: 'Sign Support' },
                    ].map((badge) => (
                      <div
                        key={badge.label}
                        className="bg-cream-white border border-warm-sand rounded-xl p-2.5 text-center shadow-xs"
                      >
                        <div className="text-lg mb-0.5">{badge.icon}</div>
                        <div className="text-[11px] font-bold text-deep-brown font-display">
                          {badge.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ================= STEP 2: PREFERENCES ================= */
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center text-xs font-bold text-deep-brown/70 hover:text-terracotta transition-colors group cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Details
                  </button>
                  <Badge variant="teal" className="text-[10px] font-bold">
                    Customized Experience
                  </Badge>
                </div>

                <form onSubmit={handleCompleteOnboarding} className="space-y-6">
                  {/* 1. Mother Tongue Selection Grid */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-deep-brown font-display">
                      Choose your mother tongue (मातृभाषा)
                    </label>
                    <p className="text-[11px] text-deep-brown/65">
                      EduVaani will explain new English concepts and vocabulary in this language.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {MOTHER_TONGUES.map((lang) => {
                        const isSelected = motherTongue === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => setMotherTongue(lang.code)}
                            className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-cream-white border-2 border-terracotta shadow-warm-sm ring-1 ring-terracotta/30'
                                : 'bg-cream-white/60 border-warm-sand hover:border-terracotta/50 hover:bg-cream-white'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="text-base">{lang.flag}</span>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-terracotta text-cream-white flex items-center justify-center text-[10px]">
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-deep-brown font-display">
                                {lang.script}
                              </div>
                              <div className="text-[10px] text-deep-brown/60">
                                {lang.name}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. English Fluency Level Cards */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-deep-brown font-display">
                      Your current English level
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {ENGLISH_LEVELS.map((lvl) => {
                        const isSelected = englishLevel === lvl.id;
                        return (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() => setEnglishLevel(lvl.id)}
                            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-cream-white border-2 border-terracotta shadow-warm-sm ring-1 ring-terracotta/30'
                                : 'bg-cream-white/60 border-warm-sand hover:border-terracotta/50 hover:bg-cream-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-2xl">{lvl.emoji}</span>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-terracotta text-cream-white flex items-center justify-center text-[10px]">
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-deep-brown font-display">
                                {lvl.title}
                              </div>
                              <div className="text-[10px] text-deep-brown/65 mt-0.5 line-clamp-2">
                                {lvl.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Accessibility Needs Toggle */}
                  <div className="p-3.5 bg-warm-sand/30 border border-warm-sand rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-peacock-teal/15 text-peacock-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HeartHandshake className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-deep-brown font-display flex items-center gap-1.5">
                          <span>Accessibility Needs</span>
                          <span className="text-xs">🤟</span>
                        </div>
                        <p className="text-[11px] text-deep-brown/70 leading-relaxed mt-0.5">
                          I use Indian Sign Language (ISL). Enables camera gesture recognition & sign tools prominently.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={usesSignLanguage}
                      onClick={() => setUsesSignLanguage(!usesSignLanguage)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        usesSignLanguage ? 'bg-terracotta' : 'bg-warm-sand'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-cream-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          usesSignLanguage ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      variant="primary"
                      size="lg"
                      className="w-full text-base font-bold shadow-warm-sm group"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-cream-white/30 border-t-cream-white rounded-full animate-spin" />
                          <span>Setting up your classroom...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          <span>Start Learning</span>
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security & Privacy Footer Guarantee */}
        <div className="flex items-center justify-center gap-2 text-deep-brown/60 text-xs mt-6 text-center">
          <ShieldCheck className="h-4 w-4 text-peacock-teal" />
          <span>Zero passwords, zero credit cards • Stored safely on your device</span>
        </div>
      </div>
    </div>
  );
}

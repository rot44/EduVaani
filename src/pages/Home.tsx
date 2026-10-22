import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  Globe,
  ArrowRight,
  Zap,
  BookOpen,
  ChevronRight,
  Volume2,
  CheckCircle2,
  Star,
  Users,
  Play
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { getUser } from '../lib/auth';
import { speechService } from '../lib/speech';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

const LANGUAGES_DEMO = [
  { code: 'hi', name: 'Hindi', script: 'हिंदी', flag: '🇮🇳', greeting: 'नमस्ते! आज आप कैसे हैं?' },
  { code: 'mr', name: 'Marathi', script: 'मराठी', flag: '🇮🇳', greeting: 'नमस्कार! आज तुमचा दिवस कसा गेला?' },
  { code: 'gu', name: 'Gujarati', script: 'ગુજરાતી', flag: '🇮🇳', greeting: 'નમસ્તે! ચાલો આજે અંગ્રેજી બોલવાની પ્રેક્ટિસ કરીએ!' },
  { code: 'ta', name: 'Tamil', script: 'தமிழ்', flag: '🇮🇳', greeting: 'வணக்கம்! இன்று ஆங்கிலம் பேசலாம் வாருங்கள்!' },
  { code: 'te', name: 'Telugu', script: 'తెలుగు', flag: '🇮🇳', greeting: 'నమస్కారం! ఈరోజు ఇంగ్లీష్ మాట్లాడటం ప్రాక్టీస్ చేద్దాం!' },
  { code: 'kn', name: 'Kannada', script: 'ಕನ್ನಡ', flag: '🇮🇳', greeting: 'ನಮಸ್ಕಾರ! ಇಂದು ಇಂಗ್ಲಿಷ್ ಅಭ್ಯಾಸ ಮಾಡೋಣ ಬನ್ನಿ!' },
  { code: 'bn', name: 'Bengali', script: 'বাংলা', flag: '🇮🇳', greeting: 'নমস্কার! আসুন আজ একসাথে ইংরেজি বলা অনুশীলন করি!' },
  { code: 'en', name: 'English', script: 'Indian English', flag: '🇺🇸', greeting: 'Namaste! Ready to speak English fluently?' },
];

const SCENARIOS = [
  { emoji: '🛒', title: 'भारतीय बाज़ार (Bazaar)', desc: 'Shopping, bargaining & everyday market conversations in English', tag: 'Daily Life' },
  { emoji: '🏫', title: 'स्कूल में (At School)', desc: 'Talking to teachers, asking questions in class & homework help', tag: 'Education' },
  { emoji: '🏥', title: 'डॉक्टर के पास (Doctor)', desc: 'Explaining symptoms, understanding medicines & healthcare advice', tag: 'Healthcare' },
  { emoji: '✈️', title: 'हवाई अड्डा (Airport)', desc: 'Check-in, boarding gates, flight announcements & luggage inquiries', tag: 'Travel' },
  { emoji: '🍛', title: 'रेस्टोरेंट (Restaurant)', desc: 'Reading menus, ordering food, spice levels & requesting the bill', tag: 'Dining' },
  { emoji: '💼', title: 'नौकरी इंटरव्यू (Job Interview)', desc: 'Professional introductions, career goals & interview confidence', tag: 'Career' },
  { emoji: '📚', title: 'कहानियों का संसार (Story Kingdom)', desc: 'Storytelling with Indian folk fables, moral lessons & adventures', tag: 'Fun' },
  { emoji: '🏡', title: 'घर और परिवार (Family)', desc: 'Festival celebrations, Diwali, Eid, relatives & joyful family chats', tag: 'Culture' },
  { emoji: '🏏', title: 'क्रिकेट मैदान (Cricket Talk)', desc: 'Discussing live match shots, favorite cricketers & sports action', tag: 'Sports' },
];

const TESTIMONIALS = [
  {
    name: 'Pooja Sharma',
    role: 'College Student, Delhi University',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content:
      'I used to hesitate speaking English during college seminars because I was scared of making grammar mistakes. EduVaani gave me a judgment-free space to practice in Hindi and English. Now I speak with genuine confidence!',
    rating: 5,
  },
  {
    name: 'Rohan Deshmukh',
    role: 'Software Engineer, Pune',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content:
      'The Job Interview scenario is incredible! It gave me realistic questions and coached me politely on better phrasing. It directly helped me clear my client interview last month.',
    rating: 5,
  },
  {
    name: 'Kavitha Sundaram',
    role: 'Parent, Chennai',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    content:
      'My 10-year-old son practices for 15 minutes every evening. The fact that he can see Tamil translations whenever he gets stuck makes learning so joyful and stress-free.',
    rating: 5,
  },
];

const FAQS = [
  {
    q: 'Can I practice if my English is very basic?',
    a: 'Absolutely! EduVaani is specifically designed for beginners and intermediate learners across India. You can speak in your mother tongue (Hindi, Marathi, Tamil, etc.) whenever you get stuck, and EduVaani will explain and translate everything clearly.',
  },
  {
    q: 'How does the voice tutor work?',
    a: 'EduVaani uses cutting-edge AI models (Google Gemini & Sarvam AI) alongside speech recognition. When you tap the glowing microphone orb, it listens to your voice, understands your context, and speaks back aloud with natural pronunciation.',
  },
  {
    q: 'Is EduVaani completely free?',
    a: 'Yes! EduVaani is 100% free to use. There are no paywalls, subscriptions, or credit card requirements. Just sign in with your name and start speaking.',
  },
  {
    q: 'What makes EduVaani different from apps like Duolingo?',
    a: 'Most apps rely on multiple-choice quizzes and tapping word tiles. EduVaani is voice-first: you practice actual back-and-forth speaking in authentic Indian contexts like markets, schools, and job interviews, with translations in 8 Indian regional languages.',
  },
  {
    q: 'Which browsers are recommended?',
    a: 'Google Chrome and Microsoft Edge (on desktop and Android mobile) provide the best native voice recognition and speech synthesis support.',
  },
];

export default function Home() {
  const user = getUser();
  const navigate = useNavigate();
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-orange-500 selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-16 sm:pt-24 lg:pt-32 pb-20 sm:pb-28 overflow-hidden">
          {/* Subtle radial gradients */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-orange-600/15 via-amber-500/10 to-indigo-600/10 blur-[130px] rounded-full" />
            <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-float-delayed" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl animate-float" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Heading & CTAs */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8">
                
                {/* Announcement pill */}
                <div className="inline-flex items-center gap-2.5 glass border border-orange-500/40 px-4 py-1.5 rounded-full text-xs font-semibold text-orange-200 shadow-xl backdrop-blur-md">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>🇮🇳 Powered by Google Gemini & Sarvam AI</span>
                  <Badge variant="saffron" className="text-[10px] py-0 px-1.5">Free</Badge>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] font-display">
                  Speak English with{' '}
                  <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                    Unstoppable Confidence
                  </span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  EduVaani is India's voice-first regional AI tutor. Practice real conversations in authentic Indian settings with instant translations in <span className="text-orange-300 font-semibold">Hindi, Marathi, Tamil, Bengali</span> & 4 more languages.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  {user ? (
                    <Button
                      onClick={() => navigate('/dashboard')}
                      size="lg"
                      variant="glow"
                      className="w-full sm:w-auto text-base group"
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Open My Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      size="lg"
                      variant="glow"
                      className="w-full sm:w-auto text-base group"
                    >
                      <Link to="/login">
                        <Mic className="mr-2 h-5 w-5 animate-pulse" />
                        Start Speaking Free
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  )}

                  <a
                    href="#how-it-works"
                    className="w-full sm:w-auto glass border border-white/15 text-white/80 hover:text-white hover:border-white/30 rounded-2xl px-6 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Play className="h-4 w-4 text-orange-400 fill-orange-400" />
                    How It Works
                  </a>
                </div>

                {/* Trust badges */}
                <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-white/50">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Zero Credit Card</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>8 Indian Languages</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Zero Judgment</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive Voice Preview Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative glass border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-2xl">
                  
                  {/* Decorative corner glow */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 shadow-lg animate-bounce" />
                  
                  {/* Mock voice tutor interface */}
                  <div className="bg-slate-900/90 rounded-2xl p-5 border border-white/10 space-y-4 shadow-inner">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                          <Mic className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm">EduVaani AI Tutor</div>
                          <div className="text-emerald-400 text-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live Voice Ready
                          </div>
                        </div>
                      </div>
                      <Badge variant="saffron" className="text-[10px]">
                        Indian Bazaar 🛒
                      </Badge>
                    </div>

                    {/* Dialogue bubbles */}
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-start">
                        <div className="glass border border-white/15 text-white/90 rounded-2xl rounded-bl-sm p-3 max-w-[85%] leading-relaxed">
                          "Namaste! 🙏 Welcome to the bazaar. Are you looking for fresh mangoes or vegetables today?"
                          <div className="mt-2 text-amber-300/80 text-[11px] pt-1.5 border-t border-white/10">
                            (हिंदी: नमस्ते! बाज़ार में स्वागत है। क्या आप आज ताज़े आम या सब्ज़ियाँ देख रहे हैं?)
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl rounded-br-sm p-3 max-w-[80%] leading-relaxed font-medium shadow-md">
                          "Yes, how much are these Alfonso mangoes per kilo?"
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="glass border border-white/15 text-white/90 rounded-2xl rounded-bl-sm p-3 max-w-[85%] leading-relaxed">
                          "They are ₹120 per kilo, very sweet and fresh! Would you like 2 kilos?"
                        </div>
                      </div>
                    </div>

                    {/* Interactive Audio Test Orb */}
                    <div className="pt-3 flex flex-col items-center">
                      <button
                        onClick={() => testAudioGreeting("Namaste! Welcome to EduVaani. Let's practice English together!", "en")}
                        disabled={playingCode === 'en'}
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/30"
                        title="Click to test live speech audio"
                      >
                        <Volume2 className={`h-6 w-6 ${playingCode === 'en' ? 'animate-bounce text-yellow-200' : ''}`} />
                      </button>
                      <p className="text-[11px] text-white/50 mt-2">
                        {playingCode === 'en' ? '🔊 Speaking...' : 'Tap to hear voice demo'}
                      </p>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* STATS COUNTER STRIP */}
        <section className="py-12 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 relative overflow-hidden shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { number: '10,000+', label: 'Indian Learners', icon: Users },
                { number: '8', label: 'Regional Languages', icon: Globe },
                { number: '9', label: 'Real Scenarios', icon: BookOpen },
                { number: '98%', label: 'Speaking Confidence', icon: Star },
              ].map(({ number, label, icon: Icon }) => (
                <div key={label} className="group">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white font-display">{number}</div>
                  <div className="text-orange-100 text-sm font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8 REGIONAL LANGUAGES SHOWCASE */}
        <section className="py-20 lg:py-28 bg-slate-950 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="saffron" className="mb-3">
                Zero Language Barriers
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-bold font-display text-white">
                Learn English in Your{' '}
                <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Mother Tongue
                </span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg mt-4 leading-relaxed">
                Click any language below to hear how EduVaani greets and teaches you in your native tongue.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {LANGUAGES_DEMO.map((lang) => (
                <div
                  key={lang.code}
                  onClick={() => testAudioGreeting(lang.greeting, lang.code)}
                  className="group glass border border-white/10 hover:border-orange-500/40 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <button
                        title="Play audio greeting"
                        className="text-orange-400 hover:text-orange-300 p-1.5 rounded-full bg-white/5 border border-white/10"
                      >
                        <Volume2 className={`h-4 w-4 ${playingCode === lang.code ? 'animate-bounce text-emerald-400' : ''}`} />
                      </button>
                    </div>
                    <div className="font-bold text-white text-lg font-display">{lang.name}</div>
                    <div className="text-sm text-amber-300 font-semibold mb-2">{lang.script}</div>
                    <p className="text-xs text-white/60 italic leading-relaxed bg-white/[0.02] p-2 rounded-xl">
                      "{lang.greeting}"
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-white/5 text-[11px] text-white/40 flex items-center justify-between">
                    <span>Tap to listen</span>
                    <span className="text-orange-300 group-hover:translate-x-1 transition-transform">🔊 Play</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9 PRACTICE SCENARIOS */}
        <section id="how-it-works" className="py-20 lg:py-28 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="saffron" className="mb-3">
                Culturally Grounded
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-bold font-display text-white">
                9 Real-Life{' '}
                <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Indian Practice Worlds
                </span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg mt-4 leading-relaxed">
                Practice in situations you actually encounter — from negotiating at the vegetable market to cracking your dream job interview.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SCENARIOS.map((s) => (
                <div
                  key={s.title}
                  onClick={() => navigate('/login')}
                  className="group glass border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-lg card-glow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl p-3 rounded-2xl bg-white/[0.05] border border-white/10 group-hover:scale-110 transition-transform">
                        {s.emoji}
                      </div>
                      <Badge variant="outline" className="text-[11px]">
                        {s.tag}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-white text-lg group-hover:text-orange-300 transition-colors font-display mb-1.5">
                      {s.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                  
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-orange-300 font-semibold">
                    <span>Practice Scenario</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BEFORE VS AFTER CONFIDENCE SECTION */}
        <section className="py-20 bg-slate-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold font-display text-white">
                Why Traditional English Learning{' '}
                <span className="text-red-400">Fails</span> vs How EduVaani{' '}
                <span className="text-emerald-400">Wins</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Without EduVaani */}
              <div className="glass border border-red-500/20 bg-red-950/10 rounded-3xl p-7 shadow-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 font-bold">
                    ✕
                  </div>
                  <h3 className="text-xl font-bold text-red-200 font-display">Traditional App / Classroom</h3>
                </div>
                <ul className="space-y-3.5 text-sm text-white/70">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Only multiple choice questions; you never actually speak out loud.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Fear of being judged or laughed at by peers and teachers.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Western contexts (e.g. bagels, baseball) that don't match Indian life.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Grammar rules memorization without natural speaking fluency.</span>
                  </li>
                </ul>
              </div>

              {/* With EduVaani */}
              <div className="glass border border-emerald-500/30 bg-emerald-950/10 rounded-3xl p-7 shadow-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-emerald-200 font-display">With EduVaani</h3>
                </div>
                <ul className="space-y-3.5 text-sm text-white/80">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>100% voice-first:</strong> You speak out loud and get instant audio answers.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Zero fear:</strong> Private, patient AI tutor that encourages you every step.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Real Indian contexts:</strong> Bazaars, railway stations, Indian clinics & tech jobs.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Mother tongue support:</strong> Hindi, Marathi, Tamil translations whenever you get stuck.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="saffron" className="mb-3">
                Learner Stories
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-bold font-display text-white">
                Loved Across{' '}
                <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                  India
                </span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg mt-4 leading-relaxed">
                See how students, professionals, and parents are overcoming hesitation with EduVaani.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={idx}
                  className="glass border border-white/10 rounded-3xl p-7 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-6 italic">
                      "{t.content}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover border border-orange-400/30"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm font-display">{t.name}</h4>
                      <p className="text-white/50 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQS ACCORDION SECTION */}
        <section className="py-20 bg-slate-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="saffron" className="mb-3">
                Got Questions?
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="glass border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-base sm:text-lg">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-white/70">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-20 lg:py-28 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass border border-orange-500/30 rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
              
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <span className="text-5xl">🇮🇳</span>
                <h2 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight">
                  Your Spoken English Journey{' '}
                  <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                    Begins Today
                  </span>
                </h2>
                <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                  Join thousands of learners building fluency and confidence, one conversation at a time. Free forever.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  {user ? (
                    <Button
                      onClick={() => navigate('/dashboard')}
                      size="lg"
                      variant="glow"
                      className="w-full sm:w-auto text-base group"
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Back to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      size="lg"
                      variant="glow"
                      className="w-full sm:w-auto text-base group"
                    >
                      <Link to="/login">
                        <Mic className="mr-2 h-5 w-5" />
                        Start Speaking Now
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

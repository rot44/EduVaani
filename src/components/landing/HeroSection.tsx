import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mic,
  ArrowRight,
  Zap,
  CheckCircle2,
  Volume2,
  Sparkles,
  Bot
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { speechService } from '../../lib/speech';
import type { User } from '../../lib/auth';

interface HeroSectionProps {
  user: User | null;
}

export function HeroSection({ user }: HeroSectionProps) {
  const navigate = useNavigate();
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const playDemoAudio = async () => {
    try {
      setIsPlayingDemo(true);
      speechService.setLanguage('en');
      await speechService.speak(
        "Namaste! Welcome to EduVaani. Let's practice speaking English together with confidence!",
        0.9
      );
    } finally {
      setIsPlayingDemo(false);
    }
  };

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('how-it-works');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-12 sm:pt-20 lg:pt-28 pb-16 sm:pb-24 overflow-hidden bg-gradient-to-b from-cream-white via-warm-ivory/50 to-cream-white">
      {/* Subtle warm ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-warm-sand/40 via-turmeric/10 to-terracotta/5 blur-3xl rounded-full" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-turmeric/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-warm-sand/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Subheading & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8"
          >
            {/* Announcement pill */}
            <div className="inline-flex items-center gap-2.5 bg-warm-ivory border border-warm-sand px-4 py-1.5 rounded-full text-xs font-semibold text-deep-brown shadow-warm-sm">
              <span className="flex h-2 w-2 rounded-full bg-peacock-teal animate-ping" />
              <span>🇮🇳 Powered by Google Gemini & Sarvam AI</span>
              <Badge variant="turmeric" className="text-[10px] py-0 px-2 font-bold">
                Free Forever
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] font-display text-deep-brown">
              Speak English with{' '}
              <span className="bg-gradient-to-r from-terracotta via-terracotta-light to-turmeric bg-clip-text text-transparent">
                Unstoppable Confidence
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-deep-brown/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
              EduVaani is India&apos;s voice-first regional AI tutor. Practice real conversations in authentic Indian settings with instant guidance in <span className="font-semibold text-terracotta">Hindi, Marathi, Tamil, Bengali</span> & 4 more languages.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
              {user ? (
                <Button
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto text-base group shadow-terracotta"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Open My Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto text-base group shadow-terracotta"
                >
                  <Link to="/login">
                    <Mic className="mr-2 h-5 w-5" />
                    Start Speaking Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto text-base"
              >
                See How It Works
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-5 sm:gap-6 text-xs text-deep-brown/70 flex-wrap">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-peacock-teal" />
                <span className="font-medium">Zero Credit Card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-peacock-teal" />
                <span className="font-medium">8 Indian Languages</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-peacock-teal" />
                <span className="font-medium">Zero Judgment</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Animated Voice Orb Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl border border-warm-sand bg-warm-ivory p-6 sm:p-7 shadow-warm-lg">
              
              {/* Corner accent pill */}
              <div className="flex items-center justify-between pb-4 border-b border-warm-sand">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-terracotta to-turmeric flex items-center justify-center shadow-warm-sm text-cream-white">
                    <Mic className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-deep-brown font-display">EduVaani AI Voice Tutor</div>
                    <div className="text-peacock-teal text-xs flex items-center gap-1 font-medium">
                      <span className="w-2 h-2 rounded-full bg-peacock-teal animate-pulse" />
                      Live Indian English
                    </div>
                  </div>
                </div>
                <Badge variant="turmeric" className="text-[11px] font-bold">
                  Bazaar Scenario 🛒
                </Badge>
              </div>

              {/* Sample Dialogue Bubbles */}
              <div className="space-y-3.5 my-5 text-xs">
                {/* AI Tutor Bubble */}
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm p-3.5 max-w-[88%] bg-cream-white border border-warm-sand text-deep-brown shadow-warm-sm space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-terracotta">
                      <Bot className="h-3 w-3" />
                      EduVaani
                    </div>
                    <p className="leading-relaxed">
                      "Namaste! 🙏 Welcome to the bazaar. Are you looking for fresh Alfonso mangoes or vegetables today?"
                    </p>
                    <div className="text-[10px] text-deep-brown/60 pt-1 border-t border-warm-sand/60">
                      (नमस्ते! बाज़ार में स्वागत है। क्या आप आज ताज़े आम या सब्ज़ियाँ देख रहे हैं?)
                    </div>
                  </div>
                </div>

                {/* Student Bubble */}
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-br-sm p-3 max-w-[82%] bg-terracotta text-cream-white shadow-warm-sm font-medium leading-relaxed">
                    "Yes! How much are these Alfonso mangoes per kilo?"
                  </div>
                </div>

                {/* AI Coaching Subtitle */}
                <div className="bg-warm-sand/50 rounded-xl p-2.5 border border-warm-sand text-[11px] text-deep-brown space-y-0.5">
                  <span className="font-bold text-peacock-teal flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI Coach Tip: 92% Fluency
                  </span>
                  <p className="text-deep-brown/80">
                    Perfect question! Polite and natural for Indian markets.
                  </p>
                </div>
              </div>

              {/* Interactive Audio Demo Orb */}
              <div className="pt-2 flex flex-col items-center border-t border-warm-sand/60">
                <button
                  onClick={playDemoAudio}
                  disabled={isPlayingDemo}
                  className={`w-14 h-14 rounded-full bg-gradient-to-tr from-terracotta to-turmeric flex items-center justify-center text-cream-white shadow-warm-md hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-cream-white ${
                    isPlayingDemo ? 'animate-pulse ring-4 ring-terracotta/30' : ''
                  }`}
                  title="Click to hear EduVaani speech demo"
                >
                  <Volume2 className={`h-6 w-6 ${isPlayingDemo ? 'animate-bounce' : ''}`} />
                </button>
                <p className="text-xs font-semibold text-deep-brown/70 mt-2">
                  {isPlayingDemo ? '🔊 EduVaani is speaking...' : 'Tap orb to hear native voice demo'}
                </p>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

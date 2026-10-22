import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Eye, HeartHandshake, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface AccessibilityHighlightProps {
  userLoggedIn?: boolean;
}

export function AccessibilityHighlight({ userLoggedIn }: AccessibilityHighlightProps) {
  const targetLink = userLoggedIn ? '/dashboard' : '/login';

  return (
    <section className="py-20 lg:py-24 bg-cream-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-warm-sand bg-gradient-to-br from-warm-ivory via-warm-ivory to-warm-sand/30 p-8 sm:p-12 lg:p-16 shadow-warm relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-peacock-teal/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-turmeric/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2">
                <Badge variant="teal" className="text-xs py-1 px-3">
                  Inclusive Bharat Initiative 🇮🇳
                </Badge>
                <span className="text-xl">🤟</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-deep-brown font-display tracking-tight leading-[1.15]">
                Learning Without Barriers{' '}
                <span className="text-peacock-teal">🤟</span>
              </h2>

              <p className="text-base sm:text-lg text-deep-brown/80 leading-relaxed font-sans max-w-2xl">
                EduVaani is expanding to support <strong>Indian Sign Language (ISL)</strong> so deaf, hard-of-hearing, and speech-impaired learners across India can build English literacy and communication skills with visual AI.
              </p>

              {/* 3 Pillar Features */}
              <div className="grid sm:grid-cols-3 gap-4 pt-2 text-left">
                <div className="p-4 rounded-2xl bg-cream-white/80 border border-warm-sand">
                  <Camera className="h-6 w-6 text-peacock-teal mb-2" />
                  <h4 className="font-bold text-sm text-deep-brown font-display">Camera Gesture AI</h4>
                  <p className="text-xs text-deep-brown/70 mt-1">Recognizes ISL hand signs and translates them to English in real time.</p>
                </div>

                <div className="p-4 rounded-2xl bg-cream-white/80 border border-warm-sand">
                  <Eye className="h-6 w-6 text-terracotta mb-2" />
                  <h4 className="font-bold text-sm text-deep-brown font-display">Visual Speech Coach</h4>
                  <p className="text-xs text-deep-brown/70 mt-1">Animated visual cues, phonetic lip maps, and visual subtitle pacing.</p>
                </div>

                <div className="p-4 rounded-2xl bg-cream-white/80 border border-warm-sand">
                  <HeartHandshake className="h-6 w-6 text-turmeric-dark mb-2" />
                  <h4 className="font-bold text-sm text-deep-brown font-display">100% Free & Open</h4>
                  <p className="text-xs text-deep-brown/70 mt-1">Equal educational opportunity for special schools and rural learners.</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Button asChild size="lg" variant="secondary" className="shadow-teal">
                  <Link to={targetLink}>
                    <span className="text-xl mr-2">🤟</span>
                    Explore Sign Language Mode
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Visual Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl border border-warm-sand bg-cream-white p-6 shadow-warm-md text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-peacock-teal to-peacock-teal-light flex items-center justify-center text-4xl shadow-warm-sm text-cream-white">
                  🤟
                </div>
                
                <h3 className="text-lg font-bold text-deep-brown font-display">
                  Indian Sign Language (ISL) Engine
                </h3>
                
                <p className="text-xs text-deep-brown/70 leading-relaxed">
                  "Hello, my name is Rahul" represented visually in ISL with synchronized English glosses.
                </p>

                <div className="p-3 bg-warm-sand/50 rounded-2xl border border-warm-sand text-xs text-deep-brown space-y-1">
                  <div className="flex items-center justify-between font-bold text-[11px] text-peacock-teal">
                    <span>Camera Status</span>
                    <span>Ready for Signs</span>
                  </div>
                  <div className="flex justify-center gap-2 py-1 text-2xl">
                    <span>👋</span>
                    <span>👉</span>
                    <span>🤝</span>
                    <span>✨</span>
                  </div>
                  <p className="text-[10px] text-deep-brown/60">
                    High accuracy gesture recognition trained for Indian regional dialects.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}

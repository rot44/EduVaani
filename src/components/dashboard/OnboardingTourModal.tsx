import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, X, Check, Compass } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export interface TourStep {
  targetId: string;
  title: string;
  heading: string;
  description: string;
  emoji: string;
  actionHint: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-quick-chat',
    title: 'Voice-First AI Tutor',
    heading: 'Practice Speaking with AI 🎙️',
    description:
      'Start an open-ended, free-flowing voice conversation anytime with Vaani. Speak naturally in English, get instant spoken replies in seconds, and receive gentle grammar tips in your mother tongue.',
    emoji: '🎙️',
    actionHint: 'Tap "Start Free Chat" to begin speaking without any judgment.',
  },
  {
    targetId: 'tour-scenario-grid',
    title: 'Real-Life Contexts',
    heading: 'Try Different Scenarios 🛒',
    description:
      'Immerse yourself in authentic Indian situations — bargaining at the local vegetable bazaar, ordering food, job interviews, or doctor consultations. Learn what to say in real life!',
    emoji: '🛒',
    actionHint: 'Filter by Daily, Travel, Career, or Stories to find your favorite.',
  },
  {
    targetId: 'tour-sign-card',
    title: 'Inclusive Bharat',
    heading: 'Use Indian Sign Language 🤟',
    description:
      'EduVaani connects Voice, Text, and Indian Sign Language (ISL) seamlessly! Practice hand gestures in front of your webcam or watch any English sentence converted into authentic sign animations.',
    emoji: '🤟',
    actionHint: 'Switch to Sign mode anytime during conversations or open the Sign Studio.',
  },
];

interface OnboardingTourModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export function OnboardingTourModal({ isOpen, onDismiss }: OnboardingTourModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Scroll target element into view whenever current step changes
  useEffect(() => {
    if (!isOpen) return;
    const targetElement = document.getElementById(currentStep.targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a gentle temporary highlight ring to the target element
      targetElement.classList.add('ring-4', 'ring-terracotta', 'ring-offset-4', 'ring-offset-cream-white', 'transition-all');
      return () => {
        targetElement.classList.remove('ring-4', 'ring-terracotta', 'ring-offset-4', 'ring-offset-cream-white');
      };
    }
  }, [isOpen, currentStepIndex, currentStep.targetId]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onDismiss();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-deep-brown/50 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-warm-ivory border border-warm-sand rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background radial glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-terracotta/15 to-turmeric/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-peacock-teal font-display">
                Quick Tour • Step {currentStepIndex + 1} of {TOUR_STEPS.length}
              </span>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1.5 text-deep-brown/50 hover:text-deep-brown hover:bg-warm-sand/50 rounded-xl transition-colors cursor-pointer"
            aria-label="Skip tour"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Content with Framer Motion Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 relative z-10"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">{currentStep.emoji}</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-deep-brown font-display tracking-tight">
                  {currentStep.heading}
                </h3>
                <Badge variant="teal" className="text-[10px] font-bold mt-0.5">
                  {currentStep.title}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-deep-brown/75 leading-relaxed font-sans">
              {currentStep.description}
            </p>

            <div className="p-3 bg-cream-white rounded-2xl border border-warm-sand/80 text-xs text-deep-brown/80 flex items-start gap-2 shadow-xs">
              <Sparkles className="h-4 w-4 text-turmeric flex-shrink-0 mt-0.5" />
              <span>{currentStep.actionHint}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tour Navigation Controls */}
        <div className="mt-6 pt-4 border-t border-warm-sand/80 flex items-center justify-between gap-3 relative z-10">
          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'w-6 bg-terracotta'
                    : 'w-2 bg-warm-sand hover:bg-warm-sand-dark'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                className="text-xs rounded-xl"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back
              </Button>
            ) : (
              <button
                type="button"
                onClick={onDismiss}
                className="text-xs font-bold text-deep-brown/60 hover:text-deep-brown px-3 py-1.5 transition-colors cursor-pointer"
              >
                Skip Tour
              </button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              className="text-xs rounded-xl shadow-warm-sm"
            >
              {currentStepIndex < TOUR_STEPS.length - 1 ? (
                <>
                  <span>Next</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </>
              ) : (
                <>
                  <span>Got It! 🚀</span>
                  <Check className="h-3.5 w-3.5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

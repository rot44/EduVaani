import { motion } from 'framer-motion';
import { Mic, BrainCircuit, Trophy, ArrowRight, Sparkles, Check } from 'lucide-react';
import { SectionHeading } from '../ui/section-heading';
import { Badge } from '../ui/badge';

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Tap the Mic',
      subtitle: 'Choose any Indian scenario or start a free chat. Tap the glowing orb and speak naturally in English or your mother tongue.',
      icon: Mic,
      preview: (
        <div className="flex items-center justify-center p-4 bg-cream-white/70 rounded-2xl border border-warm-sand mt-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-terracotta to-turmeric flex items-center justify-center text-cream-white shadow-warm animate-breathe">
              <Mic className="h-6 w-6" />
            </div>
            <div className="absolute -inset-2 rounded-full border border-terracotta/30 animate-ping pointer-events-none" />
          </div>
        </div>
      ),
    },
    {
      step: '02',
      title: 'AI Listens & Coaches',
      subtitle: 'EduVaani understands your Indian accent, gives gentle spoken replies, and offers bilingual grammar tips.',
      icon: BrainCircuit,
      preview: (
        <div className="p-3.5 bg-cream-white/70 rounded-2xl border border-warm-sand mt-4 space-y-1.5 text-left text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-peacock-teal flex items-center gap-1 text-[11px]">
              <Sparkles className="h-3 w-3" /> AI Coach
            </span>
            <Badge variant="teal" className="text-[10px] py-0 px-1.5">
              94% Fluency
            </Badge>
          </div>
          <p className="text-deep-brown font-medium">
            "Better: I would like 2 kilos of mangoes."
          </p>
          <p className="text-deep-brown/65 text-[11px]">
            💡 'I would like' विनम्र अनुरोध के लिए सबसे अच्छा है।
          </p>
        </div>
      ),
    },
    {
      step: '03',
      title: 'You Improve Every Day',
      subtitle: 'Track your speaking minutes, build daily streaks, unlock fluency badges, and watch hesitation melt away.',
      icon: Trophy,
      preview: (
        <div className="p-3.5 bg-cream-white/70 rounded-2xl border border-warm-sand mt-4 space-y-2 text-left text-xs">
          <div className="flex items-center justify-between text-deep-brown font-semibold text-[11px]">
            <span>Level 3: Fluency Explorer</span>
            <span className="text-peacock-teal font-bold">Streak: 5 Days 🔥</span>
          </div>
          <div className="w-full bg-warm-sand h-2 rounded-full overflow-hidden">
            <div className="bg-terracotta h-full rounded-full w-3/4" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-peacock-teal font-medium">
            <Check className="h-3.5 w-3.5 text-peacock-teal" />
            <span>Badge Unlocked: Indian Bazaar Master</span>
          </div>
        </div>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-cream-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Simple & Stress-Free"
          badgeVariant="turmeric"
          title="How EduVaani Works"
          subtitle="No textbook rote memorization. Just speak into your phone or laptop and learn naturally through conversation."
          align="center"
        />

        {/* 3 Step Cards Grid with Connecting Visual Flow */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid md:grid-cols-3 gap-8 relative mt-12"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="relative rounded-3xl border border-warm-sand bg-warm-ivory p-7 shadow-warm hover:-translate-y-1.5 hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Step pill & icon header */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-10 h-10 rounded-2xl bg-terracotta text-cream-white font-extrabold font-display flex items-center justify-center text-sm shadow-warm-sm">
                      {step.step}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-warm-sand/50 border border-warm-sand flex items-center justify-center text-peacock-teal">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-display text-deep-brown mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-deep-brown/75 leading-relaxed font-sans">
                    {step.subtitle}
                  </p>
                </div>

                {/* Interactive visual mini preview */}
                <div className="mt-5 pt-3 border-t border-warm-sand/60">
                  {step.preview}
                </div>

                {/* Connecting arrow for desktop between steps */}
                {idx < 2 && (
                  <div className="hidden lg:block absolute -right-5 top-1/2 -translate-y-1/2 z-20 text-warm-sand bg-cream-white rounded-full p-1 border border-warm-sand">
                    <ArrowRight className="h-5 w-5 text-terracotta" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}

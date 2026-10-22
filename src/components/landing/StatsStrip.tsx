import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { Users, Globe, BookOpen, Star } from 'lucide-react';

interface StatItemProps {
  numericValue: number;
  suffix?: string;
  label: string;
  icon: typeof Users;
}

function AnimatedStat({ numericValue, suffix = '', label, icon: Icon }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);

  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });

  const rounded = useTransform(spring, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      spring.set(numericValue);
    }
  }, [isInView, numericValue, spring]);

  useEffect(() => {
    return rounded.on('change', (v) => setDisplayValue(v));
  }, [rounded]);

  return (
    <div ref={ref} className="group">
      <div className="w-12 h-12 rounded-2xl bg-cream-white/15 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-6 w-6 text-cream-white" />
      </div>
      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream-white font-display tracking-tight">
        {isInView ? (
          <>
            {displayValue.toLocaleString()}
            {suffix}
          </>
        ) : (
          `0${suffix}`
        )}
      </div>
      <div className="text-cream-white/85 text-sm sm:text-base font-medium mt-1">
        {label}
      </div>
    </div>
  );
}

export function StatsStrip() {
  const stats = [
    { numericValue: 10000, suffix: '+', label: 'Indian Learners', icon: Users },
    { numericValue: 8, suffix: '', label: 'Regional Languages', icon: Globe },
    { numericValue: 9, suffix: '', label: 'Real Scenarios', icon: BookOpen },
    { numericValue: 98, suffix: '%', label: 'Speaking Confidence', icon: Star },
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-terracotta via-terracotta-dark to-terracotta text-cream-white relative overflow-hidden shadow-warm-md">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFFDF7_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        >
          {stats.map((stat) => (
            <AnimatedStat
              key={stat.label}
              numericValue={stat.numericValue}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

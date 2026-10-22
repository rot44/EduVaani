import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { SectionHeading } from '../ui/section-heading';

export const TESTIMONIALS = [
  {
    name: 'Pooja Sharma',
    role: 'College Student, Delhi University',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content:
      'I used to hesitate speaking English during college seminars because I was terrified of making grammar mistakes. EduVaani gave me a judgment-free space to practice in Hindi and English. Now I speak with genuine confidence!',
    rating: 5,
    location: 'New Delhi',
  },
  {
    name: 'Rohan Deshmukh',
    role: 'Software Engineer, Pune',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content:
      'The Job Interview scenario is incredible! It gave me realistic questions and coached me politely on better phrasing. It directly helped me crack my client interview last month.',
    rating: 5,
    location: 'Maharashtra',
  },
  {
    name: 'Kavitha Sundaram',
    role: 'Parent & Educator, Chennai',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    content:
      'My 10-year-old son practices for 15 minutes every evening. The fact that he can see Tamil translations whenever he gets stuck makes learning so joyful and completely stress-free.',
    rating: 5,
    location: 'Tamil Nadu',
  },
];

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => {
    setActiveIndex((current) => (current === 0 ? TESTIMONIALS.length - 1 : current - 1));
  };

  const next = () => {
    setActiveIndex((current) => (current === TESTIMONIALS.length - 1 ? 0 : current + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-cream-white via-warm-ivory/30 to-cream-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Learner Stories"
          badgeVariant="turmeric"
          title="Loved by Learners Across India"
          subtitle="See how students, job seekers, and parents across the country are overcoming hesitation and building fluent conversational English."
          align="center"
        />

        {/* Desktop 3-Card Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mt-12">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-3xl border border-warm-sand bg-warm-ivory p-7 sm:p-8 shadow-warm flex flex-col justify-between hover:-translate-y-1 hover:shadow-warm-md transition-all duration-300 relative"
            >
              <div>
                <Quote className="h-8 w-8 text-turmeric/40 mb-3" />
                
                {/* Turmeric Star Rating */}
                <div className="flex items-center gap-1 text-turmeric mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-turmeric text-turmeric" />
                  ))}
                </div>

                <p className="text-deep-brown/85 text-sm leading-relaxed mb-6 italic font-sans">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-warm-sand/60">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-terracotta/30"
                />
                <div>
                  <h4 className="font-bold text-deep-brown text-sm font-display">{t.name}</h4>
                  <p className="text-deep-brown/60 text-xs font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Interactive Carousel */}
        <div className="md:hidden mt-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 shadow-warm flex flex-col justify-between min-h-[300px]"
            >
              <div>
                <Quote className="h-7 w-7 text-turmeric/40 mb-2" />
                
                <div className="flex items-center gap-1 text-turmeric mb-3">
                  {[...Array(TESTIMONIALS[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-turmeric text-turmeric" />
                  ))}
                </div>

                <p className="text-deep-brown/85 text-sm leading-relaxed mb-6 italic font-sans">
                  "{TESTIMONIALS[activeIndex].content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-warm-sand/60">
                <img
                  src={TESTIMONIALS[activeIndex].avatar}
                  alt={TESTIMONIALS[activeIndex].name}
                  className="w-10 h-10 rounded-full object-cover border border-terracotta/30"
                />
                <div>
                  <h4 className="font-bold text-deep-brown text-sm font-display">
                    {TESTIMONIALS[activeIndex].name}
                  </h4>
                  <p className="text-deep-brown/60 text-xs">{TESTIMONIALS[activeIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center justify-between mt-4 px-2">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-warm-sand bg-warm-ivory text-deep-brown shadow-warm-sm hover:bg-warm-sand/60 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === i ? 'w-6 bg-terracotta' : 'w-2 bg-warm-sand'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-full border border-warm-sand bg-warm-ivory text-deep-brown shadow-warm-sm hover:bg-warm-sand/60 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

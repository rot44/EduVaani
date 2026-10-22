import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/section-heading';

export function ComparisonSection() {
  const withoutEduVaani = [
    'Only multiple-choice quizzes and tapping word tiles — you never actually speak out loud.',
    'Constant fear and anxiety of making grammar mistakes or being judged by peers and teachers.',
    'Western contexts (bagels, baseball, subways) that do not match daily life in Indian towns and cities.',
    'Rote memorization of textbook grammar rules without the muscle memory of natural conversational flow.',
  ];

  const withEduVaani = [
    '100% Voice-First: Speak out loud into the glowing AI orb and receive immediate spoken audio responses.',
    'Zero Judgment: A patient, supportive AI tutor available 24/7 that celebrates every attempt and corrects mistakes gently.',
    'Authentic Indian Scenarios: Vegetable markets, Indian classrooms, local clinics, cricket discussions & workplace interviews.',
    'Mother Tongue Support: Instant translation in Hindi, Marathi, Gujarati, Tamil, Bengali & 3 more languages whenever you get stuck.',
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-cream-white via-warm-ivory/40 to-cream-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Why EduVaani"
          badgeVariant="terracotta"
          title="Traditional English Learning vs. EduVaani"
          subtitle="See why traditional classroom methods and tap-the-tile apps leave learners tongue-tied, and how voice immersion builds true fluency."
          align="center"
        />

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          
          {/* Traditional Learning Card (Without) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border-2 border-soft-coral/50 bg-soft-coral/5 p-7 sm:p-8 shadow-warm-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-soft-coral/20 text-soft-coral flex items-center justify-center font-black text-xl">
                  ✕
                </div>
                <div>
                  <h3 className="text-xl font-bold text-deep-brown font-display">
                    Traditional Apps & Classes
                  </h3>
                  <p className="text-xs text-soft-coral font-semibold">The Old, Passive Way</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-deep-brown/80 font-sans">
                {withoutEduVaani.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 leading-relaxed">
                    <span className="text-soft-coral font-bold mt-0.5 text-base">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-soft-coral/20 text-xs text-deep-brown/60 font-medium">
              Result: You know grammar on paper, but freeze when speaking in person.
            </div>
          </motion.div>

          {/* With EduVaani Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border-2 border-peacock-teal/60 bg-peacock-teal/5 p-7 sm:p-8 shadow-warm flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-peacock-teal/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-peacock-teal text-cream-white flex items-center justify-center font-black text-xl shadow-warm-sm">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold text-deep-brown font-display">
                    With EduVaani (एजुवाणी)
                  </h3>
                  <p className="text-xs text-peacock-teal font-semibold">Voice-First Spoken Immersion</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-deep-brown/90 font-sans">
                {withEduVaani.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 leading-relaxed">
                    <span className="text-peacock-teal font-bold mt-0.5 text-base">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-peacock-teal/20 text-xs text-peacock-teal font-semibold">
              Result: Effortless speech, reduced hesitation, and real conversational confidence.
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

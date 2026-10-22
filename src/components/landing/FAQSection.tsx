import { SectionHeading } from '../ui/section-heading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

export const FAQS = [
  {
    q: 'Can I practice if my English is very basic?',
    a: 'Absolutely! EduVaani is designed specifically for beginners and intermediate learners across India. You can speak in your mother tongue (Hindi, Marathi, Tamil, Bengali, etc.) whenever you get stuck, and EduVaani will explain and translate everything clearly.',
  },
  {
    q: 'How does the voice tutor work?',
    a: 'EduVaani uses cutting-edge AI models (Google Gemini & Sarvam AI) alongside high-fidelity speech recognition. When you tap the glowing microphone orb, it listens to your voice, understands Indian accents, and speaks back aloud with natural, friendly Indian English pronunciation.',
  },
  {
    q: 'Is EduVaani completely free?',
    a: 'Yes! EduVaani is 100% free to use. There are no paywalls, hidden subscriptions, or credit card requirements. Just sign in with your name and start speaking immediately.',
  },
  {
    q: 'What makes EduVaani different from apps like Duolingo?',
    a: 'Most apps rely on multiple-choice quizzes and tapping word tiles. EduVaani is voice-first: you practice actual back-and-forth speaking in authentic Indian contexts like local bazaars, classrooms, doctor visits, and job interviews, with instant translations in 8 Indian regional languages.',
  },
  {
    q: 'Which browsers are recommended for voice practice?',
    a: 'Google Chrome and Microsoft Edge (on both desktop and Android mobile) provide the most reliable native speech recognition and synthesis support. EduVaani also includes a built-in microphone diagnostic tool to check your settings anytime.',
  },
];

export function FAQSection() {
  return (
    <section className="py-20 lg:py-24 bg-cream-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Got Questions?"
          badgeVariant="terracotta"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about starting your spoken English practice journey with EduVaani."
          align="center"
        />

        <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 sm:p-10 shadow-warm mt-10">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-warm-sand/80 last:border-b-0">
                <AccordionTrigger className="text-base sm:text-lg font-bold text-deep-brown hover:text-terracotta py-4 sm:py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-deep-brown/75 leading-relaxed font-sans pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
}

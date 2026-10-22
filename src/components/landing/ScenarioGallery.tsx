import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SectionHeading } from '../ui/section-heading';
import { Badge } from '../ui/badge';
import type { User } from '../../lib/auth';

export const SCENARIOS = [
  {
    emoji: '🛒',
    title: 'भारतीय बाज़ार (Indian Bazaar)',
    desc: 'Shopping, bargaining & everyday market conversations in English.',
    tag: 'Daily Life',
    gradient: 'from-terracotta to-terracotta-light',
  },
  {
    emoji: '🏫',
    title: 'स्कूल में (At School)',
    desc: 'Talking to teachers, asking questions in class & homework conversations.',
    tag: 'Education',
    gradient: 'from-peacock-teal to-peacock-teal-light',
  },
  {
    emoji: '🏥',
    title: 'डॉक्टर के पास (Doctor)',
    desc: 'Explaining health symptoms, understanding medicines & medical care.',
    tag: 'Healthcare',
    gradient: 'from-peacock-teal to-peacock-teal-dark',
  },
  {
    emoji: '✈️',
    title: 'हवाई अड्डा (Airport & Travel)',
    desc: 'Check-in, security gates, luggage inquiries & flight announcements.',
    tag: 'Travel',
    gradient: 'from-terracotta-dark to-terracotta',
  },
  {
    emoji: '🍛',
    title: 'रेस्टोरेंट (Restaurant)',
    desc: 'Reading menus, ordering food, asking spice levels & bill requests.',
    tag: 'Dining',
    gradient: 'from-turmeric to-turmeric-dark',
  },
  {
    emoji: '💼',
    title: 'नौकरी इंटरव्यू (Job Interview)',
    desc: 'Professional self-introductions, career questions & interview confidence.',
    tag: 'Career',
    gradient: 'from-terracotta to-turmeric',
  },
  {
    emoji: '📚',
    title: 'कहानियों का संसार (Story Kingdom)',
    desc: 'Storytelling with Indian folk fables, moral lessons & narrative practice.',
    tag: 'Creative',
    gradient: 'from-peacock-teal to-turmeric',
  },
  {
    emoji: '🏡',
    title: 'घर और परिवार (Family & Festivals)',
    desc: 'Festival celebrations, Diwali, Eid, relatives & joyful family chats.',
    tag: 'Culture',
    gradient: 'from-terracotta-light to-turmeric-light',
  },
  {
    emoji: '🏏',
    title: 'क्रिकेट मैदान (Cricket Talk)',
    desc: 'Discussing match highlights, favorite Indian cricketers & commentary.',
    tag: 'Sports',
    gradient: 'from-peacock-teal to-terracotta',
  },
];

interface ScenarioGalleryProps {
  user: User | null;
}

export function ScenarioGallery({ user }: ScenarioGalleryProps) {
  const navigate = useNavigate();

  const handleScenarioClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-cream-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Culturally Grounded"
          badgeVariant="turmeric"
          title="9 Real-Life Indian Practice Worlds"
          subtitle="Practice in situations you actually encounter — from negotiating at the vegetable market to cracking your dream job interview."
          align="center"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {SCENARIOS.map((s, idx) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              onClick={handleScenarioClick}
              className="group rounded-3xl border border-warm-sand bg-warm-ivory p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-warm-md cursor-pointer flex flex-col justify-between shadow-warm-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} text-cream-white flex items-center justify-center text-3xl shadow-warm-sm group-hover:scale-105 transition-transform duration-300`}>
                    {s.emoji}
                  </div>
                  <Badge variant="outline" className="text-[11px] font-semibold">
                    {s.tag}
                  </Badge>
                </div>

                <h3 className="font-bold text-deep-brown text-lg group-hover:text-terracotta transition-colors font-display mb-1.5">
                  {s.title}
                </h3>
                <p className="text-deep-brown/70 text-sm leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-warm-sand/60 flex items-center justify-between text-xs text-terracotta font-semibold">
                <span>Start Practice</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

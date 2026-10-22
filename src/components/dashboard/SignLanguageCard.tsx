import { Link } from 'react-router-dom';
import { ArrowRight, HeartHandshake } from 'lucide-react';
import { Badge } from '../ui/badge';

export interface SignLanguageCardProps {
  isProminent?: boolean;
}

export function SignLanguageCard({ isProminent = false }: SignLanguageCardProps) {
  return (
    <Link
      to="/sign-tutor"
      className={`group w-full rounded-3xl p-6 sm:p-7 text-left transition-all duration-300 shadow-warm hover:shadow-warm-md relative overflow-hidden block ${
        isProminent
          ? 'border-2 border-peacock-teal bg-warm-ivory ring-2 ring-peacock-teal/20'
          : 'border border-warm-sand bg-warm-ivory hover:border-peacock-teal/50'
      }`}
    >
      {/* Background teal ambient blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-peacock-teal/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
        
        {/* Leading Icon Orb */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-peacock-teal to-peacock-teal-dark rounded-2xl flex items-center justify-center shadow-warm-sm group-hover:scale-105 transition-transform duration-300 flex-shrink-0 text-cream-white text-2xl">
          🤟
        </div>

        {/* Card Copy */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-deep-brown group-hover:text-peacock-teal transition-colors">
              Sign Language Practice 🤟
            </h3>
            <Badge variant="teal" className="text-[11px] font-bold">
              <HeartHandshake className="h-3 w-3 mr-1" />
              Inclusive
            </Badge>
            {isProminent && (
              <Badge variant="turmeric" className="text-[10px] font-bold">
                ✨ Preferred Mode
              </Badge>
            )}
          </div>
          <p className="text-deep-brown/70 text-sm leading-relaxed font-sans">
            Practice English through Indian Sign Language with your camera. Visual prompts, hand gesture recognition, and bilingual glosses.
          </p>
        </div>

        {/* Action Link Button */}
        <div className="flex-shrink-0 self-end sm:self-center">
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-peacock-teal/10 border border-peacock-teal/30 group-hover:bg-peacock-teal group-hover:border-peacock-teal text-peacock-teal group-hover:text-cream-white rounded-2xl transition-all duration-300 shadow-warm-sm">
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>
    </Link>
  );
}

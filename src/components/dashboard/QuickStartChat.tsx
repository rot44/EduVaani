import { MessageSquare, PlayCircle, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';

export interface QuickStartChatProps {
  onStartSession: (mode: string) => void;
}

export function QuickStartChat({ onStartSession }: QuickStartChatProps) {
  return (
    <button
      onClick={() => onStartSession('free-flow')}
      className="group w-full rounded-3xl border border-warm-sand bg-warm-ivory hover:border-terracotta/50 p-6 sm:p-7 text-left transition-all duration-300 shadow-warm hover:shadow-warm-md relative overflow-hidden cursor-pointer"
      type="button"
    >
      {/* Background warm shimmer highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
        
        {/* Leading Icon Orb */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-terracotta to-turmeric rounded-2xl flex items-center justify-center shadow-warm-sm group-hover:scale-105 transition-transform duration-300 flex-shrink-0 text-cream-white">
          <MessageSquare className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>

        {/* Card Copy */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-deep-brown group-hover:text-terracotta transition-colors">
              Free-Flow English Conversation 💬
            </h3>
            <Badge variant="turmeric" className="text-[11px] font-bold">
              <Sparkles className="h-3 w-3 mr-1 text-terracotta" />
              Most Popular
            </Badge>
          </div>
          <p className="text-deep-brown/70 text-sm leading-relaxed font-sans">
            Have natural, unstructured practice about your day, career, thoughts, or ask grammar questions. Your AI tutor adapts to your pace!
          </p>
        </div>

        {/* Play Action Button */}
        <div className="flex-shrink-0 self-end sm:self-center">
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-terracotta/10 border border-terracotta/30 group-hover:bg-terracotta group-hover:border-terracotta text-terracotta group-hover:text-cream-white rounded-2xl transition-all duration-300 shadow-warm-sm">
            <PlayCircle className="h-7 w-7 group-hover:scale-110 transition-transform" />
          </div>
        </div>

      </div>
    </button>
  );
}

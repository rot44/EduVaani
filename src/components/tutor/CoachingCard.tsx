import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Volume2, Check } from 'lucide-react';
import type { CoachingTip } from '../../lib/ai';
import { Badge } from '../ui/badge';

export interface CoachingCardProps {
  coachingTip: CoachingTip;
  onReplayImproved?: () => void;
  onPracticeImproved?: () => void;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export function CoachingCard({
  coachingTip,
  onReplayImproved,
  onPracticeImproved,
  isCollapsible = false,
  defaultExpanded = true,
  className = '',
}: CoachingCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`bg-warm-sand/55 border border-terracotta/35 rounded-2xl p-3.5 text-xs space-y-2 shadow-warm-sm ${className}`}
    >
      {/* Header with Title and Fluency Score Badge */}
      <div
        onClick={() => isCollapsible && setIsExpanded((prev) => !prev)}
        className={`flex items-center justify-between select-none ${
          isCollapsible ? 'cursor-pointer' : ''
        }`}
      >
        <div className="flex items-center gap-1.5 text-terracotta font-bold">
          <Sparkles className="h-3.5 w-3.5 text-terracotta" />
          <span className="font-display">AI Coach Tip</span>
          <Badge variant="turmeric" className="text-[10px] py-0 px-2 font-bold ml-1">
            {coachingTip.fluencyScore}% Fluency
          </Badge>
        </div>

        {isCollapsible && (
          <div className="text-deep-brown/50 hover:text-deep-brown transition-colors">
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </div>
        )}
      </div>

      {/* Expanded Coaching Body */}
      {isExpanded && (
        <div className="space-y-2 pt-1 text-[11px] animate-slide-up">
          {/* Better Phrasing in Peacock Teal */}
          <p className="text-peacock-teal leading-relaxed">
            <span className="font-bold text-peacock-teal-dark">Better phrasing: </span>
            &quot;{coachingTip.improved}&quot;
          </p>

          {/* Hindi Cultural Explanation / Hint */}
          {coachingTip.explanationHindi && (
            <p className="text-deep-brown/80 leading-relaxed font-sans">
              <span className="font-bold text-terracotta">💡 Hint: </span>
              {coachingTip.explanationHindi}
            </p>
          )}

          {/* Action Buttons */}
          {(onReplayImproved || onPracticeImproved) && (
            <div className="flex items-center gap-2 pt-1.5 flex-wrap">
              {onReplayImproved && (
                <button
                  type="button"
                  onClick={onReplayImproved}
                  className="bg-cream-white/90 border border-terracotta/30 text-terracotta hover:bg-terracotta hover:text-cream-white px-2.5 py-1 rounded-xl text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-warm-sm font-semibold"
                >
                  <Volume2 className="h-3 w-3" />
                  Hear improved sentence
                </button>
              )}

              {onPracticeImproved && (
                <button
                  type="button"
                  onClick={onPracticeImproved}
                  className="bg-cream-white/90 border border-peacock-teal/30 text-peacock-teal hover:bg-peacock-teal hover:text-cream-white px-2.5 py-1 rounded-xl text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-warm-sm font-semibold"
                >
                  <Check className="h-3 w-3" />
                  Practice saying this
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

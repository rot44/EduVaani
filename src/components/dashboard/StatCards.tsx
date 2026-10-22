import { Flame, Clock, Trophy, Mic } from 'lucide-react';

export interface StatCardsProps {
  streak: number;
  minutesPracticed: number;
  sessionsCompleted: number;
  onMicCheck?: () => void;
  className?: string;
}

export function StatCards({
  streak,
  minutesPracticed,
  sessionsCompleted,
  onMicCheck,
  className = '',
}: StatCardsProps) {
  return (
    <div className={`flex items-center gap-3 sm:gap-4 flex-wrap ${className}`}>
      {/* Streak Card */}
      <div className="bg-cream-white/90 border border-warm-sand rounded-2xl px-4 py-3 text-center min-w-[95px] shadow-warm-sm hover:border-terracotta/40 transition-colors">
        <Flame className="h-5 w-5 text-terracotta mx-auto mb-1" />
        <div className="text-lg font-bold text-deep-brown font-display leading-tight">
          {streak} {streak === 1 ? 'Day' : 'Days'}
        </div>
        <div className="text-[11px] text-deep-brown/65 font-medium">Active Streak</div>
      </div>

      {/* Minutes Practiced Card */}
      <div className="bg-cream-white/90 border border-warm-sand rounded-2xl px-4 py-3 text-center min-w-[95px] shadow-warm-sm hover:border-peacock-teal/40 transition-colors">
        <Clock className="h-5 w-5 text-peacock-teal mx-auto mb-1" />
        <div className="text-lg font-bold text-deep-brown font-display leading-tight">
          {minutesPracticed}m
        </div>
        <div className="text-[11px] text-deep-brown/65 font-medium">Spoken Time</div>
      </div>

      {/* Sessions Completed Card */}
      <div className="bg-cream-white/90 border border-warm-sand rounded-2xl px-4 py-3 text-center min-w-[95px] shadow-warm-sm hover:border-turmeric/50 transition-colors">
        <Trophy className="h-5 w-5 text-turmeric-dark mx-auto mb-1" />
        <div className="text-lg font-bold text-deep-brown font-display leading-tight">
          {sessionsCompleted}
        </div>
        <div className="text-[11px] text-deep-brown/65 font-medium">Sessions</div>
      </div>

      {/* Optional Mic Check Button */}
      {onMicCheck && (
        <button
          onClick={onMicCheck}
          className="border border-peacock-teal/40 bg-peacock-teal/10 hover:bg-peacock-teal/20 text-peacock-teal rounded-2xl px-4 py-3 text-center transition-all cursor-pointer group shadow-warm-sm min-w-[95px]"
          title="Check microphone & audio diagnostics"
          type="button"
        >
          <Mic className="h-5 w-5 text-peacock-teal mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-bold text-peacock-teal">Mic Check</div>
          <div className="text-[10px] text-deep-brown/60">Test Audio</div>
        </button>
      )}
    </div>
  );
}

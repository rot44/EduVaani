import { Compass, Sparkles } from 'lucide-react';
import type { User } from '../../lib/auth';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { StatCards } from './StatCards';

export interface WelcomeBannerProps {
  user: User;
  onMicCheck: () => void;
  onOpenTour?: () => void;
}

export function WelcomeBanner({ user, onMicCheck, onOpenTour }: WelcomeBannerProps) {
  // Time-of-day aware greeting (morning / afternoon / evening based on local hour)
  const currentHour = new Date().getHours();
  let timeGreeting = 'Good morning';
  if (currentHour >= 12 && currentHour < 17) {
    timeGreeting = 'Good afternoon';
  } else if (currentHour >= 17) {
    timeGreeting = 'Good evening';
  }

  const firstName = user.name.split(' ')[0] || 'Friend';

  // Calculate user level & experience progress (15 min milestone per level)
  const currentMinutes = user.minutesPracticed || 0;
  const level = Math.floor(currentMinutes / 15) + 1;
  const nextLevelMinutes = level * 15;
  const levelProgress = Math.min(100, Math.round(((currentMinutes % 15) / 15) * 100));

  const levelEmoji =
    user.englishLevel === 'advanced' ? '🌳' : user.englishLevel === 'intermediate' ? '🌿' : '🌱';

  return (
    <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 sm:p-8 relative overflow-hidden shadow-warm">
      {/* Subtle ambient warm gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-terracotta/5 via-turmeric/10 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* User Greeting & Level Badge */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-terracotta via-terracotta-hover to-turmeric rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-warm flex-shrink-0">
            <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-cream-white animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-deep-brown font-display tracking-tight">
                {timeGreeting}, {firstName}! 🙏
              </h1>
              <Badge variant="turmeric" className="text-xs font-bold">
                Level {level}: Spoken English Explorer
              </Badge>
              {user.englishLevel && (
                <Badge variant="teal" className="text-xs font-semibold capitalize">
                  {levelEmoji} {user.englishLevel}
                </Badge>
              )}
              {onOpenTour && (
                <button
                  type="button"
                  onClick={onOpenTour}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-warm-sand/50 hover:bg-terracotta/15 text-deep-brown hover:text-terracotta text-[11px] font-bold transition-colors cursor-pointer border border-warm-sand/80 shadow-xs"
                  title="Take Quick Tour"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>Feature Tour</span>
                </button>
              )}
            </div>
            <p className="text-deep-brown/70 text-sm mt-1 font-sans">
              Your daily English practice awaits. Speak with confidence and pride!
            </p>
          </div>
        </div>

        {/* Stats Row & Mic Diagnostic Button */}
        <StatCards
          streak={user.streak || 1}
          minutesPracticed={user.minutesPracticed || 0}
          sessionsCompleted={user.sessionsCompleted || 0}
          onMicCheck={onMicCheck}
        />
      </div>

      {/* Level Progress Milestone Bar */}
      <div className="mt-6 pt-5 border-t border-warm-sand/80">
        <div className="flex items-center justify-between text-xs text-deep-brown/70 mb-2 font-medium">
          <span className="font-semibold text-deep-brown">Next Milestone: Level {level + 1}</span>
          <span>
            {currentMinutes}m / {nextLevelMinutes}m practiced ({levelProgress}%)
          </span>
        </div>
        <Progress value={levelProgress} className="h-2.5" />
      </div>
    </div>
  );
}

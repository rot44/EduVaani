import { Award, Gift } from 'lucide-react';
import { Button } from '../ui/button';

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

export interface AchievementChestProps {
  achievements: Achievement[];
  onCelebrate: () => void;
}

export function AchievementChest({ achievements, onCelebrate }: AchievementChestProps) {
  return (
    <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 sm:p-8 shadow-warm relative overflow-hidden">
      {/* Background turmeric glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-turmeric/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title & Celebrate Button */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-turmeric/25 rounded-xl flex items-center justify-center border border-turmeric/40 text-deep-brown shadow-warm-sm">
            <Award className="h-5 w-5 text-turmeric-dark" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-deep-brown">
              Your Treasure Chest &amp; Badges 💎
            </h2>
            <p className="text-xs text-deep-brown/65 mt-0.5">
              Complete conversational sessions to unlock speaking superpowers!
            </p>
          </div>
        </div>

        <Button
          onClick={onCelebrate}
          variant="accent"
          size="sm"
          className="text-xs rounded-xl shadow-warm-sm"
        >
          <Gift className="h-4 w-4 mr-1.5 text-deep-brown" />
          Celebrate Progress
        </Button>
      </div>

      {/* Badges Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`rounded-2xl p-5 border transition-all duration-300 ${
              ach.unlocked
                ? 'border-2 border-turmeric/80 bg-cream-white shadow-warm ring-2 ring-turmeric/20'
                : 'border border-warm-sand bg-warm-sand/35 opacity-70'
            }`}
          >
            <div className={`text-3xl mb-2.5 ${ach.unlocked ? '' : 'grayscale opacity-60'}`}>
              {ach.icon}
            </div>

            <div className="flex items-center justify-between gap-2">
              <h3
                className={`font-bold text-sm font-display ${
                  ach.unlocked ? 'text-deep-brown' : 'text-deep-brown/60'
                }`}
              >
                {ach.title}
              </h3>
              {ach.unlocked ? (
                <span className="text-[10px] bg-turmeric/25 text-deep-brown border border-turmeric/50 px-2 py-0.5 rounded-full font-bold">
                  Unlocked
                </span>
              ) : (
                <span className="text-[10px] bg-warm-sand text-deep-brown/50 border border-warm-sand/90 px-2 py-0.5 rounded-full font-medium">
                  Locked
                </span>
              )}
            </div>

            <p
              className={`text-xs mt-1.5 leading-relaxed font-sans ${
                ach.unlocked ? 'text-deep-brown/75' : 'text-deep-brown/50'
              }`}
            >
              {ach.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Flame, Trophy, CalendarDays, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { HeatmapDay } from './analyticsData';

interface StreakCalendarProps {
  days: HeatmapDay[];
  currentStreak?: number;
  longestStreak?: number;
}

export function StreakCalendar({
  days,
  currentStreak = 3,
  longestStreak = 7,
}: StreakCalendarProps) {
  const [activeCell, setActiveCell] = useState<HeatmapDay | null>(null);

  // Organize days into 12 columns (weeks), each containing 7 days (Mon=0 to Sun=6)
  const weeks: HeatmapDay[][] = [];
  for (let w = 0; w < 12; w++) {
    const weekDays = days.filter((d) => d.weekIndex === w);
    // Sort by dayOfWeek (0 to 6)
    weekDays.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    weeks.push(weekDays);
  }

  // Count active practice days
  const activeDaysCount = days.filter((d) => d.minutes > 0).length;
  const consistencyRate = Math.round((activeDaysCount / days.length) * 100);

  // Month labels spanning across the 12 weeks
  const monthLabels: { label: string; colIndex: number }[] = [];
  weeks.forEach((wk, colIdx) => {
    if (wk[0]) {
      const date = new Date(wk[0].date);
      const monthStr = date.toLocaleDateString('en-IN', { month: 'short' });
      if (
        monthLabels.length === 0 ||
        monthLabels[monthLabels.length - 1].label !== monthStr
      ) {
        monthLabels.push({ label: monthStr, colIndex: colIdx });
      }
    }
  });

  const getCellBg = (level: number) => {
    switch (level) {
      case 3:
        return 'bg-terracotta border-terracotta text-white'; // 20m+ (heavy)
      case 2:
        return 'bg-terracotta/70 border-terracotta/60 text-white'; // 11-20m (moderate)
      case 1:
        return 'bg-turmeric border-turmeric-dark/30 text-deep-brown'; // 1-10m (light)
      case 0:
      default:
        return 'bg-warm-sand/55 border-warm-sand/80'; // 0m (no practice)
    }
  };

  return (
    <div className="bg-warm-ivory border border-warm-sand rounded-3xl p-6 sm:p-7 shadow-warm-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-terracotta/15 text-terracotta flex items-center justify-center flex-shrink-0">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-deep-brown font-display flex items-center gap-2">
              Practice Heatmap & Streaks
              <Badge variant="terracotta" className="text-[10px] font-bold">
                Last 12 Weeks
              </Badge>
            </h3>
            <p className="text-xs text-deep-brown/75">
              Daily learning consistency: Warm Sand (rest) → Turmeric (light) → Terracotta (deep)
            </p>
          </div>
        </div>

        {/* Streak Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="px-3.5 py-1.5 rounded-xl bg-cream-white border border-warm-sand flex items-center gap-2 shadow-xs">
            <Flame className="h-4 w-4 text-terracotta" aria-hidden="true" />
            <div className="text-xs">
              <span className="text-deep-brown/70 mr-1">Current:</span>
              <strong className="text-deep-brown font-extrabold">{currentStreak} Days</strong>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-cream-white border border-warm-sand flex items-center gap-2 shadow-xs">
            <Trophy className="h-4 w-4 text-turmeric" aria-hidden="true" />
            <div className="text-xs">
              <span className="text-deep-brown/70 mr-1">Best:</span>
              <strong className="text-deep-brown font-extrabold">{longestStreak} Days</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="relative overflow-x-auto pb-2 scrollbar-none">
        {/* Floating Tooltip */}
        {activeCell && (
          <div
            className="absolute top-0 z-30 bg-deep-brown text-cream-white text-xs px-3 py-1.5 rounded-xl shadow-warm-lg pointer-events-none animate-fade-in"
            style={{
              left: `${Math.min(80, Math.max(10, (activeCell.weekIndex / 12) * 100))}%`,
              transform: 'translate(-50%, -100%)',
            }}
            role="tooltip"
          >
            <div className="font-bold flex items-center gap-1">
              <span>{activeCell.date}</span>
              {activeCell.minutes >= 15 && <span>🎯</span>}
            </div>
            <div className="text-[11px] text-cream-white/80">
              {activeCell.minutes > 0
                ? `${activeCell.minutes} minutes spoken`
                : 'No practice logged'}
            </div>
          </div>
        )}

        <div className="min-w-[580px]">
          {/* Month Header Labels */}
          <div className="flex pl-8 mb-2 text-[10px] font-bold text-deep-brown/65 uppercase tracking-wider">
            {monthLabels.map((m) => (
              <span
                key={`${m.label}-${m.colIndex}`}
                style={{ marginLeft: `${m.colIndex === 0 ? 0 : 36}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Heatmap Body */}
          <div className="flex gap-2">
            {/* Day of Week Labels (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between text-[9px] font-semibold text-deep-brown/60 pr-1 py-1 h-[130px]">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>

            {/* 12 Week Columns */}
            <div
              className="grid grid-flow-col gap-1.5 flex-1"
              role="grid"
              aria-label="12-week practice history heatmap"
            >
              {weeks.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-1.5" role="row">
                  {week.map((day) => {
                    const isHovered = activeCell?.date === day.date;
                    return (
                      <button
                        key={day.date}
                        type="button"
                        tabIndex={0}
                        role="gridcell"
                        aria-label={`${day.date}: ${day.minutes} minutes practiced`}
                        onMouseEnter={() => setActiveCell(day)}
                        onMouseLeave={() => setActiveCell(null)}
                        onFocus={() => setActiveCell(day)}
                        onBlur={() => setActiveCell(null)}
                        className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-md border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta ${getCellBg(
                          day.level
                        )} ${isHovered ? 'scale-125 z-20 shadow-warm-sm' : ''}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Footer Legend & Summary */}
      <div className="mt-6 pt-4 border-t border-warm-sand/80 flex items-center justify-between text-xs text-deep-brown/75 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-turmeric" aria-hidden="true" />
          <span>
            {activeDaysCount} of 84 days active ({consistencyRate}% practice rate)
          </span>
        </div>

        {/* Color Scale Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-deep-brown/70 font-medium">
          <span>Less</span>
          <span className="w-3.5 h-3.5 rounded-xs bg-warm-sand/55 border border-warm-sand inline-block" title="0 minutes" />
          <span className="w-3.5 h-3.5 rounded-xs bg-turmeric border border-turmeric-dark/30 inline-block" title="1-10 minutes" />
          <span className="w-3.5 h-3.5 rounded-xs bg-terracotta/70 border border-terracotta/60 inline-block" title="11-20 minutes" />
          <span className="w-3.5 h-3.5 rounded-xs bg-terracotta inline-block" title="20+ minutes" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

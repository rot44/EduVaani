import { useState } from 'react';
import { BarChart3, Target, CheckCircle2, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { DayPracticeData } from './analyticsData';

interface PracticeChartProps {
  data: DayPracticeData[];
  goalMinutes?: number;
}

export function PracticeChart({ data, goalMinutes = 15 }: PracticeChartProps) {
  const [activeDay, setActiveDay] = useState<DayPracticeData | null>(null);

  // Maximum value for scaling (min 25 min)
  const maxMinutes = Math.max(25, ...data.map((d) => d.minutes));
  const goalPercent = Math.min(100, Math.round((goalMinutes / maxMinutes) * 100));

  const totalWeeklyMinutes = data.reduce((acc, d) => acc + d.minutes, 0);
  const goalMetCount = data.filter((d) => d.goalMet).length;

  return (
    <div className="bg-warm-ivory border border-warm-sand rounded-3xl p-6 sm:p-7 shadow-warm-sm flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-terracotta/15 text-terracotta flex items-center justify-center flex-shrink-0">
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-deep-brown font-display flex items-center gap-2">
                Weekly Speaking Practice
                <Badge variant="terracotta" className="text-[10px] font-bold">
                  Last 7 Days
                </Badge>
              </h3>
              <p className="text-xs text-deep-brown/75">
                Daily conversational minutes tracked against your {goalMinutes}-minute goal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-cream-white border border-warm-sand text-xs font-semibold text-deep-brown flex items-center gap-1.5 shadow-xs">
              <span className="text-terracotta font-bold text-sm">{totalWeeklyMinutes}</span>
              <span className="text-deep-brown/70">mins total</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-peacock-teal/10 border border-peacock-teal/25 text-xs font-semibold text-peacock-teal flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{goalMetCount}/7 Goals Met</span>
            </div>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="relative mt-8 pt-4 pb-2">
          {/* Goal Line & Badge */}
          <div
            className="absolute left-8 right-0 border-t-2 border-dashed border-turmeric/80 z-10 pointer-events-none transition-all flex items-center justify-between pr-2"
            style={{ bottom: `${goalPercent}%` }}
          >
            <span className="text-[10px] font-bold text-turmeric-dark bg-warm-ivory/95 px-1.5 py-0.5 rounded -translate-y-1/2 flex items-center gap-1 border border-turmeric/40 shadow-xs">
              <Target className="h-3 w-3" aria-hidden="true" />
              Goal: {goalMinutes}m
            </span>
          </div>

          {/* Background Y-Axis Grid Lines */}
          <div className="absolute inset-x-8 top-0 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-warm-sand w-full" />
            <div className="border-b border-warm-sand w-full" />
            <div className="border-b border-warm-sand w-full" />
            <div className="border-b border-warm-sand w-full" />
          </div>

          {/* Bar Chart Flex Layout */}
          <div
            className="h-56 sm:h-64 flex items-end justify-between pl-8 pr-2 relative z-20"
            role="region"
            aria-label="Weekly speaking practice bar chart"
          >
            {/* Y-Axis Scale Labels */}
            <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] font-mono font-medium text-deep-brown/60 pr-2 pb-8">
              <span>{maxMinutes}m</span>
              <span>{Math.round(maxMinutes * 0.75)}m</span>
              <span>{Math.round(maxMinutes * 0.5)}m</span>
              <span>{Math.round(maxMinutes * 0.25)}m</span>
              <span>0m</span>
            </div>

            {/* 7 Bars */}
            {data.map((day, idx) => {
              const heightPercent = Math.max(6, Math.min(100, Math.round((day.minutes / maxMinutes) * 100)));
              const isSelected = activeDay?.fullDate === day.fullDate;

              return (
                <div
                  key={day.fullDate || idx}
                  className="flex-1 flex flex-col items-center h-full justify-end group px-1 sm:px-2 relative"
                >
                  {/* Floating Tooltip */}
                  {isSelected && (
                    <div
                      className="absolute -top-12 z-30 bg-deep-brown text-cream-white text-xs px-2.5 py-1.5 rounded-xl shadow-warm-lg whitespace-nowrap animate-fade-in pointer-events-none"
                      role="tooltip"
                    >
                      <div className="font-bold flex items-center gap-1">
                        <span>{day.dayName}, {day.shortDate}</span>
                        {day.goalMet && <span>🎯</span>}
                      </div>
                      <div className="text-[11px] text-cream-white/80">
                        {day.minutes} min ({Math.round((day.minutes / goalMinutes) * 100)}% of goal)
                      </div>
                    </div>
                  )}

                  {/* Value on top of bar on hover/desktop */}
                  <span
                    className={`text-[11px] font-mono font-bold mb-1.5 transition-opacity ${
                      day.isToday || isSelected ? 'text-terracotta opacity-100 font-extrabold' : 'text-deep-brown/70 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {day.minutes}m
                  </span>

                  {/* The Bar */}
                  <button
                    type="button"
                    tabIndex={0}
                    role="graphics-symbol"
                    aria-label={`${day.dayName} ${day.shortDate}: ${day.minutes} minutes spoken, ${day.goalMet ? 'Goal met' : 'Below 15 minute goal'}`}
                    onMouseEnter={() => setActiveDay(day)}
                    onMouseLeave={() => setActiveDay(null)}
                    onFocus={() => setActiveDay(day)}
                    onBlur={() => setActiveDay(null)}
                    className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 relative cursor-pointer focus:outline-none ${
                      day.isToday
                        ? 'bg-gradient-to-t from-terracotta via-terracotta to-turmeric shadow-warm-md ring-2 ring-terracotta ring-offset-2 ring-offset-warm-ivory'
                        : day.goalMet
                        ? 'bg-terracotta/90 hover:bg-terracotta hover:scale-y-[1.02] shadow-warm-sm'
                        : 'bg-warm-sand-dark/70 hover:bg-terracotta/75 hover:scale-y-[1.02]'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Subtle highlight inner shine */}
                    <div className="absolute top-1 inset-x-1 h-1 bg-white/25 rounded-full" />
                  </button>

                  {/* Day Label at Bottom */}
                  <div className="mt-2.5 text-center">
                    <span
                      className={`block text-xs font-display ${
                        day.isToday ? 'font-extrabold text-terracotta' : 'font-semibold text-deep-brown/80'
                      }`}
                    >
                      {day.dayName}
                    </span>
                    <span className="block text-[10px] text-deep-brown/60 -mt-0.5">
                      {day.shortDate.split(' ')[0]}
                    </span>
                  </div>

                  {/* 'Today' Indicator Pill */}
                  {day.isToday && (
                    <span className="mt-1 px-1.5 py-0.5 rounded-full bg-terracotta text-cream-white text-[9px] font-bold tracking-tight uppercase shadow-xs">
                      Today
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Coach Tip */}
      <div className="mt-6 pt-4 border-t border-warm-sand/80 flex items-center justify-between text-xs text-deep-brown/75 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-turmeric flex-shrink-0" aria-hidden="true" />
          <span>
            <strong className="text-deep-brown font-semibold">Pro-tip:</strong> Practicing 15 mins daily yields 3x faster retention than weekly cramming.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium text-deep-brown/65">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-terracotta inline-block" /> Met Goal
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-warm-sand-dark/70 inline-block" /> In Progress
          </span>
        </div>
      </div>
    </div>
  );
}

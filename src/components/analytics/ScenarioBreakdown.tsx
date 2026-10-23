import { useState } from 'react';
import { PieChart, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { ScenarioStat } from './analyticsData';

interface ScenarioBreakdownProps {
  data: ScenarioStat[];
}

export function ScenarioBreakdown({ data }: ScenarioBreakdownProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const totalSessions = data.reduce((acc, cur) => acc + cur.count, 0);

  // SVG Donut geometry
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2; // radius ~ 78
  const circumference = 2 * Math.PI * radius;

  // Calculate segment offsets purely
  const segments = data.reduce<{
    accumulated: number;
    items: Array<ScenarioStat & { strokeDasharray: string; strokeDashoffset: number }>;
  }>(
    (acc, item) => {
      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((acc.accumulated / 100) * circumference);
      return {
        accumulated: acc.accumulated + item.percentage,
        items: [
          ...acc.items,
          {
            ...item,
            strokeDasharray,
            strokeDashoffset,
          },
        ],
      };
    },
    { accumulated: 0, items: [] }
  ).items;

  const activeScenario = hoveredId ? data.find((d) => d.id === hoveredId) : null;

  return (
    <div className="bg-warm-ivory border border-warm-sand rounded-3xl p-6 sm:p-7 shadow-warm-sm flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-turmeric/15 text-turmeric-dark flex items-center justify-center flex-shrink-0">
              <PieChart className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-deep-brown font-display flex items-center gap-2">
                Scenario Breakdown
                <Badge variant="turmeric" className="text-[10px] font-bold">
                  Top Contexts
                </Badge>
              </h3>
              <p className="text-xs text-deep-brown/75">
                Distribution of real-life Indian practice conversations
              </p>
            </div>
          </div>
        </div>

        {/* Content: Donut + Legend */}
        <div className="grid sm:grid-cols-12 gap-6 items-center">
          {/* Donut Chart (5 cols) */}
          <div className="sm:col-span-5 flex justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="-rotate-90"
                role="region"
                aria-label="Practice scenarios distribution donut chart"
              >
                {/* Background Ring */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke="var(--color-warm-sand, #F2E5D0)"
                  strokeWidth={strokeWidth}
                />

                {/* Segments */}
                {segments.map((seg) => {
                  const isHovered = hoveredId === seg.id;
                  return (
                    <circle
                      key={seg.id}
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredId(seg.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setHoveredId(seg.id)}
                      onBlur={() => setHoveredId(null)}
                      tabIndex={0}
                      role="graphics-symbol"
                      aria-label={`${seg.name}: ${seg.count} sessions, ${seg.percentage}% of practice`}
                    />
                  );
                })}
              </svg>

              {/* Center Info in Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
                {activeScenario ? (
                  <>
                    <span className="text-xl">{activeScenario.emoji}</span>
                    <span className="text-sm font-extrabold text-deep-brown font-display leading-tight truncate max-w-[90px]">
                      {activeScenario.name}
                    </span>
                    <span className="text-[11px] font-bold text-peacock-teal">
                      {activeScenario.percentage}%
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-black text-deep-brown font-display">
                      {totalSessions}
                    </span>
                    <span className="text-[11px] font-bold text-deep-brown/70 -mt-0.5">
                      Sessions
                    </span>
                    <span className="text-[9px] text-terracotta font-semibold mt-0.5">
                      Practice Mix
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Legend Items List (7 cols) */}
          <div className="sm:col-span-7 space-y-2.5">
            {data.map((item) => {
              const isHovered = hoveredId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(item.id)}
                  onBlur={() => setHoveredId(null)}
                  className={`w-full text-left p-2.5 rounded-2xl border transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-cream-white border-warm-sand shadow-warm-sm scale-[1.02]'
                      : 'bg-cream-white/60 border-warm-sand/70 hover:bg-cream-white hover:border-warm-sand'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base" aria-hidden="true">
                        {item.emoji}
                      </span>
                      <span className="font-bold text-deep-brown">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-deep-brown/70">
                        {item.count} sessions
                      </span>
                      <span className="font-bold text-xs" style={{ color: item.color }}>
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="h-1.5 bg-warm-sand/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 pt-4 border-t border-warm-sand/80 flex items-center justify-between text-xs text-deep-brown/75">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-turmeric" aria-hidden="true" />
          <span>Most active: <strong>Indian Bazaar (Bargaining & Daily life)</strong></span>
        </div>
        <span className="text-[11px] text-peacock-teal font-medium">Balanced curriculum</span>
      </div>
    </div>
  );
}

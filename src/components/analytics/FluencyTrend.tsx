import { useState } from 'react';
import { TrendingUp, Award, Lightbulb } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { FluencyPoint } from './analyticsData';

interface FluencyTrendProps {
  data: FluencyPoint[];
}

interface RenderPoint extends FluencyPoint {
  x: number;
  y: number;
}

export function FluencyTrend({ data }: FluencyTrendProps) {
  const [activePoint, setActivePoint] = useState<RenderPoint | null>(null);

  if (!data || data.length === 0) return null;

  const latestScore = data[data.length - 1]?.score || 8.0;
  const firstScore = data[0]?.score || 6.0;
  const growth = Number((latestScore - firstScore).toFixed(1));

  // SVG dimensions
  const svgWidth = 500;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 30;

  const minScore = 4.0;
  const maxScore = 10.0;

  // Calculate coordinates for points
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1 || 1)) * (svgWidth - paddingX * 2);
    // Y inverted: 10 is at paddingY, 4 is at svgHeight - paddingY
    const y =
      svgHeight -
      paddingY -
      ((d.score - minScore) / (maxScore - minScore)) * (svgHeight - paddingY * 2);
    return { ...d, x, y };
  });

  // Construct SVG Path (smooth or line)
  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    // Catmull-Rom or cubic Bezier curve
    const prev = points[idx - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, '');

  // Construct SVG Area for gradient fill
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaD = `${pathD} L ${lastPoint.x} ${svgHeight - paddingY} L ${firstPoint.x} ${svgHeight - paddingY} Z`;

  return (
    <div className="bg-warm-ivory border border-warm-sand rounded-3xl p-6 sm:p-7 shadow-warm-sm flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-peacock-teal/15 text-peacock-teal flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-deep-brown font-display flex items-center gap-2">
                Fluency Score Trend
                <Badge variant="teal" className="text-[10px] font-bold">
                  AI Evaluated
                </Badge>
              </h3>
              <p className="text-xs text-deep-brown/75">
                Grammar, articulation & confidence score progression across practice sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-cream-white border border-warm-sand text-xs font-semibold text-deep-brown flex items-center gap-2 shadow-xs">
              <span className="text-xs text-deep-brown/70">Current Score:</span>
              <span className="text-peacock-teal font-extrabold text-base">{latestScore}/10</span>
              {growth > 0 && (
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  +{growth} pts
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="relative mt-6 pt-2">
          {/* Active Hover / Focus Tooltip Callout */}
          {activePoint && (
            <div
              className="absolute z-30 bg-deep-brown text-cream-white text-xs px-3 py-2 rounded-2xl shadow-warm-lg max-w-xs animate-fade-in pointer-events-none"
              style={{
                left: `${Math.min(75, Math.max(15, (activePoint.x / svgWidth) * 100))}%`,
                top: '-16px',
                transform: 'translate(-50%, -100%)',
              }}
              role="tooltip"
            >
              <div className="flex items-center justify-between gap-2 font-bold mb-1">
                <span className="text-peacock-teal-light">{activePoint.sessionTitle}</span>
                <span className="bg-peacock-teal text-white px-1.5 py-0.5 rounded text-[10px]">
                  {activePoint.score}/10
                </span>
              </div>
              <div className="text-[11px] text-cream-white/80">{activePoint.dateStr}</div>
              {activePoint.tipSnippet && (
                <div className="mt-1 pt-1 border-t border-white/20 text-[10px] text-warm-sand italic">
                  &ldquo;{activePoint.tipSnippet}&rdquo;
                </div>
              )}
            </div>
          )}

          {/* Pure SVG Line Chart */}
          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-48 sm:h-56"
              role="region"
              aria-label="Fluency score progression line chart"
            >
              <defs>
                {/* Peacock Teal Area Fill Gradient */}
                <linearGradient id="fluencyAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A5F60" stopOpacity="0.30" />
                  <stop offset="60%" stopColor="#1A5F60" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#1A5F60" stopOpacity="0.0" />
                </linearGradient>

                {/* Glow Filter for Active Point */}
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Grid Lines (Warm Sand Grid) */}
              {[10, 8, 6, 4].map((score) => {
                const y =
                  svgHeight -
                  paddingY -
                  ((score - minScore) / (maxScore - minScore)) * (svgHeight - paddingY * 2);
                return (
                  <g key={score}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="var(--color-warm-sand, #F2E5D0)"
                      strokeWidth="1.2"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="10"
                      fill="#7A6855"
                      fontFamily="monospace"
                    >
                      {score}.0
                    </text>
                  </g>
                );
              })}

              {/* Area Fill */}
              <path d={areaD} fill="url(#fluencyAreaGradient)" />

              {/* Smooth Trend Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#1A5F60"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              {points.map((pt, idx) => {
                const isHovered = activePoint?.sessionId === pt.sessionId;
                return (
                  <g key={pt.sessionId || idx} className="cursor-pointer">
                    {/* Hover Target with larger radius */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="16"
                      fill="transparent"
                      tabIndex={0}
                      role="graphics-symbol"
                      aria-label={`${pt.sessionTitle}, Score ${pt.score}/10, ${pt.dateStr}`}
                      onMouseEnter={() => setActivePoint(pt)}
                      onMouseLeave={() => setActivePoint(null)}
                      onFocus={() => setActivePoint(pt)}
                      onBlur={() => setActivePoint(null)}
                      className="focus:outline-none"
                    />

                    {/* Visible Circle Node */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? '7' : '4.5'}
                      fill="#FFFDF7"
                      stroke="#1A5F60"
                      strokeWidth={isHovered ? '3.5' : '2.5'}
                      filter={isHovered ? 'url(#glowEffect)' : undefined}
                      className="transition-all duration-200 pointer-events-none"
                    />

                    {/* Date label at bottom */}
                    <text
                      x={pt.x}
                      y={svgHeight - 10}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#7A6855"
                      fontWeight="600"
                      className="pointer-events-none"
                    >
                      {idx === 0 ? 'Start' : idx === points.length - 1 ? 'Latest' : `S${idx + 1}`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Footer Insight Box */}
      <div className="mt-4 pt-4 border-t border-warm-sand/80 flex items-center justify-between text-xs text-deep-brown/75 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-peacock-teal flex-shrink-0" aria-hidden="true" />
          <span>
            Current Level: <strong className="text-deep-brown font-semibold">Intermediate Speaker (Grade A)</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-deep-brown/70 font-medium">
          <Lightbulb className="h-3.5 w-3.5 text-turmeric" aria-hidden="true" />
          <span>Coaching tips integrated after every voice turn</span>
        </div>
      </div>
    </div>
  );
}

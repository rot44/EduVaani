import { useEffect, useState } from "react";

interface AudioWaveVisualizerProps {
  isActive: boolean;
  status: 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
  color?: string;
}

const BAR_COUNT = 15;
const IDLE_BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const mid = (BAR_COUNT - 1) / 2;
  const dist = Math.abs(i - mid) / mid;
  return Math.round(14 - dist * 6);
});

export function AudioWaveVisualizer({ isActive, status }: AudioWaveVisualizerProps) {
  const [bars, setBars] = useState<number[]>(IDLE_BARS);

  useEffect(() => {
    if (!isActive) return;

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setBars(() =>
        Array.from({ length: BAR_COUNT }, (_, i) => {
          const mid = (BAR_COUNT - 1) / 2;
          const bell = 1 - Math.pow(Math.abs(i - mid) / mid, 1.8);

          if (status === 'speaking') {
            const wave1 = Math.sin(frame * 0.35 + i * 0.5);
            const wave2 = Math.cos(frame * 0.2 + i * 0.3);
            const amp = (wave1 + wave2 + 2) / 4;
            return Math.round(12 + amp * 34 * bell);
          } else if (status === 'listening') {
            const wave = Math.sin(frame * 0.5 + i * 0.65);
            const amp = (wave + 1) / 2;
            return Math.round(14 + amp * 28 * bell);
          } else if (status === 'processing') {
            const pulse = (Math.sin(frame * 0.25) + 1) / 2;
            return Math.round(10 + pulse * 14 * bell);
          }
          return 12;
        })
      );
    }, 70);

    return () => clearInterval(interval);
  }, [isActive, status]);

  const getGradient = () => {
    switch (status) {
      case 'speaking':
        return 'from-amber-400 via-orange-400 to-yellow-300';
      case 'listening':
        return 'from-rose-500 via-red-400 to-amber-400';
      case 'processing':
        return 'from-amber-300 via-yellow-400 to-orange-400';
      default:
        return 'from-white/30 to-white/10';
    }
  };

  const currentBars = isActive ? bars : IDLE_BARS;

  return (
    <div
      className="flex items-center justify-center gap-1.5 h-11 px-5 py-2 glass border border-white/10 rounded-full shadow-lg backdrop-blur-md"
      aria-hidden="true"
    >
      {currentBars.map((height, i) => (
        <div
          key={i}
          className={`w-1 sm:w-1.5 rounded-full bg-gradient-to-t ${getGradient()} transition-all duration-100 ease-out shadow-sm`}
          style={{
            height: `${height}px`,
            opacity: isActive ? 0.95 : 0.35,
          }}
        />
      ))}
    </div>
  );
}

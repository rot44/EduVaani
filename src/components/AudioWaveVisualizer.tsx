import { useEffect, useState } from "react";

interface AudioWaveVisualizerProps {
  isActive: boolean;
  status: 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
  color?: string;
}

const IDLE_BARS = [12, 16, 22, 18, 24, 20, 16, 18, 20, 16, 12];

export function AudioWaveVisualizer({ isActive, status }: AudioWaveVisualizerProps) {
  const [bars, setBars] = useState<number[]>(IDLE_BARS);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setBars(prev =>
        prev.map(() => {
          if (status === 'speaking') {
            return Math.floor(Math.random() * 45) + 16;
          } else if (status === 'listening') {
            return Math.floor(Math.random() * 36) + 14;
          } else if (status === 'processing') {
            return Math.floor(Math.random() * 22) + 10;
          }
          return 12;
        })
      );
    }, 100);

    return () => {
      clearInterval(interval);
      setBars(IDLE_BARS);
    };
  }, [isActive, status]);

  const getGradient = () => {
    switch (status) {
      case 'speaking':
        return 'from-emerald-400 via-teal-400 to-cyan-400';
      case 'listening':
        return 'from-red-400 via-rose-500 to-orange-400';
      case 'processing':
        return 'from-amber-400 via-yellow-400 to-orange-400';
      default:
        return 'from-orange-400/40 to-amber-400/40';
    }
  };

  return (
    <div className="flex items-center justify-center gap-1.5 h-14 px-4 py-2" aria-hidden="true">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`w-1 sm:w-1.5 rounded-full bg-gradient-to-t ${getGradient()} transition-all duration-150 ease-in-out`}
          style={{
            height: `${isActive ? height : 12}px`,
            opacity: isActive ? 0.95 : 0.25,
          }}
        />
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";

interface AudioWaveVisualizerProps {
  isActive: boolean;
  status: 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
  color?: string;
}

export function AudioWaveVisualizer({ isActive, status }: AudioWaveVisualizerProps) {
  const [bars, setBars] = useState<number[]>([15, 25, 40, 20, 35, 50, 30, 20, 45, 25, 15]);

  useEffect(() => {
    if (!isActive) {
      setBars([10, 14, 18, 14, 20, 16, 12, 14, 16, 12, 10]);
      return;
    }

    const interval = setInterval(() => {
      setBars(prev =>
        prev.map(() => {
          if (status === 'speaking') {
            return Math.floor(Math.random() * 45) + 15;
          } else if (status === 'listening') {
            return Math.floor(Math.random() * 35) + 12;
          } else if (status === 'processing') {
            return Math.floor(Math.random() * 20) + 10;
          }
          return 10;
        })
      );
    }, 100);

    return () => clearInterval(interval);
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
        return 'from-orange-400/50 to-amber-400/50';
    }
  };

  return (
    <div className="flex items-center justify-center gap-1.5 h-16 px-4 py-2">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`w-1 sm:w-1.5 rounded-full bg-gradient-to-t ${getGradient()} transition-all duration-150 ease-in-out`}
          style={{
            height: `${height}px`,
            opacity: isActive ? 0.9 : 0.35,
          }}
        />
      ))}
    </div>
  );
}

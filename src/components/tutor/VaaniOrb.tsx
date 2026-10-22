import React from 'react';
import { Sparkles, Check, BrainCircuit, Volume2, Zap } from 'lucide-react';
import { AudioWaveVisualizer } from '../AudioWaveVisualizer';

export type TutorStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export interface VaaniOrbProps {
  status: TutorStatus;
  onClick: () => void;
  disabled: boolean;
}

export function VaaniOrb({ status, onClick, disabled }: VaaniOrbProps) {
  // Orb gradient mapping according to EduVaani design system:
  // - idle: terracotta -> turmeric
  // - listening: soft coral pulse
  // - processing: turmeric spin
  // - speaking: peacock teal bounce
  // - error: soft coral / muted
  const configs: Record<
    TutorStatus,
    { icon: React.ReactNode; gradient: string; label: string; glow: string }
  > = {
    idle: {
      icon: <Sparkles className="h-10 w-10 text-cream-white" />,
      gradient: 'from-terracotta via-terracotta-hover to-turmeric',
      label: 'Tap to speak English',
      glow: 'shadow-terracotta/35',
    },
    listening: {
      icon: <Check className="h-10 w-10 text-cream-white animate-pulse" />,
      gradient: 'from-soft-coral via-terracotta to-turmeric',
      label: 'Listening... Tap orb when done',
      glow: 'shadow-soft-coral/50',
    },
    processing: {
      icon: <BrainCircuit className="h-10 w-10 text-cream-white animate-spin" />,
      gradient: 'from-turmeric via-turmeric-hover to-terracotta',
      label: 'Thinking & coaching...',
      glow: 'shadow-turmeric/45',
    },
    speaking: {
      icon: <Volume2 className="h-10 w-10 text-cream-white animate-bounce" />,
      gradient: 'from-peacock-teal via-peacock-teal-hover to-peacock-teal-dark',
      label: 'EduVaani speaking (tap to speak)',
      glow: 'shadow-teal/40',
    },
    error: {
      icon: <Zap className="h-10 w-10 text-cream-white" />,
      gradient: 'from-soft-coral via-soft-coral-hover to-deep-brown',
      label: 'Tap to try again',
      glow: 'shadow-soft-coral/30',
    },
  };

  const cfg = configs[status];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* Ambient radial aura */}
        <div
          className={`absolute w-44 h-44 rounded-full bg-gradient-to-tr ${cfg.gradient} opacity-30 blur-2xl transition-all duration-700 ${
            status === 'speaking' || status === 'listening'
              ? 'scale-125 opacity-50'
              : 'scale-100'
          }`}
        />

        {/* Animated ripple wave when listening */}
        {status === 'listening' && (
          <>
            <div className="absolute w-36 h-36 rounded-full border border-soft-coral/60 animate-ping opacity-40 pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full border border-terracotta/30 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Main interactive orb */}
        <button
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!disabled) onClick();
            }
          }}
          disabled={disabled}
          type="button"
          role="button"
          aria-label={
            status === 'listening'
              ? 'Voice tutor is listening. Tap or press Enter to finish speaking.'
              : status === 'speaking'
              ? 'Voice tutor is speaking. Tap or press Enter to interrupt and speak.'
              : status === 'processing'
              ? 'Voice tutor is thinking. Please wait.'
              : status === 'error'
              ? 'Voice input error occurred. Tap or press Enter to try speaking again.'
              : 'Voice tutor is ready. Tap or press Enter to start speaking English.'
          }
          aria-busy={status === 'processing'}
          title={
            status === 'listening'
              ? 'Tap to finish speaking & submit'
              : status === 'speaking'
              ? 'Interrupt & speak'
              : 'Tap to speak'
          }
          className={`relative z-10 w-32 h-32 rounded-full bg-gradient-to-tr ${cfg.gradient} text-cream-white
            shadow-2xl ${cfg.glow} transition-all duration-300 ease-out transform min-h-[44px] min-w-[44px]
            ${
              disabled
                ? 'cursor-not-allowed opacity-80'
                : 'hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-4 focus-visible:ring-terracotta'
            }
            border-2 border-cream-white/40 flex items-center justify-center`}
        >
          {/* Subtle glossy glass shine */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-b from-cream-white/35 via-transparent to-transparent pointer-events-none" />
          {cfg.icon}
        </button>
      </div>

      {/* Live harmonic audio waveform visualizer */}
      <AudioWaveVisualizer
        isActive={
          status === 'speaking' || status === 'listening' || status === 'processing'
        }
        status={status}
      />

      {/* Status Pill below orb */}
      <div className="bg-warm-sand/90 border border-warm-sand rounded-full px-5 py-1.5 text-center shadow-warm-sm backdrop-blur-md">
        <p className="text-deep-brown text-xs font-semibold tracking-wide flex items-center gap-2">
          {status === 'listening' && (
            <span className="w-2 h-2 rounded-full bg-soft-coral animate-ping" />
          )}
          {status === 'speaking' && (
            <span className="w-2 h-2 rounded-full bg-peacock-teal animate-pulse" />
          )}
          {status === 'processing' && (
            <span className="w-2 h-2 rounded-full bg-turmeric animate-spin" />
          )}
          {cfg.label}
        </p>
      </div>
    </div>
  );
}

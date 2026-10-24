import { Camera, ShieldCheck, Video, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

export interface PermissionPromptProps {
  onAllowCamera: () => void;
  onLearnWithoutCamera: () => void;
  isRequesting?: boolean;
}

export function PermissionPrompt({
  onAllowCamera,
  onLearnWithoutCamera,
  isRequesting = false,
}: PermissionPromptProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-5 sm:p-7 text-center select-none bg-gradient-to-br from-[#2D2327] via-[#221A1E] to-[#140E11] text-cream-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-64 h-64 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-48 h-48 bg-peacock-teal/10 rounded-full blur-2xl -bottom-10 -right-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md mx-auto space-y-3 sm:space-y-4">
        {/* Sleek Camera Standby Orb */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cream-white/10 border border-cream-white/15 backdrop-blur-md flex items-center justify-center text-cream-white shadow-warm">
          <Video className="h-7 w-7 text-cream-white/90" />
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-turmeric border-2 border-[#2D2327] animate-pulse" />
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-1 sm:space-y-1.5">
          <h3 className="text-base sm:text-xl font-bold font-display text-cream-white tracking-tight">
            Webcam Gesture Stage
          </h3>
          <p className="text-xs sm:text-sm text-cream-white/70 max-w-sm mx-auto leading-relaxed font-sans">
            Turn on your camera to track 21 hand joints for real-time Indian Sign Language practice
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col items-center gap-2.5 pt-1 w-full">
          <Button
            onClick={onAllowCamera}
            variant="primary"
            size="default"
            disabled={isRequesting}
            className="min-h-[42px] px-7 text-xs sm:text-sm font-bold shadow-warm flex items-center gap-2 cursor-pointer"
          >
            <Camera className="h-4 w-4" />
            <span>{isRequesting ? 'Connecting Camera...' : 'Start Camera Practice'}</span>
          </Button>

          <button
            type="button"
            onClick={onLearnWithoutCamera}
            className="text-[11px] sm:text-xs text-cream-white/65 hover:text-cream-white transition-colors flex items-center gap-1 underline underline-offset-4 cursor-pointer font-sans"
          >
            <span>Practice without camera using sign animations</span>
            <ArrowRight className="h-3 w-3 inline" />
          </button>
        </div>

        {/* Compact Privacy Guarantee Pill */}
        <div className="pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-white/5 border border-cream-white/10 text-[10px] sm:text-[11px] text-cream-white/60 font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-peacock-teal flex-shrink-0" />
            <span>100% On-Device • Video frames never leave your browser</span>
          </div>
        </div>
      </div>
    </div>
  );
}

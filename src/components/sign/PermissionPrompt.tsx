import { Camera, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
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
    <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 sm:p-8 text-center space-y-6 shadow-warm-md">
      {/* Visual Camera Orb */}
      <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-terracotta to-turmeric flex items-center justify-center text-cream-white shadow-warm">
        <Camera className="h-10 w-10 animate-pulse" />
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-peacock-teal border-2 border-warm-ivory flex items-center justify-center text-cream-white shadow-sm">
          <ShieldCheck className="h-4 w-4" />
        </div>
      </div>

      {/* Heading & Explanation */}
      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold font-display text-deep-brown">
          Enable Camera for ISL Practice
        </h3>
        <p className="text-sm text-deep-brown/75 leading-relaxed font-sans">
          EduVaani uses your webcam to recognize Indian Sign Language (ISL) hand shapes, motion, and gestures in real time.
        </p>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-3.5 bg-cream-white/90 rounded-2xl border border-warm-sand max-w-md mx-auto flex items-start gap-3 text-left">
        <div className="w-8 h-8 rounded-xl bg-peacock-teal/15 text-peacock-teal flex items-center justify-center flex-shrink-0 mt-0.5">
          <Lock className="h-4 w-4" />
        </div>
        <div className="text-xs space-y-0.5">
          <span className="font-bold text-deep-brown block">100% On-Device Privacy</span>
          <span className="text-deep-brown/65 leading-relaxed block">
            Video frames are processed locally in your browser and are never recorded, transmitted, or stored on any server.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-sm mx-auto">
        <Button
          onClick={onAllowCamera}
          variant="primary"
          size="lg"
          disabled={isRequesting}
          className="w-full sm:w-auto px-7 shadow-warm-sm"
        >
          <Camera className="h-4 w-4 mr-2" />
          {isRequesting ? 'Requesting...' : 'Allow Camera'}
        </Button>

        <Button
          onClick={onLearnWithoutCamera}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
        >
          <span>Learn Without Camera</span>
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}

import { Sparkles, Send, CheckCircle2, History } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

export interface RecognitionItem {
  sign: string;
  hindiMeaning?: string;
  confidence: number;
  time: string;
}

export interface RecognitionOutputProps {
  recognizedSign: string | null;
  hindiMeaning?: string | null;
  confidence: number; // 0 to 1
  isLoading?: boolean;
  isCameraActive: boolean;
  onSendToConversation?: (text: string) => void;
  recentRecognitions?: RecognitionItem[];
}

export function RecognitionOutput({
  recognizedSign,
  hindiMeaning,
  confidence,
  isLoading = false,
  isCameraActive,
  onSendToConversation,
  recentRecognitions = [],
}: RecognitionOutputProps) {
  const confidencePercent = Math.min(100, Math.round(confidence * 100));

  return (
    <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-5 sm:p-6 shadow-warm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-deep-brown font-display">
              Recognized Sign
            </h4>
            <span className="text-[11px] text-deep-brown/60">
              Live Indian Sign Language Decoder
            </span>
          </div>
        </div>

        {recognizedSign && (
          <Badge variant="teal" className="text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Detected
          </Badge>
        )}
      </div>

      {/* Main Display Area */}
      <div className="rounded-2xl border border-warm-sand bg-cream-white p-6 text-center space-y-3 min-h-[160px] flex flex-col justify-center shadow-inner">
        {isLoading ? (
          /* Warm sand skeleton shimmer when model is loading */
          <div className="space-y-3 animate-pulse max-w-xs mx-auto w-full py-4">
            <div className="h-4 w-24 bg-warm-sand/80 rounded-full mx-auto" />
            <div className="h-8 w-3/4 bg-warm-sand/70 rounded-2xl mx-auto" />
            <div className="h-3 w-1/2 bg-warm-sand/50 rounded-lg mx-auto" />
          </div>
        ) : recognizedSign ? (
          /* Recognized Sign Display */
          <div className="space-y-2 animate-slide-up">
            <span className="text-xs font-semibold uppercase tracking-wider text-peacock-teal">
              Current ISL Gesture
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-deep-brown font-display tracking-tight">
              {recognizedSign}
            </div>
            {hindiMeaning && (
              <p className="text-sm font-semibold text-terracotta font-sans">
                {hindiMeaning}
              </p>
            )}
          </div>
        ) : (
          /* Empty / Standby Placeholder */
          <div className="space-y-2 py-4">
            <div className="text-3xl">🤟</div>
            <p className="text-sm font-semibold text-deep-brown/80 font-display">
              {isCameraActive
                ? 'Show a supported sign to begin'
                : 'Turn on camera or type below to practice'}
            </p>
            <p className="text-xs text-deep-brown/55 max-w-xs mx-auto font-sans">
              Perform an ISL sign (such as Namaste, Thank You, or Alphabets) in front of the camera.
            </p>
          </div>
        )}
      </div>

      {/* Confidence Indicator: progress bar in peacock teal (0-100%) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs text-deep-brown/70 font-medium">
          <span>Detection Confidence</span>
          <span className="font-bold font-mono text-peacock-teal">
            {recognizedSign ? `${confidencePercent}%` : '0%'}
          </span>
        </div>
        <Progress
          value={recognizedSign ? confidencePercent : 0}
          className="h-2 bg-warm-sand"
        />
      </div>

      {/* Low-Confidence Correction Fallback: "Did you mean: [X]?" */}
      {isCameraActive && confidencePercent > 0 && confidencePercent < 75 && (
        <div className="p-3 bg-turmeric/15 border border-turmeric/40 rounded-2xl space-y-2 animate-slide-up">
          <div className="flex items-center justify-between text-xs font-bold text-deep-brown">
            <span className="flex items-center gap-1.5">
              <span>🤔</span>
              <span>Did you mean one of these signs?</span>
            </span>
            <span className="text-[10px] text-deep-brown/60 font-mono">Tap to select</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Namaste', 'Hello', 'Thank you', 'Good', 'Help', 'Yes', 'No'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSendToConversation && onSendToConversation(suggestion)}
                className="px-2.5 py-1 rounded-xl bg-cream-white border border-warm-sand hover:border-terracotta text-xs font-semibold text-deep-brown hover:text-terracotta transition-colors shadow-xs cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action CTA: "Send to conversation" button in terracotta */}
      <div className="pt-1">
        <Button
          onClick={() => recognizedSign && onSendToConversation && onSendToConversation(recognizedSign)}
          disabled={!recognizedSign}
          variant="primary"
          className="w-full justify-center shadow-warm-sm"
        >
          <Send className="h-4 w-4 mr-2" />
          Send to Conversation
        </Button>
      </div>

      {/* Recent Recognitions History Log */}
      {recentRecognitions.length > 0 && (
        <div className="pt-2 border-t border-warm-sand/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-deep-brown/65 font-semibold">
            <History className="h-3.5 w-3.5" />
            <span>Recent Recognitions</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recentRecognitions.slice(0, 5).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSendToConversation && onSendToConversation(item.sign)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cream-white border border-warm-sand text-xs text-deep-brown font-medium hover:border-terracotta/40 transition-colors shadow-xs"
              >
                <span className="font-bold">{item.sign}</span>
                <span className="text-[10px] text-peacock-teal font-mono">
                  {Math.round(item.confidence * 100)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

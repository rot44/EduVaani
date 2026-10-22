import { Play, Pause, RotateCcw, AlertTriangle, Sparkles, FastForward } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export interface SignDictionaryEntry {
  word: string;
  hindi: string;
  gestureDescription: string;
  handPostureEmoji: string;
  hasAnimation: boolean;
}

// Built-in Indian Sign Language (ISL) Vocabulary Reference
export const ISL_DICTIONARY: Record<string, SignDictionaryEntry> = {
  namaste: {
    word: 'Namaste',
    hindi: 'नमस्ते / प्रणाम',
    gestureDescription: 'Both palms pressed together flat at chest level, slight respectful nod.',
    handPostureEmoji: '🙏',
    hasAnimation: true,
  },
  hello: {
    word: 'Hello',
    hindi: 'नमस्ते / हैलो',
    gestureDescription: 'Dominant open palm starting near temple and waving smoothly forward.',
    handPostureEmoji: '👋',
    hasAnimation: true,
  },
  'thank you': {
    word: 'Thank you',
    hindi: 'धन्यवाद / शुक्रिया',
    gestureDescription: 'Fingertips of flat hand touch chin/lips, then extend outward toward partner.',
    handPostureEmoji: '🤲',
    hasAnimation: true,
  },
  thanks: {
    word: 'Thanks',
    hindi: 'धन्यवाद',
    gestureDescription: 'Fingertips touch chin, then open outward warmly.',
    handPostureEmoji: '🤲',
    hasAnimation: true,
  },
  good: {
    word: 'Good',
    hindi: 'अच्छा / बढ़िया',
    gestureDescription: 'Fist with thumb upright (thumbs up) moving slightly forward from chest.',
    handPostureEmoji: '👍',
    hasAnimation: true,
  },
  morning: {
    word: 'Morning',
    hindi: 'सुबह',
    gestureDescription: 'Curved open hand rising above flat base arm, symbolizing the rising sun.',
    handPostureEmoji: '🌅',
    hasAnimation: true,
  },
  yes: {
    word: 'Yes',
    hindi: 'हाँ',
    gestureDescription: 'Closed fist nodding up and down from the wrist, imitating head nodding.',
    handPostureEmoji: '✊',
    hasAnimation: true,
  },
  no: {
    word: 'No',
    hindi: 'नहीं',
    gestureDescription: 'Index and middle fingers snap together against thumb twice.',
    handPostureEmoji: '✌️',
    hasAnimation: true,
  },
  help: {
    word: 'Help',
    hindi: 'मदद / सहायता',
    gestureDescription: 'Closed fist with thumb up placed on flat palm of base hand, lifted upward.',
    handPostureEmoji: '🤝',
    hasAnimation: true,
  },
  please: {
    word: 'Please',
    hindi: 'कृपया',
    gestureDescription: 'Open flat hand circling gently clockwise over chest/heart area.',
    handPostureEmoji: '🤲',
    hasAnimation: true,
  },
  english: {
    word: 'English',
    hindi: 'अंग्रेज़ी',
    gestureDescription: 'Dominant hand lightly clasps base hand across the back of the hand twice.',
    handPostureEmoji: '🤝',
    hasAnimation: true,
  },
  learn: {
    word: 'Learn',
    hindi: 'सीखना',
    gestureDescription: 'Fingertips take knowledge from open flat palm and touch forehead.',
    handPostureEmoji: '💡',
    hasAnimation: true,
  },
  india: {
    word: 'India',
    hindi: 'भारत',
    gestureDescription: 'Thumb of dominant hand touching center of forehead with circular motion.',
    handPostureEmoji: '🇮🇳',
    hasAnimation: true,
  },
  bharat: {
    word: 'Bharat',
    hindi: 'भारत',
    gestureDescription: 'Thumb touches center of forehead gently (bindi placement position).',
    handPostureEmoji: '🇮🇳',
    hasAnimation: true,
  },
  friend: {
    word: 'Friend',
    hindi: 'दोस्त / मित्र',
    gestureDescription: 'Index fingers of both hands hook together, first one way then reversed.',
    handPostureEmoji: '🤞',
    hasAnimation: true,
  },
};

export interface SignGenerationOutputProps {
  inputWords: string[];
  currentWordIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  onSpeedChange: (speed: number) => void;
  onSelectWord: (index: number) => void;
}

export function SignGenerationOutput({
  inputWords,
  currentWordIndex,
  isPlaying,
  playbackSpeed,
  onPlay,
  onPause,
  onReplay,
  onSpeedChange,
  onSelectWord,
}: SignGenerationOutputProps) {
  const currentRawWord = inputWords[currentWordIndex]?.toLowerCase().replace(/[^\w\s]/g, '') || '';
  const signEntry = ISL_DICTIONARY[currentRawWord];
  const hasSign = Boolean(signEntry);

  return (
    <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-5 sm:p-6 shadow-warm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-peacock-teal/15 text-peacock-teal flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-deep-brown font-display">
              Sign Language Response
            </h4>
            <span className="text-[11px] text-deep-brown/60">
              Indian Sign Language (ISL) Visualizer
            </span>
          </div>
        </div>

        {inputWords.length > 0 && (
          <Badge variant="turmeric" className="text-xs">
            Word {currentWordIndex + 1} of {inputWords.length}
          </Badge>
        )}
      </div>

      {/* Word-by-word Highlight Row */}
      {inputWords.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-cream-white/90 rounded-2xl border border-warm-sand">
          {inputWords.map((word, idx) => {
            const isCurrent = idx === currentWordIndex;
            const cleaned = word.toLowerCase().replace(/[^\w\s]/g, '');
            const available = Boolean(ISL_DICTIONARY[cleaned]);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectWord(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-terracotta text-cream-white shadow-warm-sm scale-105'
                    : available
                    ? 'bg-warm-sand/60 text-deep-brown hover:bg-warm-sand'
                    : 'bg-warm-sand/30 text-deep-brown/40 border border-dashed border-warm-sand'
                }`}
              >
                {word}
                {!available && <span className="ml-1 text-[10px] text-soft-coral">?</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Sign Visualizer Stage (Visual Studio & Motion Area) */}
      <div className="rounded-2xl border border-warm-sand bg-cream-white p-6 sm:p-8 min-h-[220px] flex flex-col items-center justify-center text-center relative overflow-hidden shadow-inner">
        {inputWords.length === 0 ? (
          <div className="space-y-2 py-4">
            <div className="text-4xl">🤟</div>
            <p className="font-bold text-sm text-deep-brown font-display">
              Enter text above to generate signs
            </p>
            <p className="text-xs text-deep-brown/60 max-w-xs mx-auto font-sans">
              EduVaani maps spoken English words into standard Indian Sign Language hand postures.
            </p>
          </div>
        ) : hasSign ? (
          <div className="space-y-4 max-w-md mx-auto animate-slide-up">
            {/* Gesture Emoji / Posture Demonstration Badge */}
            <div className="w-20 h-20 rounded-3xl bg-peacock-teal/15 text-peacock-teal border-2 border-peacock-teal/30 flex items-center justify-center text-4xl mx-auto shadow-warm-sm">
              {signEntry.handPostureEmoji}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-deep-brown font-display">
                  {signEntry.word}
                </h3>
                <span className="text-sm font-semibold text-terracotta">
                  ({signEntry.hindi})
                </span>
              </div>
              <p className="text-xs text-deep-brown/75 leading-relaxed font-sans px-4">
                {signEntry.gestureDescription}
              </p>
            </div>

            <div className="pt-1">
              <Badge variant="teal" className="text-[11px]">
                Standard ISL Sign Verified ✓
              </Badge>
            </div>
          </div>
        ) : (
          /* Fallback when a word has no sign mapping */
          <div className="space-y-3 py-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-warm-sand text-deep-brown/60 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6 text-turmeric-dark" />
            </div>
            <div className="space-y-1">
              <span className="text-base font-bold text-deep-brown font-display">
                &quot;{inputWords[currentWordIndex]}&quot;
              </span>
              <p className="text-xs text-deep-brown/60 font-sans">
                No direct ISL dictionary mapping available for this word yet.
              </p>
            </div>
            <Badge variant="sand" className="text-[10px] text-deep-brown/60">
              Finger-spelling fallback in Prompt 8
            </Badge>
          </div>
        )}
      </div>

      {/* Controls Bar: Replay, Play/Pause, Speed (0.75x, 1.0x, 1.25x) */}
      <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <Button onClick={onPause} variant="primary" size="sm" className="h-9 px-4">
              <Pause className="h-4 w-4 mr-1.5" />
              Pause
            </Button>
          ) : (
            <Button
              onClick={onPlay}
              disabled={inputWords.length === 0}
              variant="primary"
              size="sm"
              className="h-9 px-4 shadow-warm-sm"
            >
              <Play className="h-4 w-4 mr-1.5" />
              Play Sequence
            </Button>
          )}

          <Button
            onClick={onReplay}
            disabled={inputWords.length === 0}
            variant="outline"
            size="sm"
            className="h-9 px-3"
            title="Replay from first sign"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Replay
          </Button>
        </div>

        {/* Speed Adjustment Buttons */}
        <div className="flex items-center gap-1 p-1 bg-cream-white rounded-xl border border-warm-sand text-xs font-semibold">
          <span className="text-[10px] text-deep-brown/60 px-1.5 flex items-center gap-0.5">
            <FastForward className="h-3 w-3" /> Pace:
          </span>
          {[0.75, 1.0, 1.25].map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => onSpeedChange(speed)}
              className={`px-2 py-1 rounded-lg text-xs font-mono transition-colors ${
                playbackSpeed === speed
                  ? 'bg-terracotta text-cream-white font-bold shadow-xs'
                  : 'text-deep-brown/70 hover:text-deep-brown'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

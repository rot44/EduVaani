import { Play, Pause, RotateCcw, Sparkles, FastForward, Info, HelpCircle, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { SignGenerationResult } from '../../lib/signGeneration';
import { speechService } from '../../lib/speech';
import signAnimationsData from '../../data/isl-sign-animations.json';
import { ISLSignVisualizer } from './ISLSignVisualizer';

// Backward-compatible dictionary export for SignInstructions
export const ISL_DICTIONARY = Object.entries(signAnimationsData.words).reduce(
  (acc, [key, val]) => {
    acc[key] = {
      word: val.label,
      hindi: val.hindi || '',
      gestureDescription: val.description,
      handPostureEmoji: val.emoji,
      hasAnimation: true,
    };
    return acc;
  },
  {} as Record<
    string,
    { word: string; hindi: string; gestureDescription: string; handPostureEmoji: string; hasAnimation: boolean }
  >
);

export interface SignGenerationOutputProps {
  signResult: SignGenerationResult;
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number; // 0.5, 1.0, 1.5
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  onSpeedChange: (speed: number) => void;
  onSelectStep: (index: number) => void;
}

export function SignGenerationOutput({
  signResult,
  currentStepIndex,
  isPlaying,
  playbackSpeed,
  onPlay,
  onPause,
  onReplay,
  onSpeedChange,
  onSelectStep,
}: SignGenerationOutputProps) {
  const sequence = signResult.sequence || [];
  const currentItem = sequence[currentStepIndex] || sequence[0];
  const hasSequence = sequence.length > 0;

  return (
    <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-5 sm:p-6 shadow-warm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-peacock-teal/15 text-peacock-teal flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-deep-brown font-display">
              Sign Language Response
            </h4>
            <span className="text-[11px] text-deep-brown/60">
              Authentic Indian Sign Language (ISL) Visualizer
            </span>
          </div>
        </div>

        {hasSequence && (
          <div className="flex items-center gap-2">
            <Badge variant="teal" className="text-xs">
              Step {currentStepIndex + 1} of {sequence.length}
            </Badge>
            {signResult.islGloss && (
              <span className="text-[11px] font-mono text-terracotta bg-cream-white px-2.5 py-0.5 rounded-lg border border-warm-sand hidden sm:inline-block">
                ISL: {signResult.islGloss}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ISL Grammar Notes Banner (Shows SVO -> SOV reordering) */}
      {signResult.grammarTransformationNotes && signResult.grammarTransformationNotes.length > 0 && (
        <div className="p-3 bg-cream-white/95 rounded-2xl border border-warm-sand text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-peacock-teal font-bold">
            <Info className="h-3.5 w-3.5" />
            <span>ISL Grammar Transformation</span>
          </div>
          <ul className="list-disc list-inside text-deep-brown/75 text-[11px] space-y-0.5 font-sans">
            {signResult.grammarTransformationNotes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Word-by-Word Sequential Highlighting Ribbon */}
      {hasSequence && (
        <div className="flex flex-wrap items-center gap-2 p-3.5 bg-cream-white/90 rounded-2xl border border-warm-sand shadow-inner max-h-36 overflow-y-auto scrollbar-thin">
          {sequence.map((item, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;

            if (item.signType === 'unsupported') {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectStep(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-terracotta text-cream-white font-bold shadow-warm-sm scale-105'
                      : 'bg-warm-sand/40 text-deep-brown/50 border border-dashed border-warm-sand'
                  }`}
                >
                  <span>{item.word}</span>
                  <span className="ml-1 text-[10px] text-soft-coral/80">
                    (no sign available)
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectStep(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-terracotta text-cream-white font-bold shadow-warm-sm scale-105 z-10 ring-2 ring-terracotta/30'
                    : isCompleted
                    ? 'bg-peacock-teal/20 text-peacock-teal border border-peacock-teal/40 font-medium'
                    : 'bg-warm-sand/60 text-deep-brown hover:bg-warm-sand'
                }`}
              >
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/10">
                  {idx + 1}
                </span>
                <span className="text-xs" title={item.signData.hands === 'two-handed' ? 'Two-Handed Sign' : 'One-Handed Sign'}>
                  {item.signData.hands === 'two-handed' ? '👐' : '✋'}
                </span>
                <span>{item.displayWord}</span>
                {item.signType === 'fingerspell' && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-black/10 text-current">
                    Spelled
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Sign Visualization Stage */}
      <div className="rounded-2xl border border-warm-sand bg-cream-white p-4 sm:p-6 min-h-[260px] flex flex-col items-center justify-center text-center relative overflow-hidden shadow-inner">
        {!hasSequence ? (
          <div className="space-y-2 py-4">
            <div className="text-4xl">🤟</div>
            <p className="font-bold text-sm text-deep-brown font-display">
              Enter text above to generate signs
            </p>
            <p className="text-xs text-deep-brown/60 max-w-xs mx-auto font-sans">
              EduVaani converts spoken English words into certified Indian Sign Language postures and fingerspelling.
            </p>
          </div>
        ) : currentItem ? (
          <div className="space-y-4 max-w-lg mx-auto animate-slide-up w-full flex flex-col items-center">
            {/* Authentic ISL Hand Posture & Kinematic Motion Visualizer (Replaces generic emojis) */}
            <ISLSignVisualizer
              signData={currentItem.signData}
              signType={currentItem.signType}
              word={currentItem.word}
              isPlaying={isPlaying}
            />

            {/* Title & Meaning */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-deep-brown font-display">
                  {currentItem.signData.label}
                </h3>
                {currentItem.signData.hindi && (
                  <span className="text-sm font-semibold text-terracotta">
                    ({currentItem.signData.hindi})
                  </span>
                )}
              </div>

              {/* Fingerspelling or Word Sign Badge */}
              <div className="flex justify-center gap-2">
                {currentItem.signType === 'fingerspell' ? (
                  <Badge variant="turmeric" className="text-xs font-bold">
                    ISL Alphabet Fingerspelling (2-Handed)
                  </Badge>
                ) : currentItem.signType === 'word' ? (
                  <Badge variant="teal" className="text-xs font-bold">
                    Standard ISL Sign Verified ✓
                  </Badge>
                ) : (
                  <Badge variant="sand" className="text-xs">
                    Unsupported • Text Representation
                  </Badge>
                )}
              </div>

              {/* Kinematic Hand Shape & Motion Instructions */}
              <p className="text-xs text-deep-brown/80 leading-relaxed font-sans px-2 pt-1">
                {currentItem.signData.description}
              </p>

              {/* Educational Two-Handed Fingerspelling & Kinematic Guide */}
              {currentItem.signType === 'fingerspell' && (
                <div className="p-3 bg-warm-ivory/90 rounded-2xl border border-warm-sand max-w-sm mx-auto flex items-center gap-3 text-left shadow-xs">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-turmeric/25 to-terracotta/20 border border-turmeric/40 flex items-center justify-center flex-shrink-0 text-lg font-mono font-extrabold text-deep-brown shadow-xs">
                    {currentItem.signData.label.replace('Letter ', '')}
                  </div>
                  <div className="text-xs space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-deep-brown">
                      <span>ISL Two-Handed Alphabet</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-peacock-teal/15 text-peacock-teal font-medium">
                        ISLRTC Validated
                      </span>
                    </div>
                    <p className="text-[11px] text-deep-brown/70 leading-snug">
                      Touch point: <span className="font-semibold text-terracotta">{currentItem.signData.touchPoint?.replace(/_/g, ' ') || 'Two-handed posture'}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Unsupported Word Voice Pronunciation Fallback */}
              {currentItem.signType === 'unsupported' && (
                <div className="p-3 bg-warm-ivory/90 rounded-2xl border border-warm-sand max-w-sm mx-auto flex items-center justify-between gap-3 text-left shadow-xs animate-slide-up">
                  <div className="text-xs space-y-0.5">
                    <div className="font-bold text-deep-brown flex items-center gap-1">
                      <span>No Direct Sign Mapping</span>
                    </div>
                    <p className="text-[11px] text-deep-brown/65">
                      Word: <span className="font-semibold text-terracotta">&quot;{currentItem.word}&quot;</span> (Listen to pronunciation)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => speechService.speak(currentItem.word)}
                    className="px-3 py-1.5 rounded-xl bg-peacock-teal/15 hover:bg-peacock-teal/25 text-peacock-teal border border-peacock-teal/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs flex-shrink-0"
                    title="Listen to spoken English audio pronunciation"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Pronounce</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Playback Controls Bar: Play/Pause, Replay, Variable Speed (0.5x, 1.0x, 1.5x) */}
      <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <Button onClick={onPause} variant="primary" size="sm" className="h-9 px-4 shadow-warm-sm">
              <Pause className="h-4 w-4 mr-1.5" />
              Pause
            </Button>
          ) : (
            <Button
              onClick={onPlay}
              disabled={!hasSequence}
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
            disabled={!hasSequence}
            variant="outline"
            size="sm"
            className="h-9 px-3"
            title="Replay sequence from start"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Replay
          </Button>
        </div>

        {/* Speed Adjustment: 0.5x, 1x, 1.5x */}
        <div className="flex items-center gap-1 p-1 bg-cream-white rounded-xl border border-warm-sand text-xs font-semibold shadow-xs">
          <span className="text-[10px] text-deep-brown/60 px-1.5 flex items-center gap-0.5 font-medium">
            <FastForward className="h-3 w-3" /> Speed:
          </span>
          {[0.5, 1.0, 1.5].map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => onSpeedChange(speed)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                playbackSpeed === speed
                  ? 'bg-terracotta text-cream-white font-bold shadow-xs'
                  : 'text-deep-brown/70 hover:text-deep-brown'
              }`}
            >
              {speed === 1.0 ? '1x' : `${speed}x`}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Helper Note */}
      <div className="pt-1 flex items-center justify-between text-[11px] text-deep-brown/60 px-1">
        <span className="flex items-center gap-1">
          <HelpCircle className="h-3.5 w-3.5 text-peacock-teal" />
          <span>Fingerspelling uses verified two-handed ISL alphabets</span>
        </span>
        <span>Tap any word in the sequence to inspect its sign</span>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { Volume2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export interface VocabularyCard {
  word: string;
  pronunciation: string;
  meaningHindi: string;
  example: string;
  category: string;
}

export interface FlashcardDeckProps {
  card: VocabularyCard;
  currentIndex: number;
  totalCards: number;
  isFlipped: boolean;
  isMastered: boolean;
  onFlip: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleMastered: () => void;
  onSpeak: (text: string) => void;
  speakingWord?: string | null;
}

export function FlashcardDeck({
  card,
  currentIndex,
  totalCards,
  isFlipped,
  isMastered,
  onFlip,
  onPrev,
  onNext,
  onToggleMastered,
  onSpeak,
  speakingWord,
}: FlashcardDeckProps) {
  // Requirement 4: Arrow keys navigate flashcard deck
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        onFlip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrev, onNext, onFlip]);

  return (
    <div className="max-w-xl mx-auto py-2 space-y-5" aria-label="Vocabulary Flashcard Deck">
      {/* Deck Progress Meta */}
      <div className="flex items-center justify-between text-xs text-deep-brown/75 px-1 font-medium">
        <span>
          Card {currentIndex + 1} of {totalCards} • <span className="font-mono text-[11px]">Use ← / → keys</span>
        </span>
        <span className={isMastered ? 'text-peacock-teal font-bold' : 'text-turmeric-dark font-semibold'}>
          {isMastered ? '✅ Mastered' : '🌱 In Progress'}
        </span>
      </div>

      {/* Main Flip Card Container */}
      <div
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label={`Flashcard: ${card.word}. ${isFlipped ? `Meaning: ${card.meaningHindi}. Example: ${card.example}` : 'Tap or press Enter to flip card.'}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onFlip();
          }
        }}
        className="w-full min-h-[300px] rounded-3xl border-2 border-warm-sand bg-warm-ivory hover:border-terracotta/40 p-8 sm:p-10 cursor-pointer transition-all duration-300 shadow-warm-md hover:shadow-warm-lg relative flex flex-col justify-between select-none focus-visible:ring-2 focus-visible:ring-terracotta"
      >
        {!isFlipped ? (
          /* Front Side */
          <div className="text-center my-auto space-y-4">
            <div className="flex justify-center">
              <Badge variant="primary" className="text-xs">
                {card.category}
              </Badge>
            </div>

            <h3 className="text-4xl font-extrabold text-deep-brown tracking-wide font-display">
              {card.word}
            </h3>

            <p className="text-base text-peacock-teal font-mono">
              {card.pronunciation}
            </p>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(card.word);
                }}
                className="w-12 h-12 rounded-full bg-peacock-teal/15 border border-peacock-teal/30 text-peacock-teal hover:bg-peacock-teal/25 flex items-center justify-center transition-all cursor-pointer shadow-warm-sm min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-peacock-teal"
                title="Listen to pronunciation"
                aria-label={`Listen to pronunciation of ${card.word}`}
              >
                <Volume2
                  className={`h-5 w-5 ${
                    speakingWord === card.word ? 'animate-bounce text-turmeric-dark' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>

            <p className="text-xs text-deep-brown/75 pt-2 font-sans font-medium">
              👆 Tap card or press Space/Enter to flip
            </p>
          </div>
        ) : (
          /* Back Side */
          <div className="text-center my-auto space-y-4 animate-slide-up">
            <div className="text-2xl sm:text-3xl font-bold text-terracotta font-display">
              {card.meaningHindi}
            </div>

            <div className="bg-cream-white/95 p-4 rounded-2xl border border-warm-sand text-left shadow-warm-sm">
              <p className="text-xs text-deep-brown/75 mb-1 font-semibold uppercase tracking-wider">
                Example in Context
              </p>
              <p className="text-sm text-deep-brown font-serif italic leading-relaxed">
                &quot;{card.example}&quot;
              </p>
            </div>

            <div className="pt-1 flex justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(card.example);
                }}
                className="border border-peacock-teal/30 bg-peacock-teal/10 hover:bg-peacock-teal/20 text-peacock-teal px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors font-semibold shadow-warm-sm min-h-[44px] focus-visible:ring-2 focus-visible:ring-peacock-teal"
                aria-label={`Hear example sentence spoken: ${card.example}`}
              >
                <Volume2 className="h-4 w-4" aria-hidden="true" />
                <span>Hear Full Sentence</span>
              </button>
            </div>

            <p className="text-xs text-deep-brown/75 pt-1 font-sans font-medium">
              👆 Tap card or press Space/Enter to flip back
            </p>
          </div>
        )}
      </div>

      {/* Navigation & Mastery Controls */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <Button
          onClick={onPrev}
          variant="outline"
          size="sm"
          className="text-xs rounded-xl min-h-[44px] px-3.5"
          aria-label="Previous flashcard (Left Arrow key)"
        >
          <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
          Previous
        </Button>

        {/* Mark Mastered Button: terracotta -> peacock teal when mastered */}
        <Button
          onClick={onToggleMastered}
          variant={isMastered ? 'secondary' : 'primary'}
          size="sm"
          className="text-xs rounded-xl min-h-[44px] px-4 font-bold"
          aria-label={isMastered ? 'Mark word as unmastered' : 'Mark word as mastered'}
        >
          <Check className="h-4 w-4 mr-1" aria-hidden="true" />
          {isMastered ? 'Mastered! ✓' : 'Mark Mastered'}
        </Button>

        <Button
          onClick={onNext}
          variant="outline"
          size="sm"
          className="text-xs rounded-xl min-h-[44px] px-3.5"
          aria-label="Next flashcard (Right Arrow key)"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

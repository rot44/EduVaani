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
  return (
    <div className="max-w-xl mx-auto py-2 space-y-5">
      {/* Deck Progress Meta */}
      <div className="flex items-center justify-between text-xs text-deep-brown/60 px-1 font-medium">
        <span>
          Card {currentIndex + 1} of {totalCards}
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
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onFlip();
          }
        }}
        className="w-full min-h-[300px] rounded-3xl border-2 border-warm-sand bg-warm-ivory hover:border-terracotta/40 p-8 sm:p-10 cursor-pointer transition-all duration-300 shadow-warm-md hover:shadow-warm-lg relative flex flex-col justify-between select-none"
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
                className="w-12 h-12 rounded-full bg-peacock-teal/15 border border-peacock-teal/30 text-peacock-teal hover:bg-peacock-teal/25 flex items-center justify-center transition-all cursor-pointer shadow-warm-sm"
                title="Listen to pronunciation"
              >
                <Volume2
                  className={`h-5 w-5 ${
                    speakingWord === card.word ? 'animate-bounce text-turmeric-dark' : ''
                  }`}
                />
              </button>
            </div>

            <p className="text-[11px] text-deep-brown/50 pt-2 font-sans">
              👆 Tap card to flip for Hindi meaning &amp; usage
            </p>
          </div>
        ) : (
          /* Back Side */
          <div className="text-center my-auto space-y-4 animate-slide-up">
            <div className="text-2xl sm:text-3xl font-bold text-terracotta font-display">
              {card.meaningHindi}
            </div>

            <div className="bg-cream-white/95 p-4 rounded-2xl border border-warm-sand text-left shadow-warm-sm">
              <p className="text-xs text-deep-brown/60 mb-1 font-semibold uppercase tracking-wider">
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
                className="border border-peacock-teal/30 bg-peacock-teal/10 hover:bg-peacock-teal/20 text-peacock-teal px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors font-semibold shadow-warm-sm"
              >
                <Volume2 className="h-4 w-4" />
                Hear Full Sentence
              </button>
            </div>

            <p className="text-[11px] text-deep-brown/50 pt-1 font-sans">
              👆 Tap card to flip back
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
          className="text-xs rounded-xl"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        {/* Mark Mastered Button: terracotta -> peacock teal when mastered */}
        <Button
          onClick={onToggleMastered}
          variant={isMastered ? 'secondary' : 'primary'}
          size="sm"
          className="text-xs rounded-xl"
        >
          <Check className="h-4 w-4 mr-1" />
          {isMastered ? 'Mastered! ✓' : 'Mark Mastered'}
        </Button>

        <Button
          onClick={onNext}
          variant="outline"
          size="sm"
          className="text-xs rounded-xl"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

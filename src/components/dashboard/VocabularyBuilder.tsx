import { useState } from 'react';
import { BookOpen, Layers, LayoutGrid, Volume2, Check } from 'lucide-react';
import { Badge } from '../ui/badge';
import { FlashcardDeck, type VocabularyCard } from './FlashcardDeck';

export interface VocabularyBuilderProps {
  vocabulary: VocabularyCard[];
  masteredWords: string[];
  onToggleMastered: (word: string) => void;
  onSpeak: (text: string) => void;
  speakingWord: string | null;
}

export function VocabularyBuilder({
  vocabulary,
  masteredWords,
  onToggleMastered,
  onSpeak,
  speakingWord,
}: VocabularyBuilderProps) {
  const [vocabMode, setVocabMode] = useState<'grid' | 'flashcard'>('grid');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = vocabulary[flashcardIndex] || vocabulary[0];
  const isCurrentMastered = masteredWords.includes(currentCard.word);

  const handlePrevCard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : vocabulary.length - 1));
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev < vocabulary.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 sm:p-8 shadow-warm">
      {/* Header with Title & Mode Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-peacock-teal/15 text-peacock-teal flex items-center justify-center">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-deep-brown">
                Daily Indian English Vocabulary
              </h2>
              <Badge variant="teal" className="text-xs">
                {masteredWords.length}/{vocabulary.length} Mastered
              </Badge>
            </div>
            <p className="text-xs text-deep-brown/65 mt-0.5">
              Everyday phrases with authentic Indian context and pronunciation
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="p-1 rounded-2xl bg-warm-sand/50 border border-warm-sand flex items-center gap-1">
          <button
            type="button"
            onClick={() => setVocabMode('grid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              vocabMode === 'grid'
                ? 'bg-cream-white text-terracotta shadow-warm-sm font-bold'
                : 'text-deep-brown/70 hover:text-deep-brown'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Grid View
          </button>
          <button
            type="button"
            onClick={() => {
              setVocabMode('flashcard');
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              vocabMode === 'flashcard'
                ? 'bg-cream-white text-terracotta shadow-warm-sm font-bold'
                : 'text-deep-brown/70 hover:text-deep-brown'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            3D Flashcards
          </button>
        </div>
      </div>

      {/* Mode View Content */}
      {vocabMode === 'flashcard' ? (
        <FlashcardDeck
          card={currentCard}
          currentIndex={flashcardIndex}
          totalCards={vocabulary.length}
          isFlipped={isFlipped}
          isMastered={isCurrentMastered}
          onFlip={() => setIsFlipped((prev) => !prev)}
          onPrev={handlePrevCard}
          onNext={handleNextCard}
          onToggleMastered={() => onToggleMastered(currentCard.word)}
          onSpeak={onSpeak}
          speakingWord={speakingWord}
        />
      ) : (
        /* Grid View */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vocabulary.map((item) => {
            const isMastered = masteredWords.includes(item.word);
            return (
              <div
                key={item.word}
                className="rounded-2xl border border-warm-sand bg-cream-white/95 p-5 transition-all duration-300 flex flex-col justify-between group shadow-warm-sm hover:shadow-warm-md hover:border-peacock-teal/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-deep-brown font-bold text-base flex items-center gap-2 font-display">
                      {item.word}
                      <span className="text-xs text-deep-brown/50 font-mono font-normal">
                        {item.pronunciation}
                      </span>
                    </h3>

                    <div className="flex items-center gap-1.5">
                      {isMastered && (
                        <span className="text-[10px] bg-turmeric/20 text-deep-brown border border-turmeric/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                          <Check className="h-3 w-3 text-peacock-teal" />
                          Mastered
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => onSpeak(item.word)}
                        title="Listen to pronunciation"
                        className="text-peacock-teal hover:text-peacock-teal-dark bg-peacock-teal/10 hover:bg-peacock-teal/20 border border-peacock-teal/30 rounded-full p-2 transition-colors cursor-pointer shadow-sm"
                      >
                        <Volume2
                          className={`h-4 w-4 ${
                            speakingWord === item.word ? 'animate-bounce text-turmeric-dark' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-terracotta font-semibold mb-2.5">
                    {item.meaningHindi}
                  </div>

                  <p className="text-xs text-deep-brown/80 font-serif italic leading-relaxed bg-warm-ivory/80 p-2.5 rounded-xl border border-warm-sand">
                    &quot;{item.example}&quot;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-warm-sand flex items-center justify-between text-[11px] text-deep-brown/65">
                  <span className="bg-warm-sand/60 px-2.5 py-0.5 rounded-full font-medium text-deep-brown">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleMastered(item.word)}
                      className={`text-[11px] font-semibold transition-colors cursor-pointer ${
                        isMastered
                          ? 'text-peacock-teal hover:underline'
                          : 'text-terracotta hover:underline'
                      }`}
                    >
                      {isMastered ? 'Mastered ✓' : 'Mark Mastered'}
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => onSpeak(item.example)}
                      className="text-peacock-teal hover:text-peacock-teal-dark font-medium transition-colors cursor-pointer"
                    >
                      Hear 🔊
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

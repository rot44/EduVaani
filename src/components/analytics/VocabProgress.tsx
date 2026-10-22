import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { Badge } from '../ui/badge';
import { CURRICULUM_VOCABULARY, getMasteredWords } from './analyticsData';

interface VocabProgressProps {
  initialMastered?: string[];
}

export function VocabProgress({ initialMastered }: VocabProgressProps) {
  const [masteredWords, setMasteredWords] = useState<string[]>(
    () => initialMastered || getMasteredWords()
  );

  useEffect(() => {
    // Listen for storage changes if user masters words in another tab
    const handleStorage = () => {
      setMasteredWords(getMasteredWords());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const totalWords = CURRICULUM_VOCABULARY.length;
  const masteredCount = masteredWords.length;
  const progressPercent = Math.min(100, Math.round((masteredCount / totalWords) * 100));

  // Determine stage title
  const getStageBadge = (count: number) => {
    if (count >= 18) return { label: 'Vocab Master 👑', color: 'terracotta' as const };
    if (count >= 10) return { label: 'Confident Speaker 🌟', color: 'turmeric' as const };
    if (count >= 5) return { label: 'Wordsmith 🌿', color: 'teal' as const };
    return { label: 'Word Explorer 🌱', color: 'outline' as const };
  };

  const stage = getStageBadge(masteredCount);

  // Split curriculum into mastered and learning
  const masteredItems = CURRICULUM_VOCABULARY.filter((v) =>
    masteredWords.includes(v.word)
  );
  const nextToLearn = CURRICULUM_VOCABULARY.filter(
    (v) => !masteredWords.includes(v.word)
  ).slice(0, 4);

  return (
    <div className="bg-warm-ivory border border-warm-sand rounded-3xl p-6 sm:p-7 shadow-warm-sm flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-turmeric/20 text-turmeric-dark flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-deep-brown font-display flex items-center gap-2">
                Vocabulary Retention
                <Badge variant={stage.color} className="text-[10px] font-bold">
                  {stage.label}
                </Badge>
              </h3>
              <p className="text-xs text-deep-brown/75">
                Foundation Indian English vocabulary tracked through daily flashcards
              </p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-cream-white border border-warm-sand text-xs font-semibold text-deep-brown flex items-center gap-2 shadow-xs">
            <span className="text-terracotta font-extrabold text-sm">{masteredCount}</span>
            <span className="text-deep-brown/70">/ {totalWords} Mastered</span>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="space-y-2 mt-5">
          <div className="flex items-center justify-between text-xs font-semibold text-deep-brown">
            <span>Overall Curriculum Retention</span>
            <span className="font-mono text-terracotta font-bold">{progressPercent}% Complete</span>
          </div>

          <div
            className="h-3.5 bg-warm-sand/80 rounded-full overflow-hidden p-0.5 border border-warm-sand"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Vocabulary curriculum progress"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-terracotta via-turmeric to-peacock-teal transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Mastered Chips */}
        <div className="mt-6 space-y-2.5">
          <span className="text-xs font-bold text-deep-brown/75 uppercase tracking-wider block">
            Recently Mastered ({masteredItems.length}):
          </span>
          <div className="flex flex-wrap gap-2">
            {masteredItems.length > 0 ? (
              masteredItems.map((item) => (
                <div
                  key={item.word}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-peacock-teal/10 border border-peacock-teal/30 text-xs font-bold text-peacock-teal shadow-xs"
                >
                  <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{item.word}</span>
                  <span className="text-[10px] font-normal text-deep-brown/60">
                    ({item.hindi})
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-deep-brown/60 italic">
                Flip flashcards on your dashboard and tap &ldquo;Mark as Mastered&rdquo; to build your bank!
              </p>
            )}
          </div>
        </div>

        {/* Upcoming Words to Practice */}
        <div className="mt-5 space-y-2">
          <span className="text-xs font-bold text-deep-brown/75 uppercase tracking-wider block">
            Next to Practice:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {nextToLearn.map((item) => (
              <div
                key={item.word}
                className="p-2.5 bg-cream-white rounded-xl border border-warm-sand/80 flex items-center justify-between text-xs"
              >
                <div>
                  <strong className="block text-deep-brown font-display font-semibold">
                    {item.word}
                  </strong>
                  <span className="text-[10px] text-deep-brown/65">{item.hindi}</span>
                </div>
                <Badge variant="outline" className="text-[9px] py-0 px-1.5 bg-warm-sand/30">
                  {item.category}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action CTA to Dashboard Flashcards */}
      <div className="mt-6 pt-4 border-t border-warm-sand/80 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-deep-brown/75">
          <Sparkles className="h-3.5 w-3.5 text-turmeric" aria-hidden="true" />
          <span>Interactive 3D deck updated daily with native pronunciation</span>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl bg-warm-sand/60 hover:bg-terracotta text-deep-brown hover:text-cream-white text-xs font-bold transition-all shadow-xs"
        >
          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Practice Flashcards</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

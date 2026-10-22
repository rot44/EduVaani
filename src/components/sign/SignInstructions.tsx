import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Info, HelpCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ISL_DICTIONARY } from './SignGenerationOutput';

export interface SignInstructionsProps {
  onSelectSign?: (word: string) => void;
}

export function SignInstructions({ onSelectSign }: SignInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const supportedSigns = Object.values(ISL_DICTIONARY);
  const supportedCount = supportedSigns.length;

  return (
    <div className="rounded-3xl border border-warm-sand bg-warm-ivory shadow-warm overflow-hidden transition-all duration-300">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-warm-sand/20 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-turmeric/20 text-deep-brown flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-turmeric-dark" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm sm:text-base text-deep-brown font-display">
                Supported ISL Signs Reference ({supportedCount})
              </h4>
              <Badge variant="teal" className="text-[10px]">
                Verified ISL
              </Badge>
            </div>
            <p className="text-xs text-deep-brown/65 mt-0.5 font-sans">
              Indian Sign Language vocabulary guidelines and hand postures
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-deep-brown/60 hidden sm:inline">
            {isOpen ? 'Collapse' : 'View Dictionary'}
          </span>
          <div className="w-8 h-8 rounded-full bg-cream-white border border-warm-sand flex items-center justify-center text-deep-brown">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </button>

      {/* Expanded Reference Body */}
      {isOpen && (
        <div className="px-5 pb-6 sm:px-6 space-y-4 border-t border-warm-sand/80 pt-4 animate-slide-up">
          
          {/* Honest Capability Disclaimer */}
          <div className="p-3.5 bg-cream-white rounded-2xl border border-turmeric/40 flex items-start gap-3 shadow-xs">
            <Info className="h-4 w-4 text-turmeric-dark flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-deep-brown">
                Indian Sign Language (ISL) Standard Notice
              </p>
              <p className="text-deep-brown/75 leading-relaxed font-sans">
                EduVaani currently supports <span className="font-bold text-terracotta">{supportedCount} curated ISL vocabulary signs</span> for basic greetings, emergency help, and classroom English. Full conversational ISL translation with complex facial grammar is in progressive development.
              </p>
            </div>
          </div>

          {/* Grid of Visual Reference Cards for each supported sign */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {supportedSigns.map((entry) => (
              <div
                key={entry.word}
                onClick={() => onSelectSign && onSelectSign(entry.word)}
                className="p-3.5 rounded-2xl bg-cream-white/95 border border-warm-sand hover:border-terracotta/40 transition-all shadow-xs space-y-2 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{entry.handPostureEmoji}</span>
                    <div>
                      <h5 className="font-bold text-sm text-deep-brown group-hover:text-terracotta transition-colors font-display">
                        {entry.word}
                      </h5>
                      <span className="text-[11px] text-terracotta font-semibold">
                        {entry.hindi}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                    Practice
                  </Badge>
                </div>

                <p className="text-xs text-deep-brown/70 leading-relaxed font-sans">
                  {entry.gestureDescription}
                </p>
              </div>
            ))}
          </div>

          {/* ISL vs ASL Education Note */}
          <div className="p-3 bg-warm-sand/40 rounded-xl border border-warm-sand text-[11px] text-deep-brown/70 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-peacock-teal flex-shrink-0" />
            <span>
              <strong>Did you know?</strong> Indian Sign Language uses two-handed alphabets and distinctive regional syntax, unlike American Sign Language (ASL).
            </span>
          </div>

        </div>
      )}
    </div>
  );
}

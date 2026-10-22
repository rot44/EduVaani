import { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../lib/speech';
import { ChevronDown } from 'lucide-react';

interface Props {
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
        type="button"
        aria-label={`Select native language. Current: ${current?.name || 'English'}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 bg-cream-white/90 border border-warm-sand rounded-full px-3.5 py-2 text-sm text-deep-brown hover:border-terracotta transition-all duration-300 min-h-[44px] min-w-[44px] cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-terracotta"
      >
        <span aria-hidden="true">{current?.flag}</span>
        <span className="hidden sm:inline font-bold font-display">{current?.nativeName}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-deep-brown/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Available native languages"
          className="absolute right-0 top-full mt-2 w-56 bg-cream-white border border-warm-sand rounded-2xl overflow-hidden shadow-warm-lg z-50 animate-slide-up"
        >
          <div className="p-2.5 border-b border-warm-sand bg-warm-ivory/60">
            <p className="text-[11px] font-bold text-deep-brown/70 uppercase tracking-wider px-2 font-display">
              AI Response Language
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={lang.code === currentLanguage}
                onClick={() => { onLanguageChange(lang.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-warm-sand/40 transition-colors duration-150 min-h-[44px] cursor-pointer ${
                  lang.code === currentLanguage ? 'bg-terracotta/10 text-terracotta font-bold' : 'text-deep-brown font-medium'
                }`}
              >
                <span className="text-lg" aria-hidden="true">{lang.flag}</span>
                <div className="flex-1">
                  <div className="text-xs font-bold font-display">{lang.nativeName}</div>
                  <div className="text-[10px] text-deep-brown/60">{lang.name}</div>
                </div>
                {lang.code === currentLanguage && (
                  <div className="w-2 h-2 bg-terracotta rounded-full" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

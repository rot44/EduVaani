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
        className="flex items-center gap-2 glass border border-white/20 rounded-full px-3 py-2 text-sm text-white hover:border-orange-400/50 transition-all duration-300"
      >
        <span>{current?.flag}</span>
        <span className="hidden sm:inline">{current?.nativeName}</span>
        <ChevronDown className={`h-3 w-3 text-white/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 glass border border-white/20 rounded-2xl overflow-hidden shadow-2xl z-50">
          <div className="p-2 border-b border-white/10">
            <p className="text-xs text-white/50 px-2">AI Response Language</p>
          </div>
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { onLanguageChange(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 ${
                lang.code === currentLanguage ? 'bg-orange-500/20 text-orange-300' : 'text-white/80'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div>
                <div className="text-sm font-medium">{lang.nativeName}</div>
                <div className="text-xs text-white/40">{lang.name}</div>
              </div>
              {lang.code === currentLanguage && (
                <div className="ml-auto w-2 h-2 bg-orange-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

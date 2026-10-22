import { Link } from 'react-router-dom';
import { Mic, Heart, Globe, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { SUPPORTED_LANGUAGES } from '../lib/speech';

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function TwitterXIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-warm-sand bg-warm-sand/35 text-deep-brown mt-auto pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Multi-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-warm-sand">
          
          {/* Column 1: Brand & About (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-terracotta to-turmeric flex items-center justify-center text-cream-white shadow-warm-sm group-hover:scale-105 transition-transform">
                <Mic className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold font-display text-deep-brown block">
                  EduVaani <span className="text-sm font-semibold text-terracotta font-sans">(एजुवाणी)</span>
                </span>
                <span className="text-xs text-deep-brown/65 block -mt-0.5">आपकी आवाज़, आपकी पहचान</span>
              </div>
            </Link>

            <p className="text-sm text-deep-brown/75 leading-relaxed font-sans max-w-sm">
              India&apos;s culturally grounded AI English voice tutor. Practice speaking fearlessly in authentic Indian scenarios with instant translations and pronunciation coaching.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-peacock-teal">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Powered by Gemini & Sarvam AI</span>
            </div>
          </div>

          {/* Column 2: Product Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-deep-brown">
              Product & Practice
            </h4>
            <ul className="space-y-2 text-sm text-deep-brown/75 font-sans">
              <li>
                <Link to="/" className="hover:text-terracotta transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-terracotta transition-colors">
                  Voice Dashboard
                </Link>
              </li>
              <li>
                <Link to="/sign-tutor" className="hover:text-terracotta transition-colors flex items-center gap-1.5">
                  <span>Sign Language</span>
                  <span className="text-xs">🤟</span>
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-terracotta transition-colors">
                  Learning Analytics
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-terracotta transition-colors">
                  Student Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: 8 Indian Languages (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-deep-brown flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-peacock-teal" />
              8 Languages
            </h4>
            <p className="text-xs text-deep-brown/65">
              Bilingual translations & audio voice support:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <Badge
                  key={lang.code}
                  variant="outline"
                  className="text-[11px] py-0.5 px-2 bg-cream-white/70 hover:border-terracotta/40 transition-colors"
                >
                  <span className="font-semibold">{lang.nativeName}</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Column 4: Connect & Community (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-deep-brown">
              Connect
            </h4>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com/rot44/EduVaani"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-warm-sand bg-cream-white hover:bg-warm-ivory flex items-center justify-center text-deep-brown hover:text-terracotta transition-colors shadow-warm-sm"
                title="GitHub"
                aria-label="GitHub Repository"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-warm-sand bg-cream-white hover:bg-warm-ivory flex items-center justify-center text-deep-brown hover:text-terracotta transition-colors shadow-warm-sm"
                title="Twitter / X"
                aria-label="Twitter profile"
              >
                <TwitterXIcon className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-deep-brown/60 pt-2 leading-relaxed">
              Open source & privacy-first. Stored securely on your device.
            </p>
          </div>

        </div>

        {/* Bottom Credits & Taglines */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-deep-brown/70 font-medium">
          <p className="flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 text-terracotta fill-terracotta" /> for India&apos;s learners across Bharat
          </p>
          <div className="flex items-center gap-4">
            <span>🇮🇳 Bharat First</span>
            <span>•</span>
            <span>Powered by Gemini & Sarvam AI</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} EduVaani</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

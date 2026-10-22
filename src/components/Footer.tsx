import { Link } from 'react-router-dom';
import { Mic, Heart, Github, Twitter, Globe, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { SUPPORTED_LANGUAGES } from '../lib/speech';

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
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-warm-sand bg-cream-white hover:bg-warm-ivory flex items-center justify-center text-deep-brown hover:text-terracotta transition-colors shadow-warm-sm"
                title="Twitter / X"
                aria-label="Twitter profile"
              >
                <Twitter className="h-4 w-4" />
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

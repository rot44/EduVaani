import { PhoneCall, MessageSquare, Mic, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { LanguageSelector } from '../LanguageSelector';

export interface TutorHeaderProps {
  sessionTitle: string;
  messageCount: number;
  viewMode: 'call' | 'transcript';
  onViewModeChange: (mode: 'call' | 'transcript') => void;
  voiceEngine: 'sarvam' | 'browser';
  onToggleVoiceEngine: () => void;
  isSarvamConfigured: boolean;
  onMicCheck: () => void;
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
  onFinishSession: () => void;
  isSignMode?: boolean;
  onToggleSignMode?: () => void;
}

export function TutorHeader({
  sessionTitle,
  messageCount,
  viewMode,
  onViewModeChange,
  voiceEngine,
  onToggleVoiceEngine,
  isSarvamConfigured,
  onMicCheck,
  selectedLanguage,
  onLanguageChange,
  onFinishSession,
  isSignMode = false,
  onToggleSignMode,
}: TutorHeaderProps) {
  return (
    <header className="relative z-20 bg-warm-ivory/95 border-b border-warm-sand px-4 sm:px-6 py-3 backdrop-blur-xl shadow-warm-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        
        {/* Title, Message Count & Status */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-deep-brown font-display flex items-center gap-2">
              {sessionTitle}
            </h2>
            <Badge variant="turmeric" className="text-[10px] hidden sm:inline-flex font-bold">
              Live AI
            </Badge>
            <span className="text-[11px] font-semibold text-peacock-teal bg-peacock-teal/10 px-2 py-0.5 rounded-full">
              {messageCount} {messageCount === 1 ? 'message' : 'messages'}
            </span>
          </div>
          <p className="text-xs text-deep-brown/65 mt-0.5">
            EduVaani • Spoken English Practice
          </p>
        </div>

        {/* Center Mode Switch (Voice Call vs Chat & Notes) */}
        <div className="bg-warm-sand/50 border border-warm-sand rounded-full p-0.5 flex items-center shadow-inner">
          <button
            type="button"
            onClick={() => onViewModeChange('call')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'call'
                ? 'bg-terracotta text-cream-white shadow-warm-sm font-bold'
                : 'text-deep-brown/70 hover:text-deep-brown'
            }`}
          >
            <PhoneCall className="h-3 w-3" />
            <span>Voice Call</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('transcript')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'transcript'
                ? 'bg-terracotta text-cream-white shadow-warm-sm font-bold'
                : 'text-deep-brown/70 hover:text-deep-brown'
            }`}
          >
            <MessageSquare className="h-3 w-3" />
            <span>Chat &amp; Notes</span>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sarvam AI Voice Toggle */}
          {isSarvamConfigured && (
            <button
              type="button"
              onClick={onToggleVoiceEngine}
              className={`border rounded-full px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                voiceEngine === 'sarvam'
                  ? 'border-terracotta/40 bg-terracotta/15 text-terracotta'
                  : 'border-warm-sand bg-cream-white text-deep-brown/75 hover:bg-warm-sand/40'
              }`}
              title="Toggle between Sarvam Bulbul and Browser Web Speech TTS"
            >
              {voiceEngine === 'sarvam' ? '🇮🇳 Bulbul Voice' : '🌐 Browser TTS'}
            </button>
          )}

          {/* ISL Sign Mode Toggle */}
          {onToggleSignMode && (
            <button
              type="button"
              onClick={onToggleSignMode}
              className={`border rounded-full px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-1 ${
                isSignMode
                  ? 'border-peacock-teal/50 bg-peacock-teal/20 text-peacock-teal font-bold'
                  : 'border-warm-sand bg-cream-white text-deep-brown/75 hover:bg-warm-sand/40'
              }`}
              title="Toggle Indian Sign Language (ISL) visualizer for AI tutor speech"
            >
              <span>🤟</span>
              <span className="hidden sm:inline">ISL Mode</span>
            </button>
          )}

          {/* Mic Diagnostic */}
          <button
            type="button"
            onClick={onMicCheck}
            className="border border-peacock-teal/30 bg-peacock-teal/10 hover:bg-peacock-teal/20 text-peacock-teal rounded-full px-2.5 py-1 text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm font-medium"
            title="Test microphone volume & diagnostics"
          >
            <Mic className="h-3 w-3 text-peacock-teal" />
            <span className="hidden sm:inline">Mic Check</span>
          </button>

          {/* Language selector */}
          <LanguageSelector
            currentLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />

          {/* Finish & Return button */}
          <button
            type="button"
            onClick={onFinishSession}
            className="border border-warm-sand bg-cream-white hover:border-soft-coral hover:bg-soft-coral/10 text-deep-brown/70 hover:text-soft-coral rounded-full p-1.5 transition-colors cursor-pointer shadow-sm"
            title="Finish session & return"
            aria-label="Finish session"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

      </div>
    </header>
  );
}

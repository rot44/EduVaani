import { Mic, X, Volume2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { LanguageSelector } from '../LanguageSelector';
import type { InputMode, OutputMode } from '../../lib/multimodal';

export interface TutorHeaderProps {
  sessionTitle: string;
  messageCount: number;
  inputMode: InputMode;
  onInputModeChange: (mode: InputMode) => void;
  outputMode: OutputMode;
  onOutputModeChange: (mode: OutputMode) => void;
  voiceEngine: 'sarvam' | 'browser';
  onToggleVoiceEngine: () => void;
  isSarvamConfigured: boolean;
  onMicCheck: () => void;
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
  onFinishSession: () => void;
}

export function TutorHeader({
  sessionTitle,
  messageCount,
  inputMode,
  onInputModeChange,
  outputMode,
  onOutputModeChange,
  voiceEngine,
  onToggleVoiceEngine,
  isSarvamConfigured,
  onMicCheck,
  selectedLanguage,
  onLanguageChange,
  onFinishSession,
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
              Multimodal AI
            </Badge>
            <span className="text-[11px] font-semibold text-peacock-teal bg-peacock-teal/10 px-2 py-0.5 rounded-full">
              {messageCount} {messageCount === 1 ? 'message' : 'messages'}
            </span>
          </div>
          <p className="text-xs text-deep-brown/65 mt-0.5">
            EduVaani • Voice, Text &amp; Sign Practice
          </p>
        </div>

        {/* Center Mode Switcher: Voice | Text | Sign */}
        <div className="bg-warm-sand/50 border border-warm-sand rounded-full p-1 flex items-center shadow-inner gap-1">
          <button
            type="button"
            onClick={() => onInputModeChange('voice')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              inputMode === 'voice'
                ? 'bg-terracotta text-cream-white shadow-warm-sm font-bold scale-102'
                : 'text-deep-brown/70 hover:text-deep-brown hover:bg-warm-sand/40'
            }`}
            title="Voice input via microphone & interactive orb"
          >
            <span>🎙️</span>
            <span>Voice</span>
          </button>
          
          <button
            type="button"
            onClick={() => onInputModeChange('text')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              inputMode === 'text'
                ? 'bg-terracotta text-cream-white shadow-warm-sm font-bold scale-102'
                : 'text-deep-brown/70 hover:text-deep-brown hover:bg-warm-sand/40'
            }`}
            title="Text input & transcript chat"
          >
            <span>💬</span>
            <span>Text</span>
          </button>

          <button
            type="button"
            onClick={() => onInputModeChange('sign')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              inputMode === 'sign'
                ? 'bg-terracotta text-cream-white shadow-warm-sm font-bold scale-102'
                : 'text-deep-brown/70 hover:text-deep-brown hover:bg-warm-sand/40'
            }`}
            title="Sign language input via camera gesture detection"
          >
            <span>🤟</span>
            <span>Sign</span>
          </button>
        </div>

        {/* Right Action Controls: Output Mode Selector, Voice Engine, Mic Check, Finish */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Output Mode Switcher Pill */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-full bg-cream-white border border-warm-sand text-[11px] shadow-xs">
            <span className="text-deep-brown/50 font-medium flex items-center gap-1 pl-1">
              <Volume2 className="h-3 w-3" /> Output:
            </span>
            {(['all', 'voice', 'sign', 'text'] as OutputMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onOutputModeChange(mode)}
                className={`px-2 py-0.5 rounded-full capitalize font-semibold transition-colors cursor-pointer ${
                  outputMode === mode
                    ? 'bg-peacock-teal text-cream-white shadow-xs'
                    : 'text-deep-brown/70 hover:text-deep-brown'
                }`}
                title={`Deliver tutor responses as ${mode}`}
              >
                {mode === 'all' ? '✨ All' : mode}
              </button>
            ))}
          </div>

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

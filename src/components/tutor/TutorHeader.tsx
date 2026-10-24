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
    <header className="relative z-20 bg-warm-ivory/95 border-b border-warm-sand px-4 sm:px-6 py-3 backdrop-blur-xl shadow-warm-sm flex-shrink-0">
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
            role="tab"
            aria-selected={inputMode === 'voice'}
            aria-label="Switch input mode to Voice"
            onClick={() => onInputModeChange('voice')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px] ${
              inputMode === 'voice'
                ? 'bg-terracotta text-cream-white shadow-warm-sm font-bold scale-102'
                : 'text-deep-brown/75 hover:text-deep-brown hover:bg-warm-sand/40'
            }`}
            title="Voice input via microphone & interactive orb"
          >
            <span aria-hidden="true">🎙️</span>
            <span>Voice</span>
          </button>
          
          <button
            type="button"
            role="tab"
            aria-selected={inputMode === 'text'}
            aria-label="Switch input mode to Text"
            onClick={() => onInputModeChange('text')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px] ${
              inputMode === 'text'
                ? 'bg-terracotta text-cream-white shadow-warm-sm font-bold scale-102'
                : 'text-deep-brown/75 hover:text-deep-brown hover:bg-warm-sand/40'
            }`}
            title="Text input & transcript chat"
          >
            <span aria-hidden="true">💬</span>
            <span>Text</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={inputMode === 'sign'}
            aria-label="Switch input mode to Indian Sign Language"
            onClick={() => onInputModeChange('sign')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px] ${
              inputMode === 'sign'
                ? 'bg-terracotta text-cream-white shadow-warm-sm font-bold scale-102'
                : 'text-deep-brown/75 hover:text-deep-brown hover:bg-warm-sand/40'
            }`}
            title="Sign language input via camera gesture detection"
          >
            <span aria-hidden="true">🤟</span>
            <span>Sign</span>
          </button>
        </div>

        {/* Right Action Controls: Output Mode Selector, Voice Engine, Mic Check, Finish */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Output Mode Switcher Pill */}
          <div
            role="group"
            aria-label="Tutor response output mode"
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream-white border border-warm-sand text-[11px] shadow-xs min-h-[44px]"
          >
            <span className="text-deep-brown/65 font-medium flex items-center gap-1 pl-1">
              <Volume2 className="h-3 w-3" aria-hidden="true" /> Output:
            </span>
            {(['all', 'voice', 'sign', 'text'] as OutputMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={outputMode === mode}
                aria-label={`Deliver responses as ${mode}`}
                onClick={() => onOutputModeChange(mode)}
                className={`px-2.5 py-1 rounded-full capitalize font-semibold transition-colors cursor-pointer text-xs ${
                  outputMode === mode
                    ? 'bg-peacock-teal text-cream-white shadow-xs'
                    : 'text-deep-brown/75 hover:text-deep-brown'
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
              aria-label={`Switch voice engine. Currently: ${voiceEngine === 'sarvam' ? 'Sarvam Bulbul' : 'Browser TTS'}`}
              className={`border rounded-full px-3 py-2 text-xs font-semibold transition-all cursor-pointer shadow-sm min-h-[44px] ${
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
            aria-label="Run microphone diagnostic check"
            className="border border-peacock-teal/30 bg-peacock-teal/10 hover:bg-peacock-teal/20 text-peacock-teal rounded-full px-3 py-2 text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm font-semibold min-h-[44px]"
            title="Test microphone volume & diagnostics"
          >
            <Mic className="h-3.5 w-3.5 text-peacock-teal" aria-hidden="true" />
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
            className="border border-warm-sand bg-cream-white hover:border-soft-coral hover:bg-soft-coral/10 text-deep-brown/75 hover:text-soft-coral rounded-full p-2.5 transition-colors cursor-pointer shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-soft-coral"
            title="Finish session & return to dashboard"
            aria-label="Finish session and return to dashboard"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

      </div>
    </header>
  );
}

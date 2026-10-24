import React from 'react';
import { Gauge, Mic, MessageSquare, Check, Send, PartyPopper } from 'lucide-react';
import type { TutorStatus } from './VaaniOrb';
import type { RoleplayScenario } from '../../lib/ai';
import { Button } from '../ui/button';

export interface ControlDockProps {
  status: TutorStatus;
  speechRate: number;
  onToggleSpeechSpeed: () => void;
  micLanguage: string;
  onToggleMicLanguage: () => void;
  showInputDrawer: boolean;
  onToggleInputDrawer: () => void;
  textInput: string;
  onTextInputChange: (val: string) => void;
  onTextSubmit: (e: React.FormEvent) => void;
  onMicButtonClick: () => void;
  onStopAll: () => void;
  onFinishSession: () => void;
  activeScenario?: RoleplayScenario | null;
  onSelectSuggestedPhrase?: (phrase: string) => void;
}

export function ControlDock({
  status,
  speechRate,
  onToggleSpeechSpeed,
  micLanguage,
  onToggleMicLanguage,
  showInputDrawer,
  onToggleInputDrawer,
  textInput,
  onTextInputChange,
  onTextSubmit,
  onMicButtonClick,
  onStopAll,
  onFinishSession,
  activeScenario,
  onSelectSuggestedPhrase,
}: ControlDockProps) {
  return (
    <footer className="relative z-30 px-4 pb-4 pt-1 flex-shrink-0">
      <div className="max-w-xl mx-auto space-y-2.5">
        
        {/* Quick Suggested Scenarios Phrases */}
        {activeScenario && activeScenario.suggestedPhrases && onSelectSuggestedPhrase && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin px-1">
            <span className="text-[11px] text-terracotta font-bold flex-shrink-0">
              Quick reply:
            </span>
            {activeScenario.suggestedPhrases.slice(0, 3).map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSuggestedPhrase(phrase)}
                disabled={status === 'processing' || status === 'speaking'}
                className="flex-shrink-0 text-[11px] font-medium bg-cream-white border border-warm-sand hover:border-terracotta text-deep-brown px-3 py-1 rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow-warm-sm"
              >
                &quot;{phrase}&quot;
              </button>
            ))}
          </div>
        )}

        {/* Slide-out Text Input Drawer */}
        {showInputDrawer && (
          <form onSubmit={onTextSubmit} className="flex items-center gap-2 animate-slide-up">
            <input
              id="chat-text-input"
              aria-label="Type your message in English"
              type="text"
              value={textInput}
              onChange={(e) => onTextInputChange(e.target.value)}
              placeholder="Type your message in English..."
              disabled={status === 'processing' || status === 'speaking'}
              className="flex-grow bg-cream-white border border-warm-sand focus:border-terracotta rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-deep-brown placeholder-deep-brown/40 focus:outline-none transition-colors shadow-warm-sm font-sans"
              autoFocus
            />
            <Button
              type="submit"
              disabled={!textInput.trim() || status === 'processing' || status === 'speaking'}
              size="sm"
              variant="primary"
              className="rounded-2xl text-xs h-10 px-4 shadow-warm-sm"
            >
              <Send className="h-3.5 w-3.5 mr-1" />
              Send
            </Button>
          </form>
        )}

        {/* Main Floating Control Pill: warm ivory with warm sand border */}
        <div className="bg-warm-ivory/95 border border-warm-sand rounded-full p-2 flex items-center justify-between shadow-warm-lg backdrop-blur-2xl">
          
          {/* Speech Speed Toggle */}
          <button
            type="button"
            onClick={onToggleSpeechSpeed}
            title="Toggle speech pace"
            aria-label={`Speech rate: ${speechRate === 0.85 ? '0.85x slower pace' : '1.0x normal pace'}. Tap to switch`}
            className="border border-warm-sand bg-cream-white hover:bg-warm-sand/50 text-deep-brown rounded-full px-3 py-2 text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm font-semibold min-h-[44px]"
          >
            <Gauge className="h-3.5 w-3.5 text-terracotta" aria-hidden="true" />
            <span>{speechRate === 0.85 ? '0.85x' : '1.0x'}</span>
          </button>

          {/* Mic Speech Recognition Language Toggle (en-IN vs hi-IN) */}
          <button
            type="button"
            onClick={onToggleMicLanguage}
            title="Toggle speech input language (English Indian accent or Hindi)"
            aria-label={`Speech recognition language: ${micLanguage === 'en-IN' ? 'Indian English' : 'Hindi'}. Tap to switch`}
            className="border border-warm-sand bg-cream-white hover:bg-warm-sand/50 text-deep-brown rounded-full px-3 py-2 text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm font-semibold min-h-[44px]"
          >
            <Mic className="h-3.5 w-3.5 text-peacock-teal" aria-hidden="true" />
            <span>{micLanguage === 'en-IN' ? 'EN' : 'हिंदी'}</span>
          </button>

          {/* Keyboard Drawer Toggle */}
          <button
            type="button"
            onClick={onToggleInputDrawer}
            aria-label={showInputDrawer ? 'Hide text input field' : 'Show text input field'}
            aria-expanded={showInputDrawer}
            className={`rounded-full px-3 py-2 text-xs flex items-center gap-1.5 transition-all cursor-pointer font-medium min-h-[44px] ${
              showInputDrawer
                ? 'bg-terracotta/15 text-terracotta border border-terracotta/40 font-bold'
                : 'text-deep-brown/75 hover:text-deep-brown hover:bg-warm-sand/50'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{showInputDrawer ? 'Hide Text' : 'Type'}</span>
          </button>

          {/* Main Microphone Action Button */}
          <button
            type="button"
            onClick={onMicButtonClick}
            disabled={status === 'processing'}
            aria-label={
              status === 'listening'
                ? 'Finish speaking and submit message'
                : status === 'speaking'
                ? 'Interrupt tutor and start speaking'
                : 'Start speaking into microphone'
            }
            aria-pressed={status === 'listening'}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-cream-white shadow-warm-md transition-all cursor-pointer min-h-[44px] min-w-[44px] ${
              status === 'listening'
                ? 'bg-soft-coral animate-pulse scale-105 shadow-soft-coral/50'
                : status === 'speaking'
                ? 'bg-peacock-teal hover:bg-peacock-teal-hover scale-100 shadow-teal'
                : 'bg-terracotta hover:bg-terracotta-hover active:scale-95 shadow-terracotta'
            }`}
            title={
              status === 'listening'
                ? 'Tap to send what you said'
                : status === 'speaking'
                ? 'Tap to speak now'
                : 'Speak into microphone'
            }
          >
            {status === 'listening' ? (
              <Check className="h-6 w-6 stroke-[3]" aria-hidden="true" />
            ) : (
              <Mic className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {/* Stop Audio Button */}
          <button
            type="button"
            onClick={onStopAll}
            title="Stop listening or speaking"
            aria-label="Stop audio and reset tutor to idle"
            className="text-deep-brown/75 hover:text-deep-brown px-3 py-2 text-xs cursor-pointer transition-colors font-semibold min-h-[44px] flex items-center justify-center"
          >
            <span aria-hidden="true" className="mr-1">⏹</span> Stop
          </button>

          {/* Finish Session Button */}
          <Button
            type="button"
            onClick={onFinishSession}
            variant="outline"
            size="sm"
            aria-label="Finish practice session and save transcript"
            className="text-xs border-terracotta/40 text-terracotta hover:bg-terracotta/10 rounded-full min-h-[44px] px-3.5 font-bold"
          >
            <PartyPopper className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            Finish
          </Button>

        </div>
      </div>
    </footer>
  );
}

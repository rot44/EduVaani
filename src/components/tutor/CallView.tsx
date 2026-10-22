import { Bot, Volume2, Languages } from 'lucide-react';
import type { ChatMessage } from '../../lib/ai';
import { VaaniOrb, type TutorStatus } from './VaaniOrb';
import { CoachingCard } from './CoachingCard';

export interface CallViewProps {
  status: TutorStatus;
  micLanguage: string;
  interimSpeech: string;
  lastUserMsg?: ChatMessage;
  lastAssistantMsg?: ChatMessage;
  onMicButtonClick: () => void;
  onReplay: (text: string, index: number) => void;
  currentlyPlayingIndex: number | null;
  onPracticeText: (text: string) => void;
}

export function CallView({
  status,
  micLanguage,
  interimSpeech,
  lastUserMsg,
  lastAssistantMsg,
  onMicButtonClick,
  onReplay,
  currentlyPlayingIndex,
  onPracticeText,
}: CallViewProps) {
  return (
    <div className="flex-grow flex flex-col justify-between items-center py-4">
      
      {/* Student's latest speech prompt bubble / Live Interim Speech */}
      <div className="w-full max-w-lg min-h-[50px] flex items-center justify-center text-center">
        {status === 'listening' ? (
          <div className="bg-soft-coral/10 border border-soft-coral/40 rounded-2xl px-5 py-2.5 text-xs sm:text-sm text-soft-coral shadow-warm-sm animate-pulse flex flex-col items-center gap-1 font-sans">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-soft-coral animate-ping" />
              <span className="font-bold text-soft-coral">
                Listening ({micLanguage === 'en-IN' ? 'English (India)' : 'Hindi'}):
              </span>
            </div>
            <span className="italic text-deep-brown font-medium">
              {interimSpeech
                ? `"${interimSpeech}"`
                : 'Listening to you... Speak freely! (Tap orb or wait when done)'}
            </span>
          </div>
        ) : lastUserMsg ? (
          <div className="bg-cream-white border border-warm-sand rounded-2xl px-5 py-2.5 text-xs sm:text-sm text-deep-brown shadow-warm-sm animate-slide-up">
            <span className="text-terracotta font-bold mr-1.5">You:</span>
            <span className="italic">&quot;{lastUserMsg.content}&quot;</span>
          </div>
        ) : (
          <p className="text-xs text-deep-brown/50">
            Tap the orb below or press the microphone to start speaking.
          </p>
        )}
      </div>

      {/* Central Animated Breathing Orb */}
      <div className="my-auto py-4">
        <VaaniOrb
          status={status}
          onClick={onMicButtonClick}
          disabled={status === 'processing'}
        />
      </div>

      {/* Tutor's Response Subtitle Card with Live AI Coaching */}
      <div className="w-full max-w-xl space-y-3">
        {lastAssistantMsg ? (
          <div className="bg-warm-ivory border border-warm-sand rounded-3xl p-5 shadow-warm backdrop-blur-xl animate-slide-up space-y-3">
            
            {/* Header: EduVaani Bot & Replay */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-terracotta to-turmeric flex items-center justify-center text-cream-white shadow-warm-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-deep-brown font-display">EduVaani</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  onReplay(lastAssistantMsg.translatedContent || lastAssistantMsg.content, -99)
                }
                className="text-xs text-terracotta hover:text-terracotta-hover flex items-center gap-1 cursor-pointer transition-colors font-semibold"
                title="Replay pronunciation"
              >
                <Volume2
                  className={`h-3.5 w-3.5 ${
                    currentlyPlayingIndex === -99 ? 'animate-bounce text-peacock-teal' : ''
                  }`}
                />
                <span>Listen</span>
              </button>
            </div>

            {/* Main Subtitle */}
            <p className="text-sm sm:text-base text-deep-brown leading-relaxed font-medium">
              &quot;{lastAssistantMsg.content}&quot;
            </p>

            {/* Vernacular Translation */}
            {lastAssistantMsg.translatedContent &&
              lastAssistantMsg.translatedContent !== lastAssistantMsg.content && (
                <div className="text-xs text-peacock-teal pt-2 border-t border-warm-sand flex items-start gap-1.5 font-medium">
                  <Languages className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <span>{lastAssistantMsg.translatedContent}</span>
                </div>
              )}

            {/* Expandable Coach Tip Card */}
            {lastAssistantMsg.coachingTip && (
              <CoachingCard
                coachingTip={lastAssistantMsg.coachingTip}
                onReplayImproved={() =>
                  onReplay(lastAssistantMsg.coachingTip!.improved, -98)
                }
                onPracticeImproved={() =>
                  onPracticeText(lastAssistantMsg.coachingTip!.improved)
                }
                isCollapsible={true}
                defaultExpanded={true}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-deep-brown/50">
            EduVaani will guide and gently coach your pronunciation after each sentence.
          </div>
        )}
      </div>

    </div>
  );
}

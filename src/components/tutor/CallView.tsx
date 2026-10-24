import { useState } from 'react';
import { Bot, Volume2, Languages, Send, AlertCircle } from 'lucide-react';
import { VaaniOrb, type TutorStatus } from './VaaniOrb';
import { CoachingCard } from './CoachingCard';
import { CameraPanel } from '../sign/CameraPanel';
import { SignGenerationOutput } from '../sign/SignGenerationOutput';
import type { UnifiedMessage, InputMode, OutputMode } from '../../lib/multimodal';
import type { RecognitionResult } from '../../lib/signLanguage';
import { textToSignSequence, type SignGenerationResult } from '../../lib/signGeneration';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export interface CallViewProps {
  status: TutorStatus;
  inputMode: InputMode;
  outputMode: OutputMode;
  micLanguage: string;
  interimSpeech: string;
  lastUserMsg?: UnifiedMessage;
  lastAssistantMsg?: UnifiedMessage;
  onMicButtonClick: () => void;
  onReplay: (text: string, index: number) => void;
  currentlyPlayingIndex: number | null;
  onPracticeText: (text: string) => void;
  // Sign Mode Props
  isCameraActive: boolean;
  onCameraToggle: (active: boolean) => void;
  onSendSignMessage: (signText: string) => void;
  onSwitchInputMode: (mode: InputMode) => void;
  voiceError?: string | null;
}

export function CallView({
  status,
  inputMode,
  outputMode,
  micLanguage,
  interimSpeech,
  lastUserMsg,
  lastAssistantMsg,
  onMicButtonClick,
  onReplay,
  currentlyPlayingIndex,
  onPracticeText,
  isCameraActive,
  onCameraToggle,
  onSendSignMessage,
  onSwitchInputMode,
  voiceError,
}: CallViewProps) {
  // Sign Camera detection state inside CallView
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [detectedConfidence, setDetectedConfidence] = useState<number>(0);
  const [hindiMeaning, setHindiMeaning] = useState<string | null>(null);

  // Playback state for sign output
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlayingSign, setIsPlayingSign] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const handleRecognition = (res: RecognitionResult) => {
    if (res.status === 'detected' && res.sign) {
      setDetectedSign(res.sign);
      setDetectedConfidence(res.confidence);
      setHindiMeaning(res.hindiMeaning);
    } else if (res.status === 'no_hand') {
      setDetectedSign(null);
      setDetectedConfidence(0);
      setHindiMeaning(null);
    }
  };

  const handleSendDetected = () => {
    if (detectedSign) {
      onSendSignMessage(detectedSign);
      setDetectedSign(null);
    }
  };

  // Convert assistant signSequence to SignGenerationResult format for SignGenerationOutput
  const assistantSignResult: SignGenerationResult | null = lastAssistantMsg?.content
    ? textToSignSequence(lastAssistantMsg.content)
    : null;

  const shouldShowSignOutput =
    (outputMode === 'sign' || outputMode === 'all') &&
    Boolean(assistantSignResult && assistantSignResult.sequence.length > 0);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin flex flex-col justify-between items-center py-2 sm:py-4 space-y-4 w-full">
      
      {/* Student's latest speech prompt bubble / Live Interim Speech / Input Fallback */}
      <div className="w-full max-w-lg min-h-[46px] flex flex-col items-center justify-center text-center px-2">
        {voiceError ? (
          /* Voice Recognition Failure Fallback */
          <div className="w-full bg-soft-coral/10 border border-soft-coral/40 rounded-2xl p-3 text-xs text-deep-brown shadow-warm-sm animate-slide-up flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-soft-coral font-medium">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>Voice unclear. Try typing or sign language:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSwitchInputMode('text')}
                className="px-2.5 py-1 rounded-xl bg-cream-white border border-warm-sand hover:border-terracotta text-xs font-semibold text-deep-brown hover:text-terracotta transition-colors shadow-xs cursor-pointer"
              >
                💬 Type text
              </button>
              <button
                type="button"
                onClick={() => onSwitchInputMode('sign')}
                className="px-2.5 py-1 rounded-xl bg-terracotta text-cream-white text-xs font-semibold hover:bg-terracotta-hover transition-colors shadow-xs cursor-pointer"
              >
                🤟 Use Sign
              </button>
            </div>
          </div>
        ) : status === 'listening' ? (
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
          <div className="bg-cream-white border border-warm-sand rounded-2xl px-5 py-2 text-xs sm:text-sm text-deep-brown shadow-warm-sm animate-slide-up flex items-center gap-2">
            <Badge variant={lastUserMsg.source === 'sign' ? 'teal' : 'sand'} className="text-[10px]">
              {lastUserMsg.source === 'sign' ? '🤟 Signed' : lastUserMsg.source === 'text' ? '💬 Typed' : '🎙️ Spoken'}
            </Badge>
            <span className="text-terracotta font-bold">You:</span>
            <span className="italic">&quot;{lastUserMsg.content}&quot;</span>
          </div>
        ) : (
          <p className="text-xs text-deep-brown/50">
            {inputMode === 'sign'
              ? 'Turn on camera below to sign your sentence in Indian Sign Language.'
              : 'Tap the orb below or press microphone to start speaking.'}
          </p>
        )}
      </div>

      {/* Central Visual Stage: CameraPanel when in Sign mode, or VaaniOrb when in Voice mode */}
      <div className="w-full my-auto py-2 flex flex-col items-center">
        {inputMode === 'sign' ? (
          /* Inline CameraPanel when "Sign" mode is selected */
          <div className="w-full max-w-lg space-y-3 animate-slide-up">
            <CameraPanel
              isCameraActive={isCameraActive}
              onCameraToggle={onCameraToggle}
              onLearnWithoutCamera={() => onSwitchInputMode('text')}
              onRecognitionResult={handleRecognition}
            />

            {/* Detected Sign Action Ribbon in CallView */}
            {detectedSign && (
              <div className="p-3 bg-cream-white border border-warm-sand rounded-2xl shadow-warm-sm flex items-center justify-between gap-3 animate-slide-up">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤟</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-deep-brown font-display">{detectedSign}</span>
                      {hindiMeaning && <span className="text-xs text-terracotta">({hindiMeaning})</span>}
                      <span className="text-[10px] text-peacock-teal font-mono">
                        {Math.round(detectedConfidence * 100)}%
                      </span>
                    </div>
                    <span className="text-[11px] text-deep-brown/60">Ready to send to conversation</span>
                  </div>
                </div>

                <Button
                  onClick={handleSendDetected}
                  variant="primary"
                  size="sm"
                  className="shadow-warm-sm h-8 px-3 text-xs"
                >
                  <Send className="h-3.5 w-3.5 mr-1" />
                  Send
                </Button>
              </div>
            )}

            {/* Low-confidence Fallback: "Did you mean: [X]?" */}
            {isCameraActive && detectedConfidence > 0 && detectedConfidence < 0.75 && (
              <div className="p-3 bg-turmeric/15 border border-turmeric/40 rounded-2xl space-y-1.5 animate-slide-up text-xs">
                <div className="flex items-center justify-between text-deep-brown font-semibold">
                  <span>🤔 Low confidence — Did you mean?</span>
                  <span className="text-[10px] text-deep-brown/60">Tap to send</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Namaste', 'Hello', 'Thank you', 'Good', 'Help', 'Yes', 'No'].map((alt) => (
                    <button
                      key={alt}
                      type="button"
                      onClick={() => onSendSignMessage(alt)}
                      className="px-2.5 py-1 rounded-xl bg-cream-white border border-warm-sand hover:border-terracotta text-xs font-semibold text-deep-brown hover:text-terracotta transition-colors shadow-xs cursor-pointer"
                    >
                      {alt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Central Animated Breathing Orb for Voice mode */
          <div className="py-2">
            <VaaniOrb
              status={status}
              onClick={onMicButtonClick}
              disabled={status === 'processing'}
            />
          </div>
        )}
      </div>

      {/* Tutor's Response Subtitle Card with Live AI Coaching and ISL Sign Visualizer */}
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
                <Badge variant="turmeric" className="text-[10px]">
                  {outputMode === 'all' ? 'Voice + Text + Sign' : outputMode}
                </Badge>
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

            {/* ISL Sign Output Animation (when Output includes Sign) */}
            {shouldShowSignOutput && assistantSignResult && (
              <div className="pt-2 border-t border-warm-sand">
                <SignGenerationOutput
                  signResult={assistantSignResult}
                  currentStepIndex={currentStepIndex}
                  isPlaying={isPlayingSign}
                  playbackSpeed={playbackSpeed}
                  onPlay={() => setIsPlayingSign(true)}
                  onPause={() => setIsPlayingSign(false)}
                  onReplay={() => {
                    setCurrentStepIndex(0);
                    setIsPlayingSign(true);
                  }}
                  onSpeedChange={setPlaybackSpeed}
                  onSelectStep={(idx) => {
                    setCurrentStepIndex(idx);
                    setIsPlayingSign(false);
                  }}
                />
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
            EduVaani responds through speech, subtitles, and Indian Sign Language animations.
          </div>
        )}
      </div>

    </div>
  );
}

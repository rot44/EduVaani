import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HeartHandshake, Sparkles } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeading } from '../components/ui/section-heading';
import { Badge } from '../components/ui/badge';
import { textToSignSequence, type SignGenerationResult } from '../lib/signGeneration';
import { multimodalManager, type UnifiedMessage } from '../lib/multimodal';

// Modular Sign Components
import { CameraPanel } from '../components/sign/CameraPanel';
import { RecognitionOutput, type RecognitionItem } from '../components/sign/RecognitionOutput';
import { TextInputPanel } from '../components/sign/TextInputPanel';
import { SignGenerationOutput } from '../components/sign/SignGenerationOutput';
import { SignInstructions } from '../components/sign/SignInstructions';
import { MessageBubble } from '../components/tutor/MessageBubble';

export default function SignLanguageTutor() {
  // Camera & Recognition State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [recognizedSign, setRecognizedSign] = useState<string | null>(null);
  const [hindiMeaning, setHindiMeaning] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [recentRecognitions, setRecentRecognitions] = useState<RecognitionItem[]>([]);

  // Unified Multimodal Conversation State
  const [conversation, setConversation] = useState<UnifiedMessage[]>(() =>
    multimodalManager.getConversationHistory()
  );

  useEffect(() => {
    return multimodalManager.subscribe(() => {
      setConversation(multimodalManager.getConversationHistory());
    });
  }, []);

  // Text-to-Sign Generation Engine State
  const [inputText, setInputText] = useState('Namaste good morning');
  const [signResult, setSignResult] = useState<SignGenerationResult>(() =>
    textToSignSequence('Namaste good morning')
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);

  // Convert input text to ISL sign sequence
  const handleConvertToSigns = (text: string) => {
    const result = textToSignSequence(text);
    setSignResult(result);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setAiResponseText(null);
  };

  // Ask Gemini AI: routes through Multimodal Communication Manager
  const handleAskAi = async (promptText: string) => {
    if (!promptText.trim() || isAiLoading) return;
    try {
      setIsAiLoading(true);
      const reply = await multimodalManager.sendMessage(promptText, 'text');
      setAiResponseText(reply.content);
      const result = textToSignSequence(reply.content);
      setSignResult(result);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to get Gemini AI response in sign language mode:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // "Send to conversation" from sign recognition feeds directly into the AI tutor!
  const handleSendToConversation = async (text: string) => {
    if (!text.trim() || isAiLoading) return;
    try {
      setIsAiLoading(true);
      setInputText(text);
      handleConvertToSigns(text);

      const reply = await multimodalManager.sendMessage(text, 'sign');
      setAiResponseText(reply.content);
      const result = textToSignSequence(reply.content);
      setSignResult(result);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to send sign to conversation:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Adaptive Kinematic Playback Timer based on each sign's duration
  useEffect(() => {
    if (!isPlaying) return;
    const sequence = signResult.sequence;
    if (!sequence || sequence.length === 0) {
      setIsPlaying(false);
      return;
    }

    if (currentStepIndex >= sequence.length - 1) {
      setIsPlaying(false);
      return;
    }

    const currentItem = sequence[currentStepIndex];
    const duration = Math.max(500, Math.round((currentItem?.duration || 1400) / playbackSpeed));

    const timer = window.setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev < sequence.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, duration);

    return () => window.clearTimeout(timer);
  }, [isPlaying, currentStepIndex, playbackSpeed, signResult]);

  const handlePlay = () => {
    if (currentStepIndex >= signResult.sequence.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReplay = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  // Handle real-time recognition results from signLanguage engine
  const handleRecognitionResult = (res: {
    status: string;
    sign: string | null;
    hindiMeaning: string | null;
    confidence: number;
  }) => {
    if (res.status === 'detected' && res.sign) {
      setRecognizedSign(res.sign);
      setHindiMeaning(res.hindiMeaning);
      setConfidence(res.confidence);
      setRecentRecognitions((prev) => {
        if (prev[0]?.sign === res.sign) return prev;
        return [
          {
            sign: res.sign!,
            hindiMeaning: res.hindiMeaning || undefined,
            confidence: res.confidence,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev.slice(0, 4),
        ];
      });
    } else if (res.status === 'uncertain') {
      setConfidence(res.confidence);
    } else if (res.status === 'no_hand') {
      setRecognizedSign(null);
      setConfidence(0);
      setHindiMeaning(null);
    }
  };

  return (
    <AppShell className="py-8 sm:py-12 bg-cream-white text-deep-brown font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Back Button */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-sm font-semibold text-deep-brown/70 hover:text-terracotta transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to="/voice-tutor"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-warm-sand/50 hover:bg-peacock-teal/15 text-deep-brown hover:text-peacock-teal text-xs font-bold border border-warm-sand transition-all"
              >
                <span>🎙️</span>
                <span>Voice & Text Tutor</span>
              </Link>
              <Badge variant="teal" className="text-xs font-bold">
                <HeartHandshake className="h-3 w-3 mr-1" />
                Inclusive Bharat
              </Badge>
              <Badge variant="turmeric" className="text-xs">
                Indian Sign Language (ISL)
              </Badge>
            </div>
          </div>

          <SectionHeading
            badge="SignBridge Studio"
            badgeVariant="teal"
            title="Sign Language Practice 🤟"
            subtitle="Practice Indian Sign Language (ISL) using real-time webcam gesture detection and text-to-sign visual translations."
            align="center"
          />
        </div>

        {/* Two-Column Responsive Workspace Layout:
            Desktop: Left (Camera + Recognition), Right (Text Input + Sign Output + Instructions)
            Mobile: Stacked in clear visual order */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Camera Feed & Real-time Gesture Recognition (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-6">
            <CameraPanel
              isCameraActive={isCameraActive}
              onCameraToggle={setIsCameraActive}
              onLearnWithoutCamera={() => setIsCameraActive(false)}
              onRecognitionResult={handleRecognitionResult}
            />

            <RecognitionOutput
              recognizedSign={recognizedSign}
              hindiMeaning={hindiMeaning}
              confidence={confidence}
              isCameraActive={isCameraActive}
              onSendToConversation={handleSendToConversation}
              recentRecognitions={recentRecognitions}
            />
          </div>

          {/* RIGHT COLUMN: Text Input to Sign Language & ISL Dictionary References */}
          <div className="lg:col-span-6 space-y-6">
            <TextInputPanel
              text={inputText}
              onTextChange={setInputText}
              onConvertToSigns={handleConvertToSigns}
              onAskAi={handleAskAi}
              isAiLoading={isAiLoading}
            />

            {/* AI Tutor Response Banner (When Gemini replies, its answer is transformed to ISL) */}
            {aiResponseText && (
              <div className="p-4 bg-peacock-teal/10 border border-peacock-teal/30 rounded-2xl flex items-start gap-3 shadow-xs animate-slide-up">
                <div className="w-8 h-8 rounded-xl bg-peacock-teal text-cream-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-peacock-teal font-display">Gemini AI Response</span>
                    <Badge variant="turmeric" className="text-[10px]">
                      Converted to ISL Signs Below
                    </Badge>
                  </div>
                  <p className="text-deep-brown font-medium leading-relaxed">
                    &ldquo;{aiResponseText}&rdquo;
                  </p>
                </div>
              </div>
            )}

            <SignGenerationOutput
              signResult={signResult}
              currentStepIndex={currentStepIndex}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              onPlay={handlePlay}
              onPause={handlePause}
              onReplay={handleReplay}
              onSpeedChange={setPlaybackSpeed}
              onSelectStep={(idx) => {
                setCurrentStepIndex(idx);
                setIsPlaying(false);
              }}
            />

            <SignInstructions
              onSelectSign={(word) => {
                setInputText(word);
                handleConvertToSigns(word);
              }}
            />
          </div>

        </div>

        {/* Unified Multimodal Conversation Thread */}
        <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 shadow-warm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-peacock-teal/15 text-peacock-teal flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-deep-brown font-display flex items-center gap-2">
                  Unified Conversation Context
                  <Badge variant="teal" className="text-[10px]">
                    {conversation.length} {conversation.length === 1 ? 'message' : 'messages'}
                  </Badge>
                </h3>
                <p className="text-xs text-deep-brown/65">
                  Dialogue carries over seamlessly between Voice, Text, and Sign modes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/voice-tutor"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-peacock-teal text-cream-white hover:bg-peacock-teal/90 text-xs font-bold shadow-xs transition-colors"
              >
                <span>🎙️ Open in Voice Tutor</span>
              </Link>
              {conversation.length > 0 && (
                <button
                  type="button"
                  onClick={() => multimodalManager.clearConversation()}
                  className="px-3 py-1.5 rounded-xl border border-warm-sand bg-cream-white hover:border-terracotta text-xs font-semibold text-deep-brown/70 hover:text-terracotta transition-colors cursor-pointer"
                >
                  Clear History
                </button>
              )}
            </div>
          </div>

          {conversation.length === 0 ? (
            <div className="py-8 text-center text-xs text-deep-brown/60 space-y-1.5 bg-cream-white rounded-2xl border border-dashed border-warm-sand">
              <p className="font-semibold text-sm text-deep-brown/80 font-display">No conversation messages yet</p>
              <p className="max-w-md mx-auto">
                Show a sign to the camera and tap &ldquo;Send to Conversation&rdquo;, or type a prompt above. Messages from the Voice Tutor also appear here in real time.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {conversation.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}

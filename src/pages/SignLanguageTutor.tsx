import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HeartHandshake, Sparkles } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeading } from '../components/ui/section-heading';
import { Badge } from '../components/ui/badge';
import { textToSignSequence, type SignGenerationResult } from '../lib/signGeneration';
import { aiService } from '../lib/ai';

// Modular Sign Components
import { CameraPanel } from '../components/sign/CameraPanel';
import { RecognitionOutput, type RecognitionItem } from '../components/sign/RecognitionOutput';
import { TextInputPanel } from '../components/sign/TextInputPanel';
import { SignGenerationOutput } from '../components/sign/SignGenerationOutput';
import { SignInstructions } from '../components/sign/SignInstructions';

export default function SignLanguageTutor() {
  // Camera & Recognition State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [recognizedSign, setRecognizedSign] = useState<string | null>(null);
  const [hindiMeaning, setHindiMeaning] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [recentRecognitions, setRecentRecognitions] = useState<RecognitionItem[]>([]);

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

  // Ask Gemini AI in Sign Language Mode: Response converted directly into ISL signs!
  const handleAskAi = async (promptText: string) => {
    if (!promptText.trim() || isAiLoading) return;
    try {
      setIsAiLoading(true);
      const reply = await aiService.sendMessage(promptText);
      setAiResponseText(reply);
      const result = textToSignSequence(reply);
      setSignResult(result);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to get Gemini AI response in sign language mode:', err);
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

  const handleSendToConversation = (text: string) => {
    const combined = inputText ? `${inputText} ${text}` : text;
    setInputText(combined);
    handleConvertToSigns(combined);
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

            <div className="flex items-center gap-2">
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

      </div>
    </AppShell>
  );
}

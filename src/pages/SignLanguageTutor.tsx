import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HeartHandshake } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeading } from '../components/ui/section-heading';
import { Badge } from '../components/ui/badge';

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

  // Text-to-Sign Generation State
  const [inputText, setInputText] = useState('Namaste good morning');
  const [inputWords, setInputWords] = useState<string[]>(['Namaste', 'good', 'morning']);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const playbackTimerRef = useRef<number | null>(null);

  // Convert input text to words array
  const handleConvertToSigns = (text: string) => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    setInputWords(words);
    setCurrentWordIndex(0);
    setIsPlaying(true);
  };

  // Playback timer for animated sign sequence
  useEffect(() => {
    if (isPlaying && inputWords.length > 0) {
      const intervalMs = Math.round(1600 / playbackSpeed);

      playbackTimerRef.current = window.setInterval(() => {
        setCurrentWordIndex((prev) => {
          if (prev < inputWords.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);

      return () => {
        if (playbackTimerRef.current) {
          clearInterval(playbackTimerRef.current);
          playbackTimerRef.current = null;
        }
      };
    }
  }, [isPlaying, inputWords.length, playbackSpeed]);

  const handlePlay = () => {
    if (currentWordIndex >= inputWords.length - 1) {
      setCurrentWordIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReplay = () => {
    setCurrentWordIndex(0);
    setIsPlaying(true);
  };

  const handleSendToConversation = (text: string) => {
    setInputText((prev) => (prev ? `${prev} ${text}` : text));
    handleConvertToSigns(inputText ? `${inputText} ${text}` : text);
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
            />

            <SignGenerationOutput
              inputWords={inputWords}
              currentWordIndex={currentWordIndex}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              onPlay={handlePlay}
              onPause={handlePause}
              onReplay={handleReplay}
              onSpeedChange={setPlaybackSpeed}
              onSelectWord={(idx) => {
                setCurrentWordIndex(idx);
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

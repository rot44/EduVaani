import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Zap, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService, SpeechService } from '../lib/speech';
import { sarvamService } from '../lib/sarvam';
import { aiService, ROLEPLAY_SCENARIOS, type ChatMessage } from '../lib/ai';
import { translationService } from '../lib/translation';
import { textToSignSequence, type SignGenerationResult } from '../lib/signGeneration';
import { MicDiagnosticModal } from './MicDiagnosticModal';

// Modular Subcomponents
import { TutorHeader } from './tutor/TutorHeader';
import { CallView } from './tutor/CallView';
import { TranscriptView } from './tutor/TranscriptView';
import { ControlDock } from './tutor/ControlDock';
import type { TutorStatus } from './tutor/VaaniOrb';

export type { TutorStatus };

export interface VoiceTutorProps {
  autoStartMode?: string | null;
  onEnd?: () => void;
}

export default function VoiceTutor({ autoStartMode, onEnd }: VoiceTutorProps) {
  // Session & UI States
  const [status, setStatus] = useState<TutorStatus>('idle');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSpeechSupported] = useState(() => SpeechService.isSupported());
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [sessionTitle, setSessionTitle] = useState('Free Chat');
  const [textInput, setTextInput] = useState('');
  const [activeScenario, setActiveScenario] = useState<(typeof ROLEPLAY_SCENARIOS)[0] | null>(null);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState<number | null>(null);
  const [voiceEngine, setVoiceEngine] = useState<'sarvam' | 'browser'>(speechService.getVoiceEngine());
  const [viewMode, setViewMode] = useState<'call' | 'transcript'>('call');
  const [showInputDrawer, setShowInputDrawer] = useState(false);
  const [isMicDiagOpen, setIsMicDiagOpen] = useState(false);
  const [interimSpeech, setInterimSpeech] = useState('');
  const [micLanguage, setMicLanguage] = useState<string>('en-IN');

  // Sign Language Mode for AI Responses
  const [isSignMode, setIsSignMode] = useState(false);
  const [aiSignResult, setAiSignResult] = useState<SignGenerationResult | null>(null);
  const [signStepIndex, setSignStepIndex] = useState(0);

  const chatRef = useRef<HTMLDivElement>(null);
  const hasAutoStartedRef = useRef(false);

  // Clean teardown on unmount
  useEffect(() => {
    return () => {
      speechService.stopListening();
      speechService.stopSpeaking();
    };
  }, []);

  // Auto-scroll chat history in transcript mode
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory, status, viewMode]);

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    speechService.setLanguage(code);
  };

  const toggleSpeechSpeed = () => {
    setSpeechRate((prev) => (prev === 0.85 ? 1.0 : 0.85));
  };

  const triggerCelebration = () => {
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore animation failure
    }
  };

  // Start Voice Session
  const startSession = useCallback(
    async (mode: string) => {
      try {
        setError(null);
        setStatus('processing');
        let welcome: string;

        if (mode === 'free-flow') {
          welcome = await aiService.startFreeFlowChat();
          setSessionTitle('Free Conversation 💬');
          setActiveScenario(null);
        } else {
          welcome = await aiService.startRoleplay(mode);
          const scenario = ROLEPLAY_SCENARIOS.find((s) => s.id === mode);
          if (scenario) {
            setActiveScenario(scenario);
            setSessionTitle(`${scenario.emoji} ${scenario.title}`);
          } else {
            setSessionTitle('Scenario Practice');
          }
        }

        let messageToSpeak = welcome;
        if (selectedLanguage !== 'en') {
          const translated = await translationService.translateToLanguage(welcome, selectedLanguage);
          const history = aiService.getChatHistory();
          if (history.length > 0) history[history.length - 1].translatedContent = translated;
          messageToSpeak = translated;
        }

        // Generate ISL signs for live Gemini AI welcome
        const signs = textToSignSequence(welcome);
        setAiSignResult(signs);
        setSignStepIndex(0);

        setChatHistory([...aiService.getChatHistory()]);
        setStatus('speaking');
        await speechService.speak(messageToSpeak, speechRate);
        setStatus('idle');
      } catch {
        setError('Could not connect to voice service. Tap the orb to try again!');
        setStatus('idle');
      }
    },
    [selectedLanguage, speechRate]
  );

  useEffect(() => {
    if (autoStartMode && isSpeechSupported && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      startSession(autoStartMode);
    }
  }, [autoStartMode, isSpeechSupported, startSession]);

  // Step through ISL signs during speech in sign language mode
  useEffect(() => {
    if (!isSignMode || status !== 'speaking' || !aiSignResult) return;
    const sequence = aiSignResult.sequence;
    if (!sequence || sequence.length === 0 || signStepIndex >= sequence.length - 1) return;

    const currentItem = sequence[signStepIndex];
    const duration = Math.max(500, currentItem?.duration || 1200);

    const timer = window.setTimeout(() => {
      setSignStepIndex((prev) => (prev < sequence.length - 1 ? prev + 1 : prev));
    }, duration);

    return () => window.clearTimeout(timer);
  }, [isSignMode, status, aiSignResult, signStepIndex]);

  // Process user message through Gemini AI
  const processUserMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    try {
      setError(null);
      setStatus('processing');
      const response = await aiService.sendMessage(messageText);
      const history = aiService.getChatHistory();
      const last = history[history.length - 1];
      let messageToSpeak = response;

      if (last && selectedLanguage !== 'en') {
        const translated = await translationService.translateToLanguage(response, selectedLanguage);
        last.translatedContent = translated;
        messageToSpeak = translated;
      }
      setChatHistory([...history]);

      // Generate ISL signs for live Gemini AI response
      const signs = textToSignSequence(response);
      setAiSignResult(signs);
      setSignStepIndex(0);

      // Keep celebration every 3 user turns
      const userMessageCount = history.filter((m) => m.role === 'user').length;
      if (userMessageCount > 0 && userMessageCount % 3 === 0) {
        triggerCelebration();
      }

      setStatus('speaking');
      await speechService.speak(messageToSpeak, speechRate);
      setStatus('idle');
    } catch {
      setError('Could not process speech. Please speak again or type below!');
      setStatus('idle');
    }
  };

  // Microphone capture handler
  const handleVoiceInput = async () => {
    if (!isSpeechSupported) {
      setError('Voice recognition is not supported in this browser. Please use Chrome, Edge, or type below!');
      setStatus('idle');
      return;
    }

    try {
      setError(null);
      setInterimSpeech('');
      setStatus('listening');

      const input = await speechService.listen((liveText) => {
        setInterimSpeech(liveText);
      }, micLanguage);

      setInterimSpeech('');

      if (input && input.trim().length > 0) {
        await processUserMessage(input);
      } else {
        setStatus('idle');
      }
    } catch (err: unknown) {
      setInterimSpeech('');
      console.warn('Speech recognition notice:', err);
      const msg = err instanceof Error ? err.message : '';
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('not-allowed')) {
        setError('Microphone access is blocked. Click "Mic Check" above to allow access.');
        setIsMicDiagOpen(true);
      } else {
        setError('Could not hear clearly. Tap the microphone and speak your sentence.');
      }
      setStatus('idle');
    }
  };

  const handleMicButtonClick = () => {
    if (status === 'listening') {
      // User tapped while listening -> finish listening and submit captured speech immediately
      speechService.finishListening();
    } else if (status === 'speaking') {
      // User tapped while AI was speaking -> interrupt AI and start listening
      speechService.stopSpeaking();
      handleVoiceInput();
    } else {
      handleVoiceInput();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || status === 'processing' || status === 'speaking') return;
    const msg = textInput;
    setTextInput('');
    processUserMessage(msg);
  };

  const replayMessage = async (text: string, index: number) => {
    try {
      speechService.stopSpeaking();
      setCurrentlyPlayingIndex(index);
      await speechService.speak(text, speechRate);
    } finally {
      setCurrentlyPlayingIndex(null);
    }
  };

  const stopAll = () => {
    speechService.stopListening();
    speechService.stopSpeaking();
    setCurrentlyPlayingIndex(null);
    setInterimSpeech('');
    setStatus('idle');
  };

  const handleFinishSession = () => {
    stopAll();
    triggerCelebration();
    if (onEnd) onEnd();
  };

  // Latest messages for voice call stage
  const lastAssistantMsg = [...chatHistory].reverse().find((m) => m.role === 'assistant');
  const lastUserMsg = [...chatHistory].reverse().find((m) => m.role === 'user');

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-b from-cream-white via-warm-ivory to-warm-sand/35 text-deep-brown selection:bg-terracotta selection:text-cream-white overflow-hidden font-sans">
      
      {/* Background ambient lighting accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-turmeric/10 rounded-full blur-[140px]" />
      </div>

      {/* 1. Top Navigation Bar */}
      <TutorHeader
        sessionTitle={sessionTitle}
        messageCount={chatHistory.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        voiceEngine={voiceEngine}
        onToggleVoiceEngine={() => {
          const next = speechService.getVoiceEngine() === 'sarvam' ? 'browser' : 'sarvam';
          speechService.setVoiceEngine(next);
          setVoiceEngine(next);
        }}
        isSarvamConfigured={sarvamService.isConfigured()}
        onMicCheck={() => setIsMicDiagOpen(true)}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        onFinishSession={handleFinishSession}
        isSignMode={isSignMode}
        onToggleSignMode={() => setIsSignMode((prev) => !prev)}
      />

      {/* 1.5 ISL Sign Visualizer Strip in Voice Tutor (Active in Sign Mode) */}
      {isSignMode && aiSignResult && aiSignResult.sequence.length > 0 && (
        <div className="relative z-20 max-w-4xl mx-auto w-full px-4 pt-2 animate-slide-up">
          <div className="bg-warm-ivory/95 border border-warm-sand rounded-2xl p-3 shadow-warm-sm flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🤟</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-deep-brown font-display">ISL Live Output</span>
                  {aiSignResult.islGloss && (
                    <span className="text-[10px] font-mono text-terracotta bg-cream-white px-2 py-0.5 rounded border border-warm-sand">
                      ISL: {aiSignResult.islGloss}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-deep-brown/65">
                  {aiSignResult.sequence[signStepIndex]?.signData.description || 'Indian sign language posture'}
                </span>
              </div>
            </div>

            {/* Sequence Ribbon */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-1 scrollbar-thin">
              {aiSignResult.sequence.map((item, idx) => {
                const isCurrent = idx === signStepIndex;
                const isDone = idx < signStepIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSignStepIndex(idx)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 ${
                      isCurrent
                        ? 'bg-terracotta text-cream-white shadow-xs scale-105'
                        : isDone
                        ? 'bg-peacock-teal/20 text-peacock-teal border border-peacock-teal/30'
                        : 'bg-warm-sand/50 text-deep-brown/70 hover:bg-warm-sand'
                    }`}
                  >
                    <span>{item.signData.emoji}</span>
                    <span>{item.displayWord}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Toast Error Notification (Soft Coral Accent) */}
      {error && (
        <div className="relative z-30 max-w-md mx-auto mt-3 px-4 animate-slide-up w-full">
          <div className="bg-cream-white border-2 border-soft-coral/70 rounded-2xl p-3 text-center flex items-center justify-between text-xs text-deep-brown shadow-warm-md">
            <span className="flex items-center gap-2 text-left font-medium">
              <Zap className="h-4 w-4 text-soft-coral flex-shrink-0" />
              <span>{error}</span>
            </span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-deep-brown/60 hover:text-soft-coral ml-2 p-1 transition-colors"
              aria-label="Dismiss error notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Stage: Voice Call or Transcript View */}
      <main className="flex-grow flex flex-col relative z-10 max-w-4xl mx-auto w-full px-4 py-4 overflow-hidden">
        {viewMode === 'call' ? (
          <CallView
            status={status}
            micLanguage={micLanguage}
            interimSpeech={interimSpeech}
            lastUserMsg={lastUserMsg}
            lastAssistantMsg={lastAssistantMsg}
            onMicButtonClick={handleMicButtonClick}
            onReplay={replayMessage}
            currentlyPlayingIndex={currentlyPlayingIndex}
            onPracticeText={(improved) => {
              setTextInput(improved);
              setShowInputDrawer(true);
            }}
          />
        ) : (
          <TranscriptView
            chatHistory={chatHistory}
            chatRef={chatRef}
            currentlyPlayingIndex={currentlyPlayingIndex}
            onReplay={replayMessage}
            onPracticeText={(improved) => {
              setTextInput(improved);
              setShowInputDrawer(true);
            }}
            onStartSpeaking={handleMicButtonClick}
          />
        )}
      </main>

      {/* 4. Bottom Floating Control Dock */}
      <ControlDock
        status={status}
        speechRate={speechRate}
        onToggleSpeechSpeed={toggleSpeechSpeed}
        micLanguage={micLanguage}
        onToggleMicLanguage={() =>
          setMicLanguage((prev) => (prev === 'en-IN' ? 'hi-IN' : 'en-IN'))
        }
        showInputDrawer={showInputDrawer}
        onToggleInputDrawer={() => setShowInputDrawer((prev) => !prev)}
        textInput={textInput}
        onTextInputChange={setTextInput}
        onTextSubmit={handleTextSubmit}
        onMicButtonClick={handleMicButtonClick}
        onStopAll={stopAll}
        onFinishSession={handleFinishSession}
        activeScenario={activeScenario}
        onSelectSuggestedPhrase={(phrase) => processUserMessage(phrase)}
      />

      {/* Audio & Mic Hardware Diagnostic Modal */}
      <MicDiagnosticModal
        isOpen={isMicDiagOpen}
        onClose={() => setIsMicDiagOpen(false)}
      />
    </div>
  );
}

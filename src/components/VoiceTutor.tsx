import React, { useState, useEffect, useRef, useCallback } from 'react';

import confetti from 'canvas-confetti';
import { speechService, SpeechService } from '../lib/speech';
import { sarvamService } from '../lib/sarvam';
import { aiService, ROLEPLAY_SCENARIOS } from '../lib/ai';
import { translationService } from '../lib/translation';
import {
  multimodalManager,
  type UnifiedMessage,
  type InputMode,
  type OutputMode,
} from '../lib/multimodal';
import { MicDiagnosticModal } from './MicDiagnosticModal';
import { toast } from './ui/toast';

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
  const [unifiedHistory, setUnifiedHistory] = useState<UnifiedMessage[]>(() =>
    multimodalManager.getConversationHistory()
  );
  const [inputMode, setInputMode] = useState<InputMode>(() =>
    multimodalManager.getInputMode()
  );
  const [outputMode, setOutputMode] = useState<OutputMode>(() =>
    multimodalManager.getOutputMode()
  );
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

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

  const chatRef = useRef<HTMLDivElement>(null);
  const hasAutoStartedRef = useRef(false);
  const sessionStartTimeRef = useRef<number>(Date.now());

  // Subscribe to Multimodal Manager state changes
  useEffect(() => {
    return multimodalManager.subscribe(() => {
      setUnifiedHistory(multimodalManager.getConversationHistory());
      setInputMode(multimodalManager.getInputMode());
      setOutputMode(multimodalManager.getOutputMode());
    });
  }, []);

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
  }, [unifiedHistory, status, viewMode]);

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

  const handleInputModeChange = (mode: InputMode) => {
    multimodalManager.setInputMode(mode);
    setInputMode(mode);
    setVoiceError(null);

    if (mode === 'sign') {
      setViewMode('call');
      setIsCameraActive(true);
    } else if (mode === 'text') {
      setViewMode('transcript');
      setShowInputDrawer(true);
    } else {
      setViewMode('call');
    }
  };

  const handleOutputModeChange = (mode: OutputMode) => {
    multimodalManager.setOutputMode(mode);
    setOutputMode(mode);
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
        let translated: string | undefined = undefined;
        if (selectedLanguage !== 'en') {
          translated = await translationService.translateToLanguage(welcome, selectedLanguage);
          messageToSpeak = translated;
        }

        // Initialize session in multimodal manager
        const welcomeUnified: UnifiedMessage = {
          id: `ast-${Date.now()}-welcome`,
          role: 'assistant',
          content: welcome,
          source: 'voice',
          timestamp: new Date(),
          translatedContent: translated,
        };
        (multimodalManager as unknown as { history: UnifiedMessage[] }).history = [welcomeUnified];
        multimodalManager['notifyListeners']();

        if (outputMode === 'voice' || outputMode === 'all') {
          setStatus('speaking');
          await speechService.speak(messageToSpeak, speechRate);
          setStatus('idle');
        } else {
          setStatus('idle');
        }
      } catch {
        const errText = 'Could not connect to voice service. Tap the orb to try again!';
        setError(errText);
        toast.error(errText);
        setStatus('idle');
      }
    },
    [selectedLanguage, speechRate, outputMode]
  );

  useEffect(() => {
    if (autoStartMode && isSpeechSupported && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      startSession(autoStartMode);
    }
  }, [autoStartMode, isSpeechSupported, startSession]);

  // Process user message through Multimodal Manager (Gemini AI + Voice + Text + Sign)
  const processUserMessage = async (messageText: string, source: InputMode = inputMode) => {
    if (!messageText.trim()) return;
    try {
      setError(null);
      setVoiceError(null);
      setStatus('processing');

      const assistantMsg = await multimodalManager.sendMessage(messageText, source, {
        targetLanguage: selectedLanguage,
        speechRate,
        scenario: activeScenario,
        skipAudioOutput: outputMode === 'text' || outputMode === 'sign',
      });

      const userMessageCount = multimodalManager
        .getConversationHistory()
        .filter((m) => m.role === 'user').length;
      if (userMessageCount > 0 && userMessageCount % 3 === 0) {
        triggerCelebration();
      }

      if (outputMode === 'voice' || outputMode === 'all') {
        setStatus('speaking');
        setTimeout(() => setStatus('idle'), Math.min(6000, assistantMsg.content.length * 60));
      } else {
        setStatus('idle');
      }
    } catch {
      const errText = 'Could not process speech. Please speak again or type below!';
      setError(errText);
      toast.error(errText);
      setStatus('idle');
    }
  };

  // Microphone capture handler
  const handleVoiceInput = async () => {
    if (!isSpeechSupported) {
      const errText = 'Voice recognition is not supported in this browser. Please use Chrome, Edge, or type below!';
      setError(errText);
      toast.error(errText);
      setStatus('idle');
      return;
    }

    try {
      setError(null);
      setVoiceError(null);
      setInterimSpeech('');
      setStatus('listening');

      const input = await speechService.listen((liveText) => {
        setInterimSpeech(liveText);
      }, micLanguage);

      setInterimSpeech('');

      if (input && input.trim().length > 0) {
        await processUserMessage(input, 'voice');
      } else {
        setStatus('idle');
      }
    } catch (err: unknown) {
      setInterimSpeech('');
      console.warn('Speech recognition notice:', err);
      const msg = err instanceof Error ? err.message : '';
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('not-allowed')) {
        const errText = 'Microphone access is blocked. Click "Mic Check" above to allow access.';
        setError(errText);
        toast.error(errText);
        setIsMicDiagOpen(true);
      } else {
        const errText = 'Could not hear clearly. Tap the microphone and speak your sentence.';
        setError(errText);
        toast.error(errText);
      }
      setVoiceError('Voice input was unclear. Try typing or using sign language 🤟');
      setStatus('idle');
    }
  };

  const handleMicButtonClick = () => {
    if (status === 'listening') {
      speechService.finishListening();
    } else if (status === 'speaking') {
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
    processUserMessage(msg, 'text');
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
    const durationMinutes = Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 60000));
    multimodalManager.saveCurrentSession(durationMinutes, sessionTitle, activeScenario?.id);
    triggerCelebration();
    if (onEnd) onEnd();
  };

  // Latest messages for voice call stage
  const lastAssistantMsg = [...unifiedHistory].reverse().find((m) => m.role === 'assistant');
  const lastUserMsg = [...unifiedHistory].reverse().find((m) => m.role === 'user');

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-b from-cream-white via-warm-ivory to-warm-sand/35 text-deep-brown selection:bg-terracotta selection:text-cream-white overflow-hidden font-sans">
      
      {/* Background ambient lighting accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-turmeric/10 rounded-full blur-[140px]" />
      </div>

      {/* 1. Top Navigation Bar with Input Mode Switcher (Voice | Text | Sign) and Output Mode Selector */}
      <TutorHeader
        sessionTitle={sessionTitle}
        messageCount={unifiedHistory.length}
        inputMode={inputMode}
        onInputModeChange={handleInputModeChange}
        outputMode={outputMode}
        onOutputModeChange={handleOutputModeChange}
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
      />



      {/* Skip to Content */}
      <a href="#main-content" className="skip-to-content">
        Skip to voice controls
      </a>

      {/* Screen Reader Live Region for Speech Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {status === 'listening' && 'Listening to your speech... speak your sentence.'}
        {status === 'processing' && 'Processing your response...'}
        {status === 'speaking' && `Vaani is speaking: ${lastAssistantMsg?.content || ''}`}
        {interimSpeech && `Recognized speech: ${interimSpeech}`}
        {voiceError && `Notice: ${voiceError}`}
        {error && `Error: ${error}`}
      </div>

      {/* 3. Main Stage: Voice Call (with inline Camera in Sign mode) or Transcript View */}
      <main id="main-content" tabIndex={-1} className="flex-grow flex flex-col relative z-10 max-w-4xl mx-auto w-full px-4 py-4 overflow-hidden focus:outline-none">
        {viewMode === 'call' ? (
          <CallView
            status={status}
            inputMode={inputMode}
            outputMode={outputMode}
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
            isCameraActive={isCameraActive}
            onCameraToggle={setIsCameraActive}
            onSendSignMessage={(signText) => processUserMessage(signText, 'sign')}
            onSwitchInputMode={handleInputModeChange}
            voiceError={voiceError}
          />
        ) : (
          <TranscriptView
            chatHistory={unifiedHistory}
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

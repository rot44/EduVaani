import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  Volume2,
  Bot,
  User,
  X,
  BrainCircuit,
  Languages,
  Zap,
  Sparkles,
  Send,
  Gauge,
  PartyPopper,
  Check,
  MessageSquare,
  PhoneCall,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService, SpeechService } from '../lib/speech';
import { sarvamService } from '../lib/sarvam';
import { aiService, ROLEPLAY_SCENARIOS, type ChatMessage } from '../lib/ai';
import { translationService } from '../lib/translation';
import { LanguageSelector } from './LanguageSelector';
import { AudioWaveVisualizer } from './AudioWaveVisualizer';
import { MicDiagnosticModal } from './MicDiagnosticModal';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

type TutorStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
type ViewMode = 'call' | 'transcript';

interface VoiceTutorProps {
  autoStartMode?: string | null;
  onEnd?: () => void;
}

// Modern, breathing AI Voice Orb
function VaaniOrb({
  status,
  onClick,
  disabled
}: {
  status: TutorStatus;
  onClick: () => void;
  disabled: boolean;
}) {
  const configs: Record<TutorStatus, { icon: React.ReactNode; gradient: string; label: string; glow: string }> = {
    idle: {
      icon: <Sparkles className="h-10 w-10 text-white" />,
      gradient: 'from-amber-500 via-orange-500 to-amber-600',
      label: 'Tap to speak English',
      glow: 'shadow-orange-500/30'
    },
    listening: {
      icon: <Mic className="h-10 w-10 text-white animate-pulse" />,
      gradient: 'from-rose-500 via-red-500 to-amber-500',
      label: 'Listening to your voice...',
      glow: 'shadow-red-500/50'
    },
    processing: {
      icon: <BrainCircuit className="h-10 w-10 text-white animate-spin" />,
      gradient: 'from-amber-400 via-yellow-500 to-orange-500',
      label: 'Thinking & coaching...',
      glow: 'shadow-amber-400/40'
    },
    speaking: {
      icon: <Volume2 className="h-10 w-10 text-white animate-bounce" />,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      label: 'EduVaani is speaking...',
      glow: 'shadow-emerald-500/40'
    },
    error: {
      icon: <Zap className="h-10 w-10 text-white" />,
      gradient: 'from-slate-600 to-slate-700',
      label: 'Tap to try again',
      glow: 'shadow-slate-500/20'
    },
  };
  const cfg = configs[status];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* Ambient radial aura */}
        <div
          className={`absolute w-44 h-44 rounded-full bg-gradient-to-tr ${cfg.gradient} opacity-30 blur-2xl transition-all duration-700 ${
            status === 'speaking' || status === 'listening' ? 'scale-125 opacity-50' : 'scale-100'
          }`}
        />

        {/* Animated ripple wave when listening */}
        {status === 'listening' && (
          <>
            <div className="absolute w-36 h-36 rounded-full border border-red-400/60 animate-ping opacity-40 pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full border border-orange-400/30 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Main interactive orb */}
        <button
          onClick={onClick}
          disabled={disabled}
          title={status === 'listening' ? 'Tap to finish speaking' : 'Tap to speak'}
          className={`relative z-10 w-32 h-32 rounded-full bg-gradient-to-tr ${cfg.gradient} text-white
            shadow-2xl ${cfg.glow} transition-all duration-300 ease-out transform
            ${disabled ? 'cursor-not-allowed opacity-80' : 'hover:scale-105 active:scale-95 cursor-pointer'}
            border-2 border-white/20 flex items-center justify-center`}
        >
          {/* Subtle glossy glass shine */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/30 via-transparent to-transparent pointer-events-none" />
          {cfg.icon}
        </button>
      </div>

      {/* Live harmonic audio waveform */}
      <AudioWaveVisualizer
        isActive={status === 'speaking' || status === 'listening' || status === 'processing'}
        status={status}
      />

      {/* Status Pill */}
      <div className="glass border border-white/10 rounded-full px-5 py-1 text-center shadow-lg backdrop-blur-md">
        <p className="text-white/90 text-xs font-semibold tracking-wide flex items-center gap-2">
          {status === 'listening' && <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />}
          {status === 'speaking' && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
          {status === 'processing' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-spin" />}
          {cfg.label}
        </p>
      </div>
    </div>
  );
}

export default function VoiceTutor({ autoStartMode, onEnd }: VoiceTutorProps) {
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
  const [viewMode, setViewMode] = useState<ViewMode>('call');
  const [showInputDrawer, setShowInputDrawer] = useState(false);
  const [isMicDiagOpen, setIsMicDiagOpen] = useState(false);
  const [showCoachDetails, setShowCoachDetails] = useState(true);

  const chatRef = useRef<HTMLDivElement>(null);
  const hasAutoStartedRef = useRef(false);

  useEffect(() => {
    return () => {
      speechService.stopListening();
      speechService.stopSpeaking();
    };
  }, []);

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
    setSpeechRate(prev => (prev === 0.85 ? 1.0 : 0.85));
  };

  const triggerCelebration = () => {
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  const startSession = useCallback(async (mode: string) => {
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
        const scenario = ROLEPLAY_SCENARIOS.find(s => s.id === mode);
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
      setChatHistory([...aiService.getChatHistory()]);
      setStatus('speaking');
      await speechService.speak(messageToSpeak, speechRate);
      setStatus('idle');
    } catch {
      setError('Could not connect to voice service. Tap the orb to try again!');
      setStatus('idle');
    }
  }, [selectedLanguage, speechRate]);

  useEffect(() => {
    if (autoStartMode && isSpeechSupported && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      startSession(autoStartMode);
    }
  }, [autoStartMode, isSpeechSupported, startSession]);

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

      // Celebrate progress every 3 turns
      const userMessageCount = history.filter(m => m.role === 'user').length;
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

  const handleVoiceInput = async () => {
    if (!isSpeechSupported) {
      setError('Voice not supported in this browser. You can type below!');
      setStatus('idle');
      return;
    }
    try {
      setError(null);
      setStatus('listening');
      const input = await speechService.listen();
      if (input.trim()) {
        await processUserMessage(input);
      } else {
        setStatus('idle');
      }
    } catch {
      setError('Could not hear clearly. Tap the orb and speak into your microphone!');
      setStatus('idle');
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
    setStatus('idle');
  };

  const handleFinishSession = () => {
    stopAll();
    triggerCelebration();
    if (onEnd) onEnd();
  };

  // Last messages for call mode
  const lastAssistantMsg = [...chatHistory].reverse().find(m => m.role === 'assistant');
  const lastUserMsg = [...chatHistory].reverse().find(m => m.role === 'user');

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-slate-950 text-white selection:bg-orange-500 overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
      </div>

      {/* TOP APP BAR */}
      <header className="relative z-20 glass border-b border-white/10 px-4 sm:px-6 py-3 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          {/* Title & Mode */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center gap-2">
                {sessionTitle}
              </h2>
              <Badge variant="saffron" className="text-[10px] hidden sm:inline-flex">
                Live AI
              </Badge>
            </div>
            <p className="text-xs text-orange-200/60">EduVaani • Spoken English Practice</p>
          </div>

          {/* Center Mode Switch */}
          <div className="glass border border-white/15 rounded-full p-0.5 flex items-center">
            <button
              onClick={() => setViewMode('call')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'call'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <PhoneCall className="h-3 w-3" />
              <span>Voice Call</span>
            </button>
            <button
              onClick={() => setViewMode('transcript')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'transcript'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <MessageSquare className="h-3 w-3" />
              <span>Chat & Notes</span>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Sarvam AI Voice Toggle */}
            {sarvamService.isConfigured() && (
              <button
                onClick={() => {
                  const next = speechService.getVoiceEngine() === 'sarvam' ? 'browser' : 'sarvam';
                  speechService.setVoiceEngine(next);
                  setVoiceEngine(next);
                }}
                className={`border rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                  voiceEngine === 'sarvam'
                    ? 'border-orange-500/60 bg-orange-500/20 text-orange-200'
                    : 'glass border-white/15 text-white/70 hover:text-white'
                }`}
                title="Toggle between Sarvam Bulbul and Web Speech TTS"
              >
                {voiceEngine === 'sarvam' ? '🇮🇳 Bulbul Voice' : '🌐 Browser TTS'}
              </button>
            )}

            {/* Mic Diagnostic */}
            <button
              onClick={() => setIsMicDiagOpen(true)}
              className="glass border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 hover:text-white rounded-full px-2.5 py-1 text-xs flex items-center gap-1 transition-all cursor-pointer"
              title="Test microphone volume"
            >
              <Mic className="h-3 w-3 text-emerald-400" />
              <span className="hidden sm:inline">Mic Check</span>
            </button>

            {/* Language dropdown */}
            <LanguageSelector currentLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />

            {/* Close */}
            <button
              onClick={handleFinishSession}
              className="glass border border-white/15 text-white/70 hover:text-white hover:border-red-400/50 rounded-full p-1.5 transition-colors cursor-pointer"
              title="Finish session & return"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ERROR TOAST NOTIFICATION */}
      {error && (
        <div className="relative z-30 max-w-md mx-auto mt-2 px-4 animate-slide-up">
          <div className="glass border border-amber-500/40 bg-amber-500/10 rounded-2xl px-4 py-2.5 text-center flex items-center justify-between text-xs text-amber-200">
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-400 flex-shrink-0" /> {error}
            </span>
            <button onClick={() => setError(null)} className="text-white/60 hover:text-white ml-2">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN STAGE */}
      <main className="flex-grow flex flex-col relative z-10 max-w-4xl mx-auto w-full px-4 py-4 overflow-hidden">
        {viewMode === 'call' ? (
          /* ============================================================== */
          /* CALL MODE: Immersive AI Voice Stage (ChatGPT Voice style)       */
          /* ============================================================== */
          <div className="flex-grow flex flex-col justify-between items-center py-4">
            
            {/* Student's latest speech prompt bubble */}
            <div className="w-full max-w-lg min-h-[50px] flex items-center justify-center text-center">
              {lastUserMsg ? (
                <div className="glass border border-white/10 rounded-2xl px-5 py-2.5 text-xs sm:text-sm text-white/90 shadow-lg animate-slide-up">
                  <span className="text-orange-400 font-semibold mr-1.5">You:</span>
                  <span className="italic">"{lastUserMsg.content}"</span>
                </div>
              ) : (
                <p className="text-xs text-white/40">
                  Tap the orb below or press the microphone to start speaking.
                </p>
              )}
            </div>

            {/* Central Animated Orb */}
            <div className="my-auto py-4">
              <VaaniOrb
                status={status}
                onClick={status === 'listening' ? stopAll : handleVoiceInput}
                disabled={status === 'processing' || status === 'speaking'}
              />
            </div>

            {/* Tutor's response subtitle card with Live Coach Tip */}
            <div className="w-full max-w-xl space-y-3">
              {lastAssistantMsg ? (
                <div className="glass border border-white/15 rounded-3xl p-5 shadow-2xl backdrop-blur-xl animate-slide-up space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow">
                        <Bot className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-white">EduVaani</span>
                    </div>

                    <button
                      onClick={() => replayMessage(lastAssistantMsg.translatedContent || lastAssistantMsg.content, -99)}
                      className="text-xs text-orange-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                      title="Replay pronunciation"
                    >
                      <Volume2 className={`h-3.5 w-3.5 ${currentlyPlayingIndex === -99 ? 'animate-bounce text-emerald-400' : ''}`} />
                      <span>Listen</span>
                    </button>
                  </div>

                  {/* Main subtitle */}
                  <p className="text-sm sm:text-base text-white/95 leading-relaxed font-medium">
                    "{lastAssistantMsg.content}"
                  </p>

                  {/* Vernacular translation */}
                  {lastAssistantMsg.translatedContent && lastAssistantMsg.translatedContent !== lastAssistantMsg.content && (
                    <div className="text-xs text-amber-300/90 pt-2 border-t border-white/10 flex items-start gap-1.5">
                      <Languages className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{lastAssistantMsg.translatedContent}</span>
                    </div>
                  )}

                  {/* Expandable Coach Tip Card */}
                  {lastAssistantMsg.coachingTip && (
                    <div className="bg-slate-900/80 border border-orange-500/30 rounded-2xl p-3 text-xs space-y-2">
                      <div
                        onClick={() => setShowCoachDetails(prev => !prev)}
                        className="flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1.5 text-orange-300 font-bold">
                          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                          <span>AI Coach Tip</span>
                          <Badge variant="saffron" className="text-[10px] py-0 px-1.5">
                            {lastAssistantMsg.coachingTip.fluencyScore}% Fluency
                          </Badge>
                        </div>
                        {showCoachDetails ? <ChevronUp className="h-3.5 w-3.5 text-white/50" /> : <ChevronDown className="h-3.5 w-3.5 text-white/50" />}
                      </div>

                      {showCoachDetails && (
                        <div className="space-y-1.5 pt-1 text-[11px] animate-slide-up">
                          <p className="text-emerald-300">
                            <span className="font-semibold text-emerald-400">Better phrasing: </span>
                            "{lastAssistantMsg.coachingTip.improved}"
                          </p>
                          {lastAssistantMsg.coachingTip.explanationHindi && (
                            <p className="text-amber-200/80">
                              <span className="font-semibold text-amber-300">💡 Hint: </span>
                              {lastAssistantMsg.coachingTip.explanationHindi}
                            </p>
                          )}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => replayMessage(lastAssistantMsg.coachingTip!.improved, -98)}
                              className="glass border border-orange-400/40 text-orange-200 hover:text-white px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                            >
                              <Volume2 className="h-3 w-3 text-orange-400" />
                              Hear improved sentence
                            </button>
                            <button
                              onClick={() => {
                                setTextInput(lastAssistantMsg.coachingTip!.improved);
                                setShowInputDrawer(true);
                              }}
                              className="glass border border-white/20 text-white/80 hover:text-white px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="h-3 w-3 text-emerald-400" />
                              Practice saying this
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-2 text-xs text-white/40">
                  EduVaani will guide and gently coach your pronunciation after each sentence.
                </div>
              )}
            </div>

          </div>
        ) : (
          /* ============================================================== */
          /* TRANSCRIPT MODE: Full Chat & Study Log                         */
          /* ============================================================== */
          <div
            ref={chatRef}
            className="flex-grow overflow-y-auto px-2 py-4 space-y-4 scrollbar-thin max-w-2xl mx-auto w-full"
          >
            {chatHistory.length === 0 && (
              <div className="text-center py-16 text-white/50 space-y-2">
                <Sparkles className="h-8 w-8 text-orange-400 mx-auto animate-pulse" />
                <p className="font-semibold text-white">No messages yet.</p>
                <p className="text-xs">Tap the microphone to start your English conversation!</p>
              </div>
            )}

            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2.5 animate-slide-up ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 text-white shadow">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-md sm:max-w-lg rounded-2xl p-4 shadow-xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-br-sm'
                      : 'glass border border-white/15 text-white rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {/* Translation */}
                  {msg.translatedContent && msg.translatedContent !== msg.content && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 text-xs text-amber-200/90 flex items-start gap-1">
                      <Languages className="h-3 w-3 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{msg.translatedContent}</span>
                    </div>
                  )}

                  {/* Coaching Card */}
                  {msg.coachingTip && (
                    <div className="mt-3 pt-3 border-t border-white/15 bg-slate-950/70 rounded-xl p-3 border border-orange-500/25 space-y-1.5 text-xs text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-orange-300 font-bold flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-amber-400" /> Vaani Coaching
                        </span>
                        <Badge variant="saffron" className="text-[10px] py-0 px-1.5">
                          {msg.coachingTip.fluencyScore}%
                        </Badge>
                      </div>
                      <p className="text-emerald-300">
                        <span className="font-semibold text-emerald-400">Better: </span>
                        "{msg.coachingTip.improved}"
                      </p>
                      {msg.coachingTip.explanationHindi && (
                        <p className="text-amber-200/80 text-[11px]">
                          💡 {msg.coachingTip.explanationHindi}
                        </p>
                      )}
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => replayMessage(msg.coachingTip!.improved, 1000 + i)}
                          className="text-[10px] text-orange-300 hover:text-white glass border border-orange-400/30 px-2 py-0.5 rounded cursor-pointer"
                        >
                          🔊 Hear audio
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replay & Timestamp */}
                  <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-white/40 border-t border-white/5">
                    {msg.role === 'assistant' ? (
                      <button
                        onClick={() => replayMessage(msg.translatedContent || msg.content, i)}
                        className="text-orange-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="h-3 w-3" />
                        <span>Replay</span>
                      </button>
                    ) : <span />}
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FLOATING ACTION DOCK */}
      <footer className="relative z-30 px-4 pb-4 pt-1">
        <div className="max-w-xl mx-auto space-y-2.5">
          {/* Quick suggested phrases */}
          {activeScenario && activeScenario.suggestedPhrases && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin px-1">
              <span className="text-[11px] text-orange-300 font-semibold flex-shrink-0">Quick reply:</span>
              {activeScenario.suggestedPhrases.slice(0, 3).map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => processUserMessage(phrase)}
                  disabled={status === 'processing' || status === 'speaking'}
                  className="flex-shrink-0 text-[11px] glass border border-orange-400/30 hover:border-orange-400 text-orange-100 px-2.5 py-1 rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          )}

          {/* Slide-out text input drawer */}
          {showInputDrawer && (
            <form onSubmit={handleTextSubmit} className="flex items-center gap-2 animate-slide-up">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your message in English..."
                disabled={status === 'processing' || status === 'speaking'}
                className="flex-grow glass border border-white/20 focus:border-orange-400 rounded-2xl px-4 py-2 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none transition-colors"
                autoFocus
              />
              <Button
                type="submit"
                disabled={!textInput.trim() || status === 'processing' || status === 'speaking'}
                size="sm"
                variant="glow"
                className="rounded-2xl text-xs h-9"
              >
                <Send className="h-3.5 w-3.5 mr-1" />
                Send
              </Button>
            </form>
          )}

          {/* Main Floating Control Pill */}
          <div className="glass border border-white/15 rounded-full p-2 flex items-center justify-between shadow-2xl backdrop-blur-2xl">
            {/* Speed toggle */}
            <button
              onClick={toggleSpeechSpeed}
              title="Toggle speech pace"
              className="glass border border-white/15 text-white/80 hover:text-white rounded-full px-3 py-1.5 text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <Gauge className="h-3 w-3 text-orange-400" />
              <span>{speechRate === 0.85 ? '0.85x' : '1.0x'}</span>
            </button>

            {/* Keyboard input drawer toggle */}
            <button
              onClick={() => setShowInputDrawer(prev => !prev)}
              className={`rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                showInputDrawer ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'text-white/70 hover:text-white'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{showInputDrawer ? 'Hide Text' : 'Type Message'}</span>
            </button>

            {/* Main Microphone Button */}
            <button
              onClick={status === 'listening' ? stopAll : handleVoiceInput}
              disabled={status === 'processing' || status === 'speaking'}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ${
                status === 'listening'
                  ? 'bg-red-500 animate-pulse scale-105 shadow-red-500/50'
                  : 'bg-gradient-to-tr from-orange-500 to-amber-500 hover:scale-105 active:scale-95 shadow-orange-500/40'
              }`}
              title="Speak into microphone"
            >
              <Mic className="h-5 w-5" />
            </button>

            {/* Stop audio button */}
            <button
              onClick={stopAll}
              title="Stop listening or speaking"
              className="text-white/60 hover:text-white px-3 py-1.5 text-xs cursor-pointer transition-colors"
            >
              ⏹ Stop
            </button>

            {/* Finish session button */}
            <Button
              onClick={handleFinishSession}
              variant="outline"
              size="sm"
              className="text-xs border-orange-500/40 text-orange-300 hover:bg-orange-500/20 rounded-full h-8 px-3"
            >
              <PartyPopper className="h-3 w-3 mr-1" />
              Finish
            </Button>
          </div>
        </div>
      </footer>

      {/* Mic Diagnostic Modal */}
      <MicDiagnosticModal
        isOpen={isMicDiagOpen}
        onClose={() => setIsMicDiagOpen(false)}
      />
    </div>
  );
}

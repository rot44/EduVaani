import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Bot, User, X, BrainCircuit, Languages, Zap, Sparkles, Send, Gauge, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService, SpeechService } from '../lib/speech';
import { sarvamService } from '../lib/sarvam';
import { aiService, ROLEPLAY_SCENARIOS, type ChatMessage } from '../lib/ai';
import { translationService } from '../lib/translation';
import { LanguageSelector } from './LanguageSelector';
import { AudioWaveVisualizer } from './AudioWaveVisualizer';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

type TutorStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

interface VoiceTutorProps {
  autoStartMode?: string | null;
  onEnd?: () => void;
}

// The animated speaking orb with interactive state machine
function VaaniOrb({
  status,
  onClick,
  disabled
}: {
  status: TutorStatus;
  onClick: () => void;
  disabled: boolean;
}) {
  const configs: Record<TutorStatus, { icon: React.ReactNode; gradient: string; label: string; animation: string }> = {
    idle: {
      icon: <Sparkles className="h-12 w-12 text-white" />,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      label: '✨ बोलिए / Tap to Speak',
      animation: 'animate-breathe'
    },
    listening: {
      icon: <Mic className="h-12 w-12 text-white animate-pulse" />,
      gradient: 'from-red-500 to-rose-600',
      label: '🎤 सुन रहा हूँ... Listening to You',
      animation: 'animate-pulse'
    },
    processing: {
      icon: <BrainCircuit className="h-12 w-12 text-white animate-smooth-spin" />,
      gradient: 'from-amber-400 to-yellow-500',
      label: '🧠 सोच रहा हूँ... Thinking',
      animation: 'animate-breathe'
    },
    speaking: {
      icon: <Volume2 className="h-12 w-12 text-white animate-bounce" />,
      gradient: 'from-emerald-500 to-teal-600',
      label: '🔊 बोल रहा हूँ... Speaking',
      animation: 'animate-pulse-glow'
    },
    error: {
      icon: <Zap className="h-12 w-12 text-white" />,
      gradient: 'from-gray-500 to-slate-600',
      label: '😅 दोबारा कोशिश करें / Try Again',
      animation: ''
    },
  };
  const cfg = configs[status];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Live Audio Visualizer Wave */}
      <AudioWaveVisualizer
        isActive={status === 'speaking' || status === 'listening' || status === 'processing'}
        status={status}
      />

      <div className="relative">
        {/* Outer radial ambient glow */}
        <div className={`absolute -inset-4 rounded-full bg-gradient-to-br ${cfg.gradient} opacity-25 blur-2xl ${cfg.animation}`} />
        
        {/* Ripple waves while listening */}
        {status === 'listening' && (
          <>
            <div className="absolute inset-0 w-36 h-36 rounded-full border-2 border-red-400/60 animate-ripple-out" />
            <div className="absolute inset-0 w-36 h-36 rounded-full border border-red-300/40 animate-ripple-out" style={{ animationDelay: '0.6s' }} />
          </>
        )}

        {/* Main button orb */}
        <button
          onClick={onClick}
          disabled={disabled}
          title={status === 'listening' ? 'Tap to finish speaking' : 'Tap to speak'}
          className={`relative w-36 h-36 rounded-full bg-gradient-to-br ${cfg.gradient} text-white
            shadow-2xl transition-all duration-300 ease-out transform
            ${disabled ? 'cursor-not-allowed opacity-75' : 'hover:scale-105 active:scale-95 cursor-pointer shadow-orange-500/30'}
            border-2 border-white/30 ${cfg.animation}`}
        >
          {/* Top light reflection */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-t from-transparent via-white/10 to-white/30 pointer-events-none" />
          
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {cfg.icon}
          </div>
        </button>
      </div>

      <div className="glass border border-white/15 rounded-full px-5 py-1.5 text-center shadow-lg backdrop-blur-md">
        <p className="text-white text-xs sm:text-sm font-semibold tracking-wide">{cfg.label}</p>
      </div>
    </div>
  );
}

export default function VoiceTutor({ autoStartMode, onEnd }: VoiceTutorProps) {
  const [status, setStatus] = useState<TutorStatus>('idle');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [sessionTitle, setSessionTitle] = useState('Free Chat');
  const [textInput, setTextInput] = useState('');
  const [activeScenario, setActiveScenario] = useState<(typeof ROLEPLAY_SCENARIOS)[0] | null>(null);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState<number | null>(null);
  const [voiceEngine, setVoiceEngine] = useState<'sarvam' | 'browser'>(speechService.getVoiceEngine());
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsSpeechSupported(SpeechService.isSupported());
    return () => {
      speechService.stopListening();
      speechService.stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory, status]);

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    speechService.setLanguage(code);
  };

  const toggleSpeechSpeed = () => {
    setSpeechRate(prev => (prev === 0.85 ? 1.0 : 0.85));
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const startSession = async (mode: string) => {
    try {
      setError(null);
      setStatus('processing');
      let welcome: string;
      if (mode === 'free-flow') {
        welcome = await aiService.startFreeFlowChat();
        setSessionTitle('Free Chat 💬');
        setActiveScenario(null);
      } else {
        welcome = await aiService.startRoleplay(mode);
        const scenario = ROLEPLAY_SCENARIOS.find(s => s.id === mode);
        if (scenario) {
          setActiveScenario(scenario);
          setSessionTitle(`${scenario.emoji} ${scenario.title}`);
        } else {
          setSessionTitle('Roleplay');
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
      setError('Could not connect to AI service. Please verify your internet or API key.');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (autoStartMode && isSpeechSupported) {
      startSession(autoStartMode);
    }
  }, [autoStartMode, isSpeechSupported]);

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

      // Celebrate every 4 student turns!
      const userMessageCount = history.filter(m => m.role === 'user').length;
      if (userMessageCount > 0 && userMessageCount % 4 === 0) {
        triggerCelebration();
      }

      setStatus('speaking');
      await speechService.speak(messageToSpeak, speechRate);
      setStatus('idle');
    } catch {
      setError('Failed to generate response. Please try again!');
      setStatus('idle');
    }
  };

  const handleVoiceInput = async () => {
    if (!isSpeechSupported) {
      setError('Voice not supported in this browser. You can type below!');
      setStatus('error');
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
      setError('Could not hear clearly. Try again or type below!');
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

  if (!isSpeechSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-6">
        <div className="glass border border-orange-500/30 rounded-3xl p-10 text-center max-w-md shadow-2xl">
          <div className="text-6xl mb-4 animate-bounce">🌐</div>
          <h3 className="text-2xl font-bold text-white mb-3">Speech Engine Unavailable</h3>
          <p className="text-white/60 mb-6 text-sm leading-relaxed">
            Please use Google Chrome, Microsoft Edge, or a browser with Web Speech API support for live voice recognition.
          </p>
          <Button onClick={onEnd} variant="glow" size="lg">
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/30">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-12 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-gentle-float" />
        <div className="absolute bottom-20 right-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 glass border-b border-white/10 px-4 sm:px-6 py-3.5 shadow-xl backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white font-display">{sessionTitle}</h2>
              <Badge variant="saffron" className="text-[10px] hidden sm:inline-flex">
                Live AI Tutor
              </Badge>
            </div>
            <p className="text-xs text-orange-200/60 font-medium">EduVaani • Spoken English Practice</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Sarvam AI vs Browser Engine Toggle */}
            {sarvamService.isConfigured() && (
              <button
                onClick={() => {
                  const next = speechService.getVoiceEngine() === 'sarvam' ? 'browser' : 'sarvam';
                  speechService.setVoiceEngine(next);
                  setVoiceEngine(next);
                }}
                className={`border rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  voiceEngine === 'sarvam'
                    ? 'border-orange-500/60 bg-orange-500/20 text-orange-200 shadow'
                    : 'glass border-white/15 text-white/70 hover:text-white'
                }`}
              >
                {voiceEngine === 'sarvam' ? '🇮🇳 Sarvam (Bulbul)' : '🌐 Browser TTS'}
              </button>
            )}

            {/* Speed toggle */}
            <button
              onClick={toggleSpeechSpeed}
              title="Toggle speech pace"
              className="glass border border-white/15 text-white/80 hover:text-white rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all hover:border-orange-400/40"
            >
              <Gauge className="h-3.5 w-3.5 text-orange-400" />
              <span>{speechRate === 0.85 ? '🐢 0.85x' : '⚡ 1.0x'}</span>
            </button>

            {/* Language dropdown */}
            <LanguageSelector currentLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />

            {/* Stop audio button */}
            <button
              onClick={stopAll}
              title="Stop listening or speaking"
              className="glass border border-white/15 text-white/70 hover:text-white rounded-full px-3 py-1.5 text-xs transition-colors"
            >
              ⏹ Stop
            </button>

            {/* Finish session button */}
            <Button
              onClick={handleFinishSession}
              variant="outline"
              size="sm"
              className="text-xs border-orange-500/40 text-orange-300 hover:bg-orange-500/20 rounded-full"
            >
              <PartyPopper className="h-3.5 w-3.5 mr-1" />
              Finish
            </Button>

            {/* Close session */}
            <button
              onClick={() => { stopAll(); if (onEnd) onEnd(); }}
              title="Exit"
              className="glass border border-white/15 text-white/70 hover:text-white hover:border-red-400/50 rounded-full p-2 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages Log */}
      <div
        ref={chatRef}
        className="flex-grow overflow-y-auto px-4 py-6 pb-72 max-w-3xl mx-auto w-full space-y-4 scrollbar-thin relative z-10"
      >
        {chatHistory.length === 0 && status === 'idle' && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
              <Sparkles className="h-10 w-10 text-orange-300 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-display">Ready for English Practice!</h3>
            <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
              Tap the glowing microphone orb below to speak, or pick one of the sample phrases to start your conversation.
            </p>
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-3 animate-slide-up ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-md sm:max-w-lg rounded-2xl p-4 shadow-xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-orange-500 via-amber-600 to-orange-600 text-white rounded-br-sm'
                  : 'glass border border-white/15 text-white rounded-bl-sm'
              }`}
            >
              <p className="leading-relaxed text-sm whitespace-pre-wrap">{msg.content}</p>

              {/* Translation card */}
              {msg.translatedContent && msg.translatedContent !== msg.content && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center gap-1.5 text-orange-200/80 text-xs mb-1 font-medium">
                    <Languages className="h-3 w-3" /> अनुवाद / Translation
                  </div>
                  <p className="text-xs text-amber-200 font-medium leading-relaxed">{msg.translatedContent}</p>
                </div>
              )}

              {/* Footer with Replay & Timestamp */}
              <div className="flex items-center justify-between mt-2 pt-1 text-xs text-white/50 border-t border-white/5">
                {msg.role === 'assistant' ? (
                  <button
                    onClick={() => replayMessage(msg.translatedContent || msg.content, i)}
                    className="flex items-center gap-1 text-orange-300 hover:text-orange-200 transition-colors font-medium cursor-pointer"
                    title="Listen to pronunciation again"
                  >
                    <Volume2 className={`h-3.5 w-3.5 ${currentlyPlayingIndex === i ? 'animate-bounce text-emerald-400' : ''}`} />
                    <span>{currentlyPlayingIndex === i ? 'Playing...' : 'Hear pronunciation'}</span>
                  </button>
                ) : <span />}
                <span className="text-[11px]">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {error && (
          <div className="glass border border-red-400/40 bg-red-500/10 rounded-2xl p-4 text-center animate-slide-up">
            <p className="text-red-300 text-sm flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" /> {error}
            </p>
          </div>
        )}
      </div>

      {/* Floating Bottom Dock */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-8 pb-5 px-4 pointer-events-auto">
          <div className="max-w-2xl mx-auto space-y-3">

            {/* Quick suggested conversation phrases */}
            {activeScenario && activeScenario.suggestedPhrases && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <Badge variant="saffron" className="flex-shrink-0 text-[11px]">
                  💡 Quick reply:
                </Badge>
                {activeScenario.suggestedPhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => processUserMessage(phrase)}
                    disabled={status === 'processing' || status === 'speaking'}
                    className="flex-shrink-0 text-xs glass border border-orange-400/30 hover:border-orange-400 text-orange-100 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            )}

            {/* Text Input Fallback Bar */}
            <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type in English (or tap the voice orb below)..."
                disabled={status === 'processing' || status === 'speaking'}
                className="flex-grow glass border border-white/20 focus:border-orange-400 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none transition-colors shadow-inner"
              />
              <Button
                type="submit"
                disabled={!textInput.trim() || status === 'processing' || status === 'speaking'}
                size="icon"
                variant="glow"
                className="rounded-2xl flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {/* Center Glowing Voice Orb */}
            <div className="flex justify-center pt-1">
              <VaaniOrb
                status={status}
                onClick={status === 'listening' ? stopAll : handleVoiceInput}
                disabled={status === 'processing' || status === 'speaking'}
              />
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Mic, ArrowDown, Bot } from 'lucide-react';
import type { ChatMessage } from '../../lib/ai';
import type { TutorStatus } from './VaaniOrb';
import { MessageBubble } from './MessageBubble';
import { Button } from '../ui/button';

export interface TranscriptViewProps {
  chatHistory: ChatMessage[];
  chatRef: React.RefObject<HTMLDivElement | null>;
  currentlyPlayingIndex: number | null;
  onReplay: (text: string, index: number) => void;
  onPracticeText: (text: string) => void;
  onStartSpeaking: () => void;
  status?: TutorStatus;
  interimSpeech?: string;
}

export function TranscriptView({
  chatHistory,
  chatRef,
  currentlyPlayingIndex,
  onReplay,
  onPracticeText,
  onStartSpeaking,
  status = 'idle',
  interimSpeech = '',
}: TranscriptViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Smooth scroll to the latest message
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    } else if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior,
      });
    }
  }, [chatRef]);

  // Track scroll position to know if student intentionally scrolled up to read past history
  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const nearBottom = distanceFromBottom < 100;
    setIsNearBottom(nearBottom);
    if (nearBottom) {
      setUnreadCount(0);
    }
  };

  // Auto-scroll when chat history updates
  useEffect(() => {
    if (isNearBottom) {
      const timer = setTimeout(() => {
        scrollToBottom('smooth');
      }, 60);
      return () => clearTimeout(timer);
    } else {
      setUnreadCount((prev) => prev + 1);
    }
  }, [chatHistory.length, isNearBottom, scrollToBottom]);

  // Auto-scroll when status becomes processing (showing typing bubble) or speech updates
  useEffect(() => {
    if (isNearBottom && (status === 'processing' || interimSpeech)) {
      scrollToBottom('smooth');
    }
  }, [status, interimSpeech, isNearBottom, scrollToBottom]);

  // Initial scroll to bottom on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom('auto');
    }, 100);
    return () => clearTimeout(timer);
  }, [scrollToBottom]);

  return (
    <div className="relative flex-1 min-h-0 h-full w-full flex flex-col">
      {/* Scrollable Message List */}
      <div
        ref={chatRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-4 py-4 space-y-4 scrollbar-thin max-w-2xl mx-auto w-full scroll-smooth pb-12"
      >
        {/* Empty State */}
        {chatHistory.length === 0 && (
          <div className="text-center py-16 text-deep-brown/60 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8 animate-pulse" />
            </div>
            <h3 className="font-bold text-deep-brown text-base font-display">
              No messages yet
            </h3>
            <p className="text-xs text-deep-brown/70 max-w-sm mx-auto">
              Tap the microphone or press Start Speaking to begin your conversation with EduVaani!
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onStartSpeaking}
                className="rounded-full shadow-warm-sm"
              >
                <Mic className="h-4 w-4 mr-1.5" />
                Start Speaking
              </Button>
            </div>
          </div>
        )}

        {/* Message Stream */}
        {chatHistory.map((msg, idx) => (
          <MessageBubble
            key={idx}
            message={msg}
            index={idx}
            currentlyPlayingIndex={currentlyPlayingIndex}
            onReplay={onReplay}
            onPracticeText={onPracticeText}
          />
        ))}

        {/* Live Interim Speech Bubble (while student is actively speaking) */}
        {status === 'listening' && interimSpeech && (
          <div className="flex justify-end animate-slide-up">
            <div className="bg-warm-sand/50 border border-warm-sand rounded-3xl rounded-tr-sm px-4 py-3 max-w-[85%] sm:max-w-[75%] shadow-warm-sm">
              <div className="flex items-center gap-1.5 text-xs text-terracotta font-medium mb-1">
                <span className="w-2 h-2 rounded-full bg-soft-coral animate-ping" />
                <span>Listening live...</span>
              </div>
              <p className="text-sm text-deep-brown italic">
                &quot;{interimSpeech}&quot;
              </p>
            </div>
          </div>
        )}

        {/* AI Thinking / Typing Indicator Bubble */}
        {status === 'processing' && (
          <div className="flex justify-start animate-slide-up">
            <div className="bg-warm-ivory border border-warm-sand rounded-3xl rounded-tl-sm px-4 py-3 shadow-warm-sm flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-terracotta to-turmeric flex items-center justify-center text-cream-white shadow-xs">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-deep-brown/80 font-medium font-sans">
                  EduVaani is thinking
                </span>
                <span className="flex items-center gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} className="h-2 flex-shrink-0" />
      </div>

      {/* Floating Jump to Latest Button when user scrolled up */}
      {!isNearBottom && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 animate-slide-up pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              scrollToBottom('smooth');
              setIsNearBottom(true);
              setUnreadCount(0);
            }}
            className="bg-warm-ivory/95 border border-warm-sand hover:border-terracotta text-deep-brown hover:text-terracotta shadow-warm-md rounded-full px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Scroll to newest messages"
          >
            <ArrowDown className="h-3.5 w-3.5 text-terracotta animate-bounce" />
            <span>Jump to latest</span>
            {unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-terracotta text-cream-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

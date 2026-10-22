import React from 'react';
import { Sparkles, Mic } from 'lucide-react';
import type { ChatMessage } from '../../lib/ai';
import { MessageBubble } from './MessageBubble';
import { Button } from '../ui/button';

export interface TranscriptViewProps {
  chatHistory: ChatMessage[];
  chatRef: React.RefObject<HTMLDivElement | null>;
  currentlyPlayingIndex: number | null;
  onReplay: (text: string, index: number) => void;
  onPracticeText: (text: string) => void;
  onStartSpeaking: () => void;
}

export function TranscriptView({
  chatHistory,
  chatRef,
  currentlyPlayingIndex,
  onReplay,
  onPracticeText,
  onStartSpeaking,
}: TranscriptViewProps) {
  return (
    <div
      ref={chatRef}
      className="flex-grow overflow-y-auto px-2 py-4 space-y-4 scrollbar-thin max-w-2xl mx-auto w-full"
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
    </div>
  );
}

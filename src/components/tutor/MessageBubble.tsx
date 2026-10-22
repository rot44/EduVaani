import { Bot, User, Volume2, Languages } from 'lucide-react';
import type { ChatMessage } from '../../lib/ai';
import { CoachingCard } from './CoachingCard';

export interface MessageBubbleProps {
  message: ChatMessage;
  index: number;
  currentlyPlayingIndex: number | null;
  onReplay: (text: string, index: number) => void;
  onPracticeText?: (text: string) => void;
}

export function MessageBubble({
  message,
  index,
  currentlyPlayingIndex,
  onReplay,
  onPracticeText,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isCurrentlyPlaying = currentlyPlayingIndex === index;

  return (
    <div
      className={`flex items-end gap-2.5 animate-slide-up ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-terracotta to-turmeric flex items-center justify-center flex-shrink-0 text-cream-white shadow-warm-sm">
          <Bot className="h-4 w-4" />
        </div>
      )}

      {/* Bubble Container: user = terracotta fill, white text. Assistant = warm ivory, deep brown text, warm sand border */}
      <div
        className={`max-w-md sm:max-w-lg rounded-2xl p-4 shadow-warm-sm ${
          isUser
            ? 'bg-terracotta text-cream-white rounded-br-sm'
            : 'bg-warm-ivory text-deep-brown border border-warm-sand rounded-bl-sm'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
          {message.content}
        </p>

        {/* Vernacular Translation */}
        {message.translatedContent && message.translatedContent !== message.content && (
          <div
            className={`mt-2.5 pt-2 border-t text-xs flex items-start gap-1 font-medium ${
              isUser
                ? 'border-cream-white/20 text-cream-white/90'
                : 'border-warm-sand text-peacock-teal'
            }`}
          >
            <Languages className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span>{message.translatedContent}</span>
          </div>
        )}

        {/* AI Coaching Tip Card */}
        {message.coachingTip && (
          <div className="mt-3 pt-3 border-t border-warm-sand">
            <CoachingCard
              coachingTip={message.coachingTip}
              onReplayImproved={() => onReplay(message.coachingTip!.improved, 1000 + index)}
              onPracticeImproved={() => onPracticeText && onPracticeText(message.coachingTip!.improved)}
              isCollapsible={false}
            />
          </div>
        )}

        {/* Footer: Replay & Timestamp */}
        <div
          className={`flex items-center justify-between mt-2 pt-1.5 text-[11px] border-t ${
            isUser
              ? 'border-cream-white/20 text-cream-white/70'
              : 'border-warm-sand/60 text-deep-brown/50'
          }`}
        >
          {!isUser ? (
            <button
              type="button"
              onClick={() => onReplay(message.translatedContent || message.content, index)}
              className="text-terracotta hover:text-terracotta-hover flex items-center gap-1 cursor-pointer font-semibold transition-colors"
              title="Replay pronunciation"
            >
              <Volume2
                className={`h-3.5 w-3.5 ${
                  isCurrentlyPlaying ? 'animate-bounce text-peacock-teal' : ''
                }`}
              />
              <span>Replay</span>
            </button>
          ) : (
            <span />
          )}

          <span className="font-mono text-[10px]">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-turmeric/30 border border-turmeric text-deep-brown flex items-center justify-center flex-shrink-0 shadow-warm-sm">
          <User className="h-4 w-4 text-deep-brown" />
        </div>
      )}
    </div>
  );
}

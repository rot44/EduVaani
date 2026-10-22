import { useEffect, useRef } from 'react';
import { X, Calendar, Clock, MessageSquare, Lightbulb, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { SavedSession } from '../../lib/multimodal';

interface SessionTranscriptModalProps {
  session: SavedSession | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export function SessionTranscriptModal({
  session,
  isOpen,
  onClose,
  onDelete,
}: SessionTranscriptModalProps) {
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      triggerElementRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
          return;
        }

        // Focus trap
        if (e.key === 'Tab' && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen || !session) return null;

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case 'voice':
        return (
          <Badge variant="terracotta" className="text-xs">
            🎙️ Voice Session
          </Badge>
        );
      case 'sign':
        return (
          <Badge variant="teal" className="text-xs">
            🤟 Sign Language
          </Badge>
        );
      case 'text':
        return (
          <Badge variant="turmeric" className="text-xs">
            💬 Text Chat
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs border-peacock-teal text-peacock-teal bg-peacock-teal/10">
            ✨ Multimodal
          </Badge>
        );
    }
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'voice':
        return <span className="text-[10px] text-terracotta font-semibold">🎙️ Spoken</span>;
      case 'sign':
        return <span className="text-[10px] text-peacock-teal font-semibold">🤟 Signed</span>;
      case 'text':
        return <span className="text-[10px] text-turmeric font-semibold">💬 Typed</span>;
      default:
        return null;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-transcript-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-brown/60 backdrop-blur-xs animate-fade-in"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="bg-cream-white w-full max-w-2xl rounded-3xl shadow-2xl border border-warm-sand overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-warm-ivory border-b border-warm-sand/80 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              {getModeBadge(session.primaryMode)}
              <span className="text-xs text-deep-brown/60 flex items-center gap-1 font-mono">
                <Calendar className="h-3 w-3" />
                {session.date}
              </span>
            </div>
            <h2 id="session-transcript-title" className="text-xl sm:text-2xl font-extrabold text-deep-brown font-display">
              {session.scenarioTitle}
            </h2>
            <div className="flex items-center gap-3 text-xs text-deep-brown/70 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-peacock-teal" />
                {session.durationMinutes} min practice
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5 text-terracotta" />
                {session.messages.length} messages
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-deep-brown/60 hover:text-deep-brown hover:bg-warm-sand/50 transition-colors cursor-pointer"
            aria-label="Close transcript modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Transcript Conversation Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-warm-sand/10">
          {session.messages.length === 0 ? (
            <div className="text-center py-12 text-sm text-deep-brown/60">
              No message logs recorded for this session.
            </div>
          ) : (
            session.messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id || idx}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  {/* Sender Metadata Bar */}
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-xs font-bold text-deep-brown/75 font-display">
                      {isUser ? 'You' : 'Vaani (Tutor)'}
                    </span>
                    {getSourceIcon(msg.source)}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
                      isUser
                        ? 'bg-terracotta text-cream-white rounded-tr-xs'
                        : 'bg-warm-ivory text-deep-brown border border-warm-sand rounded-tl-xs'
                    }`}
                  >
                    <p className="font-medium whitespace-pre-wrap">{msg.content}</p>

                    {/* Regional Translation */}
                    {msg.translatedContent && (
                      <div
                        className={`mt-2 pt-2 text-xs border-t ${
                          isUser
                            ? 'border-cream-white/20 text-cream-white/90'
                            : 'border-warm-sand text-deep-brown/80'
                        }`}
                      >
                        <span className="font-semibold mr-1">Translation:</span>
                        {msg.translatedContent}
                      </div>
                    )}

                    {/* AI Coaching Tip */}
                    {msg.coachingTip && !isUser && (
                      <div className="mt-3 p-3 rounded-xl bg-peacock-teal/10 border border-peacock-teal/25 text-xs text-deep-brown space-y-1.5">
                        <div className="flex items-center justify-between font-bold text-peacock-teal">
                          <div className="flex items-center gap-1">
                            <Lightbulb className="h-3.5 w-3.5" />
                            <span>Coaching Tip</span>
                          </div>
                          {msg.coachingTip.fluencyScore !== undefined && (
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-peacock-teal/20 text-peacock-teal">
                              Score: {msg.coachingTip.fluencyScore}/10
                            </span>
                          )}
                        </div>
                        {msg.coachingTip.improved && (
                          <p>
                            <span className="font-semibold text-peacock-teal">Better way: </span>
                            &ldquo;{msg.coachingTip.improved}&rdquo;
                          </p>
                        )}
                        {msg.coachingTip.explanationHindi && (
                          <p className="text-terracotta font-medium">
                            🇮🇳 {msg.coachingTip.explanationHindi}
                          </p>
                        )}
                        {msg.coachingTip.rule && (
                          <p className="text-deep-brown/70 italic text-[11px]">
                            Rule: {msg.coachingTip.rule}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-warm-ivory border-t border-warm-sand/80 flex items-center justify-between gap-3">
          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete(session.id);
                handleClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 min-h-[44px] text-xs font-semibold text-terracotta hover:bg-terracotta/10 rounded-xl transition-colors cursor-pointer"
              aria-label="Delete practice session log"
            >
              <Trash2 className="h-4 w-4" />
              Delete Log
            </button>
          ) : (
            <div />
          )}

          <Button
            variant="primary"
            onClick={handleClose}
            aria-label="Close session transcript"
            className="px-6 min-h-[44px] shadow-warm-sm"
          >
            Close Transcript
          </Button>
        </div>
      </div>
    </div>
  );
}

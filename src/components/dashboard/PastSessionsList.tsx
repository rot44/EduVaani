import { useState, useEffect } from 'react';
import { History, Calendar, Clock, MessageSquare, Eye, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { multimodalManager, type SavedSession } from '../../lib/multimodal';
import { SessionTranscriptModal } from './SessionTranscriptModal';

interface PastSessionsListProps {
  onStartVoiceSession?: () => void;
}

export function PastSessionsList({ onStartVoiceSession }: PastSessionsListProps) {
  const [sessions, setSessions] = useState<SavedSession[]>(() =>
    multimodalManager.getSavedSessions()
  );
  const [selectedSession, setSelectedSession] = useState<SavedSession | null>(null);

  useEffect(() => {
    return multimodalManager.subscribe(() => {
      setSessions(multimodalManager.getSavedSessions());
    });
  }, []);

  const handleDeleteSession = (id: string) => {
    if (window.confirm('Are you sure you want to delete this session transcript?')) {
      multimodalManager.deleteSavedSession(id);
      setSessions(multimodalManager.getSavedSessions());
      if (selectedSession?.id === id) {
        setSelectedSession(null);
      }
    }
  };

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case 'voice':
        return (
          <Badge variant="terracotta" className="text-xs">
            🎙️ Voice
          </Badge>
        );
      case 'sign':
        return (
          <Badge variant="teal" className="text-xs">
            🤟 Sign
          </Badge>
        );
      case 'text':
        return (
          <Badge variant="turmeric" className="text-xs">
            💬 Text
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs border-peacock-teal text-peacock-teal bg-peacock-teal/10 font-bold">
            ✨ Multimodal
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 sm:p-8 shadow-warm space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-terracotta/15 text-terracotta flex items-center justify-center">
            <History className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-deep-brown font-display">
                Past Practice Sessions
              </h3>
              {sessions.length > 0 && (
                <Badge variant="terracotta" className="text-xs font-bold">
                  {sessions.length}
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-deep-brown/65">
              Review completed conversation transcripts across Voice, Text, and Indian Sign Language.
            </p>
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="flex items-center gap-2">
            <Link
              to="/sign-tutor"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-warm-sand bg-cream-white hover:border-peacock-teal text-xs font-semibold text-deep-brown hover:text-peacock-teal transition-all shadow-xs"
            >
              <span>🤟 Sign Studio</span>
            </Link>
          </div>
        )}
      </div>

      {/* Sessions Grid or Empty State */}
      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-warm-sand bg-cream-white p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-warm-sand/50 text-deep-brown/70 mx-auto flex items-center justify-center text-2xl">
            🎙️
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="font-bold text-base text-deep-brown font-display">
              Your conversation history will appear here.
            </h4>
            <p className="text-xs text-deep-brown/75 leading-relaxed">
              Complete your first English speaking call or practice signs in the SignBridge Studio. Your conversations and coaching tips will automatically be archived here.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            {onStartVoiceSession && (
              <Button
                variant="primary"
                onClick={onStartVoiceSession}
                className="text-xs px-4 shadow-warm-sm"
              >
                🎙️ Start Free Chat
              </Button>
            )}
            <Link
              to="/sign-tutor"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-peacock-teal text-cream-white hover:bg-peacock-teal/90 text-xs font-bold shadow-xs transition-colors"
            >
              <span>🤟 Practice Signs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="rounded-2xl border border-warm-sand bg-cream-white p-5 shadow-xs hover:shadow-warm transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  {getModeBadge(sess.primaryMode)}
                  <span className="text-[11px] text-deep-brown/60 font-mono flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {sess.date}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-deep-brown font-display group-hover:text-terracotta transition-colors line-clamp-1">
                    {sess.scenarioTitle}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-deep-brown/65 font-medium mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-peacock-teal" />
                      {sess.durationMinutes} min
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-terracotta" />
                      {sess.messages.length} msgs
                    </span>
                  </div>
                </div>

                {/* Snippet of latest message */}
                {sess.messages.length > 0 && (
                  <p className="text-xs text-deep-brown/70 italic line-clamp-2 bg-warm-ivory p-2.5 rounded-xl border border-warm-sand/70">
                    &ldquo;{sess.messages[sess.messages.length - 1].content}&rdquo;
                  </p>
                )}
              </div>

              {/* Card Actions */}
              <div className="pt-2 border-t border-warm-sand/80 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSession(sess)}
                  className="text-xs flex-1 justify-center py-1.5 h-auto rounded-xl hover:border-terracotta hover:text-terracotta"
                >
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  View Transcript
                </Button>

                <button
                  type="button"
                  onClick={() => handleDeleteSession(sess.id)}
                  className="p-2 text-deep-brown/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete Session Log"
                  aria-label="Delete Session Log"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Read-Only Transcript Dialog */}
      <SessionTranscriptModal
        session={selectedSession}
        isOpen={Boolean(selectedSession)}
        onClose={() => setSelectedSession(null)}
        onDelete={handleDeleteSession}
      />
    </div>
  );
}

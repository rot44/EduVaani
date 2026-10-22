/**
 * ============================================================================
 * EduVaani Multimodal Communication Manager
 * ============================================================================
 * 
 * Central hub coordinating:
 * - Input modes: 'voice' | 'text' | 'sign'
 * - Output modes: 'voice' | 'text' | 'sign' | 'all'
 * - Shared, unified conversation context between VoiceTutor and SignLanguageTutor
 * - Intelligent fallbacks (low-confidence sign corrections, audio pronunciation for unmapped signs, typing/sign fallback for voice errors)
 * - Session persistence to localStorage with read-only review support
 * 
 * Wraps existing services (aiService, speechService, translationService,
 * sarvamService, textToSignSequence) without replacing them.
 * ============================================================================
 */

import { aiService, type CoachingTip, type RoleplayScenario } from './ai';
import { speechService } from './speech';
import { translationService } from './translation';
import { textToSignSequence, type SignSequence } from './signGeneration';

export type InputMode = 'voice' | 'text' | 'sign';
export type OutputMode = 'voice' | 'text' | 'sign' | 'all';

export interface UnifiedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source: InputMode;
  timestamp: Date;
  translatedContent?: string;
  coachingTip?: CoachingTip;
  signSequence?: SignSequence[];
}

export interface SavedSession {
  id: string;
  date: string;
  durationMinutes: number;
  messages: Array<Omit<UnifiedMessage, 'timestamp'> & { timestamp: string }>;
  primaryMode: InputMode | 'mixed';
  scenarioTitle: string;
  scenarioId?: string;
}

type StateListener = () => void;

const SESSIONS_STORAGE_KEY = 'eduvaani_past_sessions';

class MultimodalCommunicationManager {
  private history: UnifiedMessage[] = [];
  private inputMode: InputMode = 'voice';
  private outputMode: OutputMode = 'all';
  private listeners: Set<StateListener> = new Set();

  constructor() {}

  // --- Mode State Management ---

  getInputMode(): InputMode {
    return this.inputMode;
  }

  setInputMode(mode: InputMode): void {
    if (this.inputMode !== mode) {
      this.inputMode = mode;
      this.notifyListeners();
    }
  }

  getOutputMode(): OutputMode {
    return this.outputMode;
  }

  setOutputMode(mode: OutputMode): void {
    if (this.outputMode !== mode) {
      this.outputMode = mode;
      this.notifyListeners();
    }
  }

  // --- Conversation History ---

  getConversationHistory(): UnifiedMessage[] {
    return [...this.history];
  }

  clearConversation(): void {
    this.history = [];
    aiService.clearHistory();
    this.notifyListeners();
  }

  // --- Subscriptions ---

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.warn('Multimodal listener error:', err);
      }
    });
  }

  // --- Core Message Dispatcher ---

  /**
   * Routes user input from any mode (voice, text, or sign) into the AI conversation
   * and prepares appropriate multimodal outputs (audio, text, ISL signs).
   */
  async sendMessage(
    text: string,
    source: InputMode,
    options?: {
      targetLanguage?: string;
      speechRate?: number;
      scenario?: RoleplayScenario | null;
      skipAudioOutput?: boolean;
    }
  ): Promise<UnifiedMessage> {
    const trimmed = text.trim();
    if (!trimmed) {
      throw new Error('Message text cannot be empty');
    }

    // 1. Record User Message in Unified History
    const userMsg: UnifiedMessage = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      role: 'user',
      content: trimmed,
      source,
      timestamp: new Date(),
    };
    this.history.push(userMsg);
    this.notifyListeners();

    // 2. Query Gemini AI Tutor (preserving existing system prompts and fallbacks)
    const rawReply = await aiService.sendMessage(trimmed);
    const aiHistory = aiService.getChatHistory();
    const lastAiMsg = aiHistory[aiHistory.length - 1];

    let messageToSpeak = rawReply;
    let translatedContent: string | undefined = undefined;

    // 3. Translation Handling
    const lang = options?.targetLanguage || 'en';
    if (lang !== 'en') {
      try {
        translatedContent = await translationService.translateToLanguage(rawReply, lang);
        messageToSpeak = translatedContent;
      } catch (err) {
        console.warn('Translation failed, falling back to original English reply:', err);
      }
    }

    // 4. Generate ISL Sign Sequences if output mode includes 'sign' or 'all'
    let signSeq: SignSequence[] | undefined = undefined;
    if (this.outputMode === 'sign' || this.outputMode === 'all') {
      try {
        const signResult = textToSignSequence(rawReply);
        signSeq = signResult.sequence;
      } catch (err) {
        console.warn('ISL Sign generation failed for message:', err);
      }
    }

    // 5. Trigger Speech Audio if output mode includes 'voice' or 'all'
    if (
      !options?.skipAudioOutput &&
      (this.outputMode === 'voice' || this.outputMode === 'all')
    ) {
      try {
        const rate = options?.speechRate || 0.85;
        // Don't await voice output so assistant message appears in UI immediately
        speechService.speak(messageToSpeak, rate).catch((err) => {
          console.warn('Speech playback notice:', err);
        });
      } catch (err) {
        console.warn('Speech invocation error:', err);
      }
    }

    // 6. Record Assistant Message in Unified History
    const assistantMsg: UnifiedMessage = {
      id: `ast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      role: 'assistant',
      content: rawReply,
      source: 'voice', // AI response is multimodal
      timestamp: new Date(),
      translatedContent,
      coachingTip: lastAiMsg?.coachingTip,
      signSequence: signSeq,
    };

    this.history.push(assistantMsg);
    this.notifyListeners();

    return assistantMsg;
  }

  // --- Fallback & Correction Helpers ---

  /**
   * Suggest nearest supported ISL signs when recognition confidence is low or uncertain
   */
  getSuggestedSigns(query?: string | null): string[] {
    const popularSigns = [
      'Namaste',
      'Hello',
      'Thank you',
      'Good',
      'Morning',
      'Yes',
      'No',
      'Help',
      'Please',
      'English',
      'Friend',
      'Learn',
    ];

    if (!query) {
      return popularSigns.slice(0, 4);
    }

    const clean = query.toLowerCase().trim();
    const matches = popularSigns.filter((s) => s.toLowerCase().includes(clean) || clean.includes(s.toLowerCase()));

    if (matches.length > 0) {
      return matches.slice(0, 4);
    }

    return popularSigns.slice(0, 4);
  }

  // --- Session Persistence (localStorage) ---

  saveCurrentSession(durationMinutes: number, scenarioTitle: string, scenarioId?: string): SavedSession | null {
    if (this.history.length === 0) return null;

    // Determine primary mode used
    const modeCounts = this.history.reduce(
      (acc, m) => {
        acc[m.source] = (acc[m.source] || 0) + 1;
        return acc;
      },
      {} as Record<InputMode, number>
    );

    const usedModes = Object.keys(modeCounts) as InputMode[];
    const primaryMode: InputMode | 'mixed' =
      usedModes.length > 1 ? 'mixed' : usedModes[0] || 'voice';

    const session: SavedSession = {
      id: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      durationMinutes: Math.max(1, durationMinutes),
      messages: this.history.map((m) => ({
        ...m,
        timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : String(m.timestamp),
      })),
      primaryMode,
      scenarioTitle: scenarioTitle || 'Free Chat',
      scenarioId,
    };

    try {
      const existing = this.getSavedSessions();
      const updated = [session, ...existing.slice(0, 24)]; // Keep latest 25
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not save session to localStorage:', err);
    }

    return session;
  }

  getSavedSessions(): SavedSession[] {
    try {
      const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  }

  getSavedSessionById(id: string): SavedSession | null {
    const list = this.getSavedSessions();
    return list.find((s) => s.id === id) || null;
  }

  deleteSavedSession(id: string): void {
    try {
      const list = this.getSavedSessions().filter((s) => s.id !== id);
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(list));
      this.notifyListeners();
    } catch (err) {
      console.warn('Could not delete session from localStorage:', err);
    }
  }
}

export const multimodalManager = new MultimodalCommunicationManager();

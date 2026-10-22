import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { AppShell } from '../components/layout/AppShell';
import VoiceTutor from '../components/VoiceTutor';
import { MicDiagnosticModal } from '../components/MicDiagnosticModal';
import { useUser } from '../contexts/UserContext';
import { ROLEPLAY_SCENARIOS } from '../lib/ai';
import { speechService } from '../lib/speech';

// Dashboard Modular Section Components
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { QuickStartChat } from '../components/dashboard/QuickStartChat';
import { SignLanguageCard } from '../components/dashboard/SignLanguageCard';
import { ScenarioGrid, type ScenarioFilterType } from '../components/dashboard/ScenarioGrid';
import { VocabularyBuilder } from '../components/dashboard/VocabularyBuilder';
import { AchievementChest } from '../components/dashboard/AchievementChest';
import { PastSessionsList } from '../components/dashboard/PastSessionsList';
import { OnboardingTourModal } from '../components/dashboard/OnboardingTourModal';
import type { VocabularyCard } from '../components/dashboard/FlashcardDeck';

export const DAILY_VOCABULARY: VocabularyCard[] = [
  {
    word: 'Bargain',
    pronunciation: '/ˈbɑːr.ɡɪn/',
    meaningHindi: 'मोलभाव करना (Molbhav)',
    example: 'Always remember to bargain politely at the local market.',
    category: 'Market',
  },
  {
    word: 'Prescription',
    pronunciation: '/prɪˈskrɪp.ʃən/',
    meaningHindi: 'दवा की पर्ची (Dawa ki parchi)',
    example: 'Please show this prescription to the pharmacist.',
    category: 'Doctor',
  },
  {
    word: 'Boarding Pass',
    pronunciation: '/ˈbɔːr.dɪŋ pæs/',
    meaningHindi: 'विमान प्रवेश पत्र (Viman pravesh patra)',
    example: 'Keep your boarding pass and Aadhaar card handy at the gate.',
    category: 'Travel',
  },
  {
    word: 'Colleague',
    pronunciation: '/ˈkɑː.liːɡ/',
    meaningHindi: 'सहकर्मी (Sahkarmi / Office mate)',
    example: 'My colleagues and I discussed the project over tea.',
    category: 'Work',
  },
  {
    word: 'Appetizer',
    pronunciation: '/ˈæp.ə.taɪ.zər/',
    meaningHindi: 'शुरुआती नाश्ता (Starter dish)',
    example: 'We ordered paneer tikka as an appetizer.',
    category: 'Dining',
  },
  {
    word: 'Fluency',
    pronunciation: '/ˈfluː.ən.si/',
    meaningHindi: 'धाराप्रवाह बोलना (Dharapravah)',
    example: 'Speaking with EduVaani 10 minutes a day builds fluency quickly.',
    category: 'General',
  },
];

export default function Dashboard() {
  const { user, updateStats: contextUpdateStats, updateUser } = useUser();
  const navigate = useNavigate();

  // Voice Tutor & Session State
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);

  // Onboarding Feature Tour Overlay State (shows once on first visit)
  const [isTourOpen, setIsTourOpen] = useState(() => {
    return user ? !user.onboardingTourSeen : false;
  });

  const handleDismissTour = () => {
    setIsTourOpen(false);
    updateUser({ onboardingTourSeen: true });
  };

  // Scenarios Filter
  const [scenarioFilter, setScenarioFilter] = useState<ScenarioFilterType>('all');

  // Diagnostics & Audio
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);
  const [isMicDiagOpen, setIsMicDiagOpen] = useState(false);

  // Vocabulary Mastery State
  const [masteredWords, setMasteredWords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eduvaani_mastered_words');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleMastered = (word: string) => {
    setMasteredWords((prev) => {
      const updated = prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word];
      try {
        localStorage.setItem('eduvaani_mastered_words', JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });

    if (!masteredWords.includes(word)) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  const startSession = (mode: string) => {
    setActiveMode(mode);
    setSessionStart(new Date());
  };

  const endSession = () => {
    if (sessionStart && user) {
      const minutes = Math.max(1, Math.round((Date.now() - sessionStart.getTime()) / 60000));
      contextUpdateStats(minutes);
    }
    setActiveMode(null);
    setSessionStart(null);
  };

  const speakVocabWord = async (text: string) => {
    try {
      setSpeakingWord(text);
      await speechService.speak(text, 0.85);
    } finally {
      setSpeakingWord(null);
    }
  };

  const triggerRewardCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  // VoiceTutor runs in dedicated fullscreen mode
  if (activeMode) {
    return <VoiceTutor autoStartMode={activeMode} onEnd={endSession} />;
  }

  // Filter scenarios based on active tab
  const filteredScenarios = ROLEPLAY_SCENARIOS.filter((s) => {
    if (scenarioFilter === 'daily') return ['bazaar', 'school', 'restaurant', 'home'].includes(s.id);
    if (scenarioFilter === 'travel') return ['airport', 'bazaar'].includes(s.id);
    if (scenarioFilter === 'career') return ['interview', 'school'].includes(s.id);
    if (scenarioFilter === 'stories') return ['story-kingdom', 'cricket'].includes(s.id);
    return true;
  });

  // Calculate user achievements
  const achievements = [
    {
      id: 'first_words',
      title: 'First Words',
      desc: 'Complete your 1st voice conversation',
      icon: '🌱',
      unlocked: (user.sessionsCompleted || 0) >= 1,
    },
    {
      id: 'streak_3',
      title: 'Consistency Star',
      desc: 'Practice 3 days in a row',
      icon: '🔥',
      unlocked: (user.streak || 1) >= 3,
    },
    {
      id: 'time_15',
      title: 'Voice Explorer',
      desc: 'Speak for 15+ minutes in English',
      icon: '⏱️',
      unlocked: (user.minutesPracticed || 0) >= 15,
    },
    {
      id: 'master_5',
      title: 'Scenario Champion',
      desc: 'Complete 5 different scenarios',
      icon: '🏆',
      unlocked: (user.sessionsCompleted || 0) >= 5,
    },
  ];

  return (
    <AppShell className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Welcome Banner with time-of-day greeting, level progress, stats & mic check */}
        <WelcomeBanner
          user={user}
          onMicCheck={() => setIsMicDiagOpen(true)}
          onOpenTour={() => setIsTourOpen(true)}
        />

        {/* 2. Interactive Action Cards: Free-Flow Chat + Indian Sign Language Tutor */}
        <div className="grid lg:grid-cols-2 gap-6">
          {user.usesSignLanguage ? (
            <>
              <div id="tour-sign-card" className="order-1">
                <SignLanguageCard isProminent />
              </div>
              <div id="tour-quick-chat" className="order-2">
                <QuickStartChat onStartSession={startSession} />
              </div>
            </>
          ) : (
            <>
              <div id="tour-quick-chat">
                <QuickStartChat onStartSession={startSession} />
              </div>
              <div id="tour-sign-card">
                <SignLanguageCard />
              </div>
            </>
          )}
        </div>

        {/* 3. Practice Scenarios Grid with Category Filters */}
        <div id="tour-scenario-grid">
          <ScenarioGrid
            scenarios={filteredScenarios}
            currentFilter={scenarioFilter}
            onFilterChange={setScenarioFilter}
            onStartScenario={startSession}
          />
        </div>

        {/* 4. Past Practice Sessions List & Transcripts */}
        <PastSessionsList onStartVoiceSession={() => startSession('free')} />

        {/* 5. Daily Indian English Vocabulary Builder & 3D Flashcards */}
        <VocabularyBuilder
          vocabulary={DAILY_VOCABULARY}
          masteredWords={masteredWords}
          onToggleMastered={toggleMastered}
          onSpeak={speakVocabWord}
          speakingWord={speakingWord}
        />

        {/* 5. Treasure Chest & Badges */}
        <AchievementChest
          achievements={achievements}
          onCelebrate={triggerRewardCelebration}
        />

      </div>

      {/* Audio & Mic Hardware Diagnostic Modal */}
      <MicDiagnosticModal
        isOpen={isMicDiagOpen}
        onClose={() => setIsMicDiagOpen(false)}
      />

      {/* Post-Onboarding Feature Tour Overlay */}
      <OnboardingTourModal
        isOpen={isTourOpen}
        onDismiss={handleDismissTour}
      />
    </AppShell>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MessageSquare,
  Flame,
  Clock,
  Trophy,
  Sparkles,
  BookOpen,
  Gamepad2,
  Award,
  Volume2,
  Filter,
  Gift,
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import VoiceTutor from '../components/VoiceTutor';
import { getUser, updateStats } from '../lib/auth';
import { ROLEPLAY_SCENARIOS } from '../lib/ai';
import { speechService } from '../lib/speech';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

interface VocabularyCard {
  word: string;
  pronunciation: string;
  meaningHindi: string;
  example: string;
  category: string;
}

const DAILY_VOCABULARY: VocabularyCard[] = [
  {
    word: 'Bargain',
    pronunciation: '/ˈbɑːr.ɡɪn/',
    meaningHindi: 'मोलभाव करना (Molbhav)',
    example: 'Always remember to bargain politely at the local market.',
    category: 'Market'
  },
  {
    word: 'Prescription',
    pronunciation: '/prɪˈskrɪp.ʃən/',
    meaningHindi: 'दवा की पर्ची (Dawa ki parchi)',
    example: 'Please show this prescription to the pharmacist.',
    category: 'Doctor'
  },
  {
    word: 'Boarding Pass',
    pronunciation: '/ˈbɔːr.dɪŋ pæs/',
    meaningHindi: 'विमान प्रवेश पत्र (Viman pravesh patra)',
    example: 'Keep your boarding pass and Aadhaar card handy at the gate.',
    category: 'Travel'
  },
  {
    word: 'Colleague',
    pronunciation: '/ˈkɑː.liːɡ/',
    meaningHindi: 'सहकर्मी (Sahkarmi / Office mate)',
    example: 'My colleagues and I discussed the project over tea.',
    category: 'Work'
  },
  {
    word: 'Appetizer',
    pronunciation: '/ˈæp.ə.taɪ.zər/',
    meaningHindi: 'शुरुआती नाश्ता (Starter dish)',
    example: 'We ordered paneer tikka as an appetizer.',
    category: 'Dining'
  },
  {
    word: 'Fluency',
    pronunciation: '/ˈfluː.ən.si/',
    meaningHindi: 'धाराप्रवाह बोलना (Dharapravah)',
    example: 'Speaking with EduVaani 10 minutes a day builds fluency quickly.',
    category: 'General'
  }
];

export default function Dashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [scenarioFilter, setScenarioFilter] = useState<'all' | 'daily' | 'travel' | 'career' | 'stories'>('all');
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const startSession = (mode: string) => {
    setActiveMode(mode);
    setSessionStart(new Date());
  };

  const endSession = () => {
    if (sessionStart && user) {
      const minutes = Math.max(1, Math.round((Date.now() - sessionStart.getTime()) / 60000));
      updateStats(user, minutes);
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
      origin: { y: 0.6 }
    });
  };

  if (activeMode) {
    return <VoiceTutor autoStartMode={activeMode} onEnd={endSession} />;
  }

  const refreshedUser = getUser()!;

  // Scenarios filter
  const filteredScenarios = ROLEPLAY_SCENARIOS.filter(s => {
    if (scenarioFilter === 'daily') return ['bazaar', 'school', 'restaurant', 'home'].includes(s.id);
    if (scenarioFilter === 'travel') return ['airport', 'bazaar'].includes(s.id);
    if (scenarioFilter === 'career') return ['interview', 'school'].includes(s.id);
    if (scenarioFilter === 'stories') return ['story-kingdom', 'cricket'].includes(s.id);
    return true;
  });

  // Calculate user level & experience
  const currentMinutes = refreshedUser.minutesPracticed || 0;
  const level = Math.floor(currentMinutes / 15) + 1;
  const nextLevelMinutes = level * 15;
  const levelProgress = Math.min(100, Math.round(((currentMinutes % 15) / 15) * 100));

  const achievements = [
    {
      id: 'first_words',
      title: 'First Words',
      desc: 'Complete your 1st voice conversation',
      icon: '🌱',
      unlocked: refreshedUser.sessionsCompleted >= 1
    },
    {
      id: 'streak_3',
      title: 'Consistency Star',
      desc: 'Practice 3 days in a row',
      icon: '🔥',
      unlocked: refreshedUser.streak >= 3
    },
    {
      id: 'time_15',
      title: 'Voice Explorer',
      desc: 'Speak for 15+ minutes in English',
      icon: '⏱️',
      unlocked: refreshedUser.minutesPracticed >= 15
    },
    {
      id: 'master_5',
      title: 'Scenario Champion',
      desc: 'Complete 5 different scenarios',
      icon: '🏆',
      unlocked: refreshedUser.sessionsCompleted >= 5
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/20 relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-20 right-20 text-yellow-300/10 text-6xl">⭐</div>
        <div className="absolute bottom-40 left-10 text-orange-300/10 text-6xl">✨</div>
      </div>

      <Navbar />

      <main className="flex-grow relative z-10 px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Welcome User & Level Progress Banner */}
          <div className="glass border border-orange-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/30">
                  <Sparkles className="h-8 w-8 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                      Namaste, {refreshedUser.name.split(' ')[0]}! 🙏
                    </h1>
                    <Badge variant="saffron">
                      Level {level}: Spoken English Explorer
                    </Badge>
                  </div>
                  <p className="text-orange-200/70 text-sm mt-1">
                    Your daily English practice awaits. Speak with confidence!
                  </p>
                </div>
              </div>

              {/* Progress & Stats Cards */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                {[
                  { icon: Flame, value: `${refreshedUser.streak} Days`, label: 'Active Streak', color: 'text-orange-400' },
                  { icon: Clock, value: `${refreshedUser.minutesPracticed}m`, label: 'Spoken Time', color: 'text-blue-400' },
                  { icon: Trophy, value: refreshedUser.sessionsCompleted, label: 'Sessions', color: 'text-amber-400' },
                ].map(({ icon: Icon, value, label, color }) => (
                  <div key={label} className="glass border border-white/10 rounded-2xl px-5 py-3 text-center min-w-[85px]">
                    <Icon className={`h-5 w-5 ${color} mx-auto mb-1`} />
                    <div className="text-lg font-bold text-white font-display">{value}</div>
                    <div className="text-[11px] text-white/50">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                <span>Next Milestone: Level {level + 1}</span>
                <span>{currentMinutes}m / {nextLevelMinutes}m practiced ({levelProgress}%)</span>
              </div>
              <Progress value={levelProgress} className="h-2.5" />
            </div>
          </div>

          {/* Quick Start Free Chat Banner */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-orange-400" />
                <h2 className="text-xl font-bold text-white font-display">Instant Voice Chat</h2>
              </div>
              <Badge variant="outline" className="text-xs">
                AI Always Ready
              </Badge>
            </div>

            <button
              onClick={() => startSession('free-flow')}
              className="group w-full glass border border-orange-500/30 hover:border-orange-500/70 rounded-3xl p-6 sm:p-7 text-left transition-all duration-400 card-glow shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-orange-300 transition-colors font-display">
                      Free-Flow English Conversation 💬
                    </h3>
                    <Badge variant="saffron" className="text-[10px]">
                      Most Popular
                    </Badge>
                  </div>
                  <p className="text-white/60 text-sm mt-1 leading-relaxed">
                    Have natural, unstructured practice about your day, career, thoughts, or ask grammar questions. Your AI tutor adapts to your pace!
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 bg-orange-500/20 rounded-2xl border border-orange-500/40 group-hover:bg-orange-500/30 transition-all">
                    <PlayCircle className="h-7 w-7 text-orange-300 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Practice Scenarios Worlds with Category Filter Tabs */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white font-display">Practice Scenarios ({filteredScenarios.length})</h2>
                <Badge variant="saffron">
                  🇮🇳 Indian Realities
                </Badge>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 glass border border-white/10 rounded-2xl p-1 text-xs backdrop-blur-md">
                <Filter className="h-3 w-3 text-white/40 ml-2 mr-1" />
                {(['all', 'daily', 'travel', 'career', 'stories'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setScenarioFilter(tab)}
                    className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all duration-200 cursor-pointer ${
                      scenarioFilter === tab
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab === 'all' ? 'All (9)' : tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredScenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => startSession(scenario.id)}
                  className="group glass border border-white/10 hover:border-orange-500/40 rounded-3xl p-5 sm:p-6 text-left transition-all duration-300 card-glow flex flex-col justify-between shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-xl group-hover:scale-150 transition-transform" />
                  
                  <div>
                    <div className="flex items-start gap-4 mb-3">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${scenario.gradient} flex items-center justify-center text-3xl shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        {scenario.emoji}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-orange-300 transition-colors leading-tight font-display">
                          {scenario.title}
                        </h3>
                        <p className="text-white/50 text-xs mt-1 leading-relaxed line-clamp-2">
                          {scenario.description}
                        </p>
                      </div>
                    </div>

                    {/* Scenario sample question tags */}
                    <div className="space-y-1 mt-3">
                      {scenario.suggestedPhrases.slice(0, 2).map((phrase, idx) => (
                        <div key={idx} className="text-[11px] text-white/40 truncate bg-white/[0.03] px-2.5 py-1 rounded-lg">
                          💬 "{phrase}"
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-orange-300 font-semibold group-hover:underline flex items-center gap-1">
                      Start Practice
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-white/40 text-[11px]">8 Languages</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Daily Indian English Vocabulary Builder */}
          <div className="glass border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-emerald-400" />
                <h2 className="text-xl font-bold text-white font-display">Daily Indian English Vocabulary Builder</h2>
                <Badge variant="success" className="text-xs">
                  Audio Guide
                </Badge>
              </div>
              <span className="text-xs text-white/50">Tap 🔊 to hear correct pronunciation</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DAILY_VOCABULARY.map(item => (
                <div
                  key={item.word}
                  className="glass border border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-white font-bold text-base flex items-center gap-2 font-display">
                        {item.word}
                        <span className="text-xs text-white/40 font-mono font-normal">{item.pronunciation}</span>
                      </h4>
                      <button
                        onClick={() => speakVocabWord(item.word)}
                        title="Listen to pronunciation"
                        className="text-emerald-400 hover:text-emerald-300 glass border border-emerald-500/30 rounded-full p-2 transition-colors cursor-pointer"
                      >
                        <Volume2 className={`h-4 w-4 ${speakingWord === item.word ? 'animate-bounce text-yellow-300' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="text-xs text-amber-300 font-medium mb-2.5">
                      {item.meaningHindi}
                    </div>
                    
                    <p className="text-xs text-white/60 italic leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                      "{item.example}"
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                    <span className="bg-white/5 px-2.5 py-0.5 rounded-full font-medium">{item.category}</span>
                    <button
                      onClick={() => speakVocabWord(item.example)}
                      className="hover:text-emerald-300 transition-colors cursor-pointer font-medium"
                    >
                      Hear sentence 🔊
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Treasure Chest & Learning Badges (SpeakGenie Feature) */}
          <div className="glass border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                  <Award className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Your Treasure Chest & Badges 💎</h2>
                  <p className="text-xs text-white/50">Complete conversational sessions to unlock speaking superpowers!</p>
                </div>
              </div>

              <Button
                onClick={triggerRewardCelebration}
                variant="glow"
                size="sm"
                className="text-xs"
              >
                <Gift className="h-4 w-4 mr-1.5" />
                Celebrate Progress
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {achievements.map(ach => (
                <div
                  key={ach.id}
                  className={`rounded-2xl p-4 border transition-all duration-300 ${
                    ach.unlocked
                      ? 'glass border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent shadow-xl'
                      : 'border-white/5 bg-white/[0.02] opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{ach.icon}</div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm font-display">{ach.title}</h4>
                    {ach.unlocked ? (
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded-full font-bold">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/30">Locked</span>
                    )}
                  </div>
                  <p className="text-xs text-white/50 mt-1.5 leading-relaxed">{ach.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

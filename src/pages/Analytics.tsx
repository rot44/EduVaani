import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Flame,
  TrendingUp,
  Trophy,
  ArrowLeft,
  Sparkles,
  Share2,
  Check,
  Mic,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { useUser } from '../contexts/UserContext';

// Modular Analytics Components
import { PracticeChart } from '../components/analytics/PracticeChart';
import { FluencyTrend } from '../components/analytics/FluencyTrend';
import { ScenarioBreakdown } from '../components/analytics/ScenarioBreakdown';
import { StreakCalendar } from '../components/analytics/StreakCalendar';
import { VocabProgress } from '../components/analytics/VocabProgress';
import { getAnalyticsData } from '../components/analytics/analyticsData';

type TimeRangeFilter = '7d' | '30d' | 'all';

export default function Analytics() {
  const { user } = useUser();
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('7d');
  const [copiedLink, setCopiedLink] = useState(false);

  // Load consolidated analytics data
  const analytics = useMemo(() => getAnalyticsData(), [user]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My EduVaani English Speaking Progress',
          text: `I've practiced ${user?.minutesPracticed || 28} minutes of conversational English with a ${user?.streak || 3}-day streak on EduVaani! 🇮🇳🎙️`,
          url: window.location.origin,
        });
      } else {
        await navigator.clipboard.writeText(
          `I've practiced ${user?.minutesPracticed || 28} minutes of conversational English with a ${user?.streak || 3}-day streak on EduVaani! 🇮🇳🎙️`
        );
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      // User cancelled share
    }
  };

  const totalMinutes = user?.minutesPracticed || analytics.weeklyMinutesTotal;
  const currentStreak = user?.streak || 3;
  const sessionsCount = user?.sessionsCompleted || 5;

  return (
    <AppShell className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link
            to="/dashboard"
            className="inline-flex items-center min-h-[44px] px-2 text-sm font-semibold text-deep-brown/80 hover:text-terracotta transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            Back to Dashboard
          </Link>

          {/* Time Range Pills & Share Button */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div
              className="p-1 bg-cream-white rounded-2xl border border-warm-sand flex items-center shadow-xs"
              role="tablist"
              aria-label="Analytics time range filter"
            >
              {(
                [
                  { id: '7d', label: 'Last 7 Days' },
                  { id: '30d', label: 'Last 30 Days' },
                  { id: 'all', label: 'All Time' },
                ] as const
              ).map((tab) => {
                const isSelected = timeRange === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setTimeRange(tab.id)}
                    className={`px-3 py-1.5 min-h-[36px] text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-terracotta text-cream-white shadow-xs'
                        : 'text-deep-brown/70 hover:text-deep-brown'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="min-h-[44px] px-3.5 text-xs rounded-2xl border-warm-sand text-deep-brown hover:bg-warm-sand/50"
              aria-label="Share learning achievements"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-600" aria-hidden="true" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 mr-1.5 text-terracotta" aria-hidden="true" />
                  <span>Share Progress</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2">
            <Badge variant="terracotta" className="text-xs font-bold">
              <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
              Progress Insights
            </Badge>
            <Badge variant="teal" className="text-xs font-bold">
              आपकी प्रगति
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-deep-brown tracking-tight">
            Speaking Analytics & Insights
          </h1>

          <p className="text-sm sm:text-base text-deep-brown/75 leading-relaxed font-sans">
            Track your spoken conversational minutes, monitor AI-evaluated fluency improvements, and build lifelong English fluency through daily consistency.
          </p>
        </div>

        {/* Top 4 Key Metric Metric Highlight Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Speaking Time */}
          <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-5 sm:p-6 shadow-warm-sm flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-deep-brown/75 uppercase tracking-wider font-display">
                Total Spoken Time
              </span>
              <div className="w-10 h-10 rounded-2xl bg-peacock-teal/15 text-peacock-teal flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-deep-brown font-display">
                <AnimatedCounter value={totalMinutes} /> <span className="text-base font-semibold text-deep-brown/70">mins</span>
              </div>
              <p className="text-[11px] text-peacock-teal font-medium mt-1">
                Avg 15.2 mins per practice session
              </p>
            </div>
          </div>

          {/* Card 2: Current Streak */}
          <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-5 sm:p-6 shadow-warm-sm flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-deep-brown/75 uppercase tracking-wider font-display">
                Active Streak
              </span>
              <div className="w-10 h-10 rounded-2xl bg-terracotta/15 text-terracotta flex items-center justify-center flex-shrink-0">
                <Flame className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-deep-brown font-display">
                <AnimatedCounter value={currentStreak} /> <span className="text-base font-semibold text-deep-brown/70">Days</span>
              </div>
              <p className="text-[11px] text-terracotta font-semibold mt-1">
                🔥 Personal best: {analytics.longestStreak} days
              </p>
            </div>
          </div>

          {/* Card 3: Overall Fluency Score */}
          <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-5 sm:p-6 shadow-warm-sm flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-deep-brown/75 uppercase tracking-wider font-display">
                AI Fluency Index
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-deep-brown font-display">
                <AnimatedCounter value={analytics.averageFluency} decimals={1} /> <span className="text-base font-semibold text-deep-brown/70">/ 10</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                +24% growth across 6 sessions
              </p>
            </div>
          </div>

          {/* Card 4: Sessions Conquered */}
          <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-5 sm:p-6 shadow-warm-sm flex flex-col justify-between card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-deep-brown/75 uppercase tracking-wider font-display">
                Scenarios Conquered
              </span>
              <div className="w-10 h-10 rounded-2xl bg-turmeric/20 text-turmeric-dark flex items-center justify-center flex-shrink-0">
                <Trophy className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-deep-brown font-display">
                <AnimatedCounter value={sessionsCount} /> <span className="text-base font-semibold text-deep-brown/70">Completed</span>
              </div>
              <p className="text-[11px] text-turmeric-dark font-medium mt-1">
                5 distinct Indian cultural situations
              </p>
            </div>
          </div>
        </div>

        {/* Empty State Banner if no sessions yet */}
        {(user?.sessionsCompleted || 0) === 0 && (
          <div className="p-6 sm:p-8 rounded-3xl border-2 border-dashed border-warm-sand bg-warm-ivory text-center space-y-3 card-hover animate-slide-up">
            <div className="w-12 h-12 rounded-2xl bg-turmeric/20 text-turmeric-dark mx-auto flex items-center justify-center text-2xl shadow-xs">
              📊
            </div>
            <h3 className="text-xl font-bold font-display text-deep-brown">
              Practice for a few days to see your progress here
            </h3>
            <p className="text-xs sm:text-sm text-deep-brown/75 max-w-md mx-auto leading-relaxed">
              As you practice conversations with Vaani, your spoken minutes, AI-scored fluency curve, and vocabulary retention will automatically appear here.
            </p>
            <div className="pt-2">
              <Button asChild variant="primary" className="min-h-[44px] px-6">
                <Link to="/dashboard">
                  <Mic className="h-4 w-4 mr-2" aria-hidden="true" />
                  Start First Conversation
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Section 1: Weekly Practice Bar Chart & Fluency Trend Line */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <PracticeChart data={analytics.weeklyPractice} goalMinutes={15} />
          <FluencyTrend data={analytics.fluencyTrend} />
        </div>

        {/* Section 2: Scenario Distribution & Vocabulary Retention Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <ScenarioBreakdown data={analytics.scenarioStats} />
          <VocabProgress initialMastered={analytics.masteredWords} />
        </div>

        {/* Section 3: 12-Week Practice Heatmap */}
        <div>
          <StreakCalendar
            days={analytics.heatmapDays}
            currentStreak={currentStreak}
            longestStreak={analytics.longestStreak}
          />
        </div>

        {/* Motivational Bottom Action Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-terracotta to-turmeric text-cream-white shadow-warm-lg flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center sm:text-left relative z-10 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              Ready for your next 15-minute practice?
            </h3>
            <p className="text-sm text-cream-white/90 leading-relaxed font-sans">
              Talk freely about your day, order at an Indian restaurant, or negotiate politely at the vegetable market. Every minute counts!
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <Button
              asChild
              size="lg"
              className="bg-cream-white text-deep-brown hover:bg-cream-white/95 font-bold shadow-2xl rounded-2xl min-h-[48px] px-6"
            >
              <Link to="/dashboard">
                <Mic className="h-5 w-5 mr-2 text-terracotta" aria-hidden="true" />
                Start Voice Practice
              </Link>
            </Button>
          </div>

          {/* Decorative backdrop shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        </div>

      </div>
    </AppShell>
  );
}

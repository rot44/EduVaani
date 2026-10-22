import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Flame, Clock, Trophy, ArrowLeft } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { SectionHeading } from '../components/ui/section-heading';
import { useUser } from '../contexts/UserContext';

export default function Analytics() {
  const { user } = useUser();

  const minutes = user?.minutesPracticed || 0;
  const streak = user?.streak || 1;
  const sessions = user?.sessionsCompleted || 0;

  return (
    <AppShell className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center min-h-[44px] px-2 text-sm font-semibold text-deep-brown/80 hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Back to Dashboard
          </Link>
        </div>

        <SectionHeading
          badge="Learning Metrics"
          badgeVariant="turmeric"
          title="Speaking Analytics & Progress"
          subtitle="Visualize your conversational growth, daily speaking streaks, and vocabulary retention over time."
          align="center"
        />

        {/* Quick Metric Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 shadow-warm-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-deep-brown/75 uppercase tracking-wider">Active Streak</span>
              <div className="w-10 h-10 rounded-2xl bg-terracotta/15 text-terracotta flex items-center justify-center">
                <Flame className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-deep-brown font-display">{streak} Days</div>
            <p className="text-xs text-peacock-teal font-medium mt-1">Keep practicing daily to grow!</p>
          </div>

          <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 shadow-warm-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-deep-brown/75 uppercase tracking-wider">Time Spoken</span>
              <div className="w-10 h-10 rounded-2xl bg-peacock-teal/15 text-peacock-teal flex items-center justify-center">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-deep-brown font-display">{minutes} mins</div>
            <p className="text-xs text-deep-brown/75 font-medium mt-1">Total spoken conversational practice</p>
          </div>

          <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 shadow-warm-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-deep-brown/75 uppercase tracking-wider">Sessions</span>
              <div className="w-10 h-10 rounded-2xl bg-turmeric/20 text-deep-brown flex items-center justify-center">
                <Trophy className="h-5 w-5 text-turmeric-dark" aria-hidden="true" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-deep-brown font-display">{sessions} Completed</div>
            <p className="text-xs text-deep-brown/75 font-medium mt-1">Real-world scenarios conquered</p>
          </div>
        </div>

        {/* Detailed Chart Placeholder */}
        <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-8 sm:p-10 shadow-warm text-center space-y-6 mt-8">
          <div className="w-16 h-16 rounded-2xl bg-warm-sand/60 text-terracotta flex items-center justify-center mx-auto">
            <BarChart3 className="h-8 w-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5">
              <Badge variant="teal" className="text-xs font-bold">
                Detailed Analytics Engine
              </Badge>
              <Badge variant="outline" className="text-xs">
                Prompt 10 Preview
              </Badge>
            </div>
            <h3 className="text-2xl font-bold font-display text-deep-brown">
              Comprehensive Fluency Reports
            </h3>
            <p className="text-sm text-deep-brown/75 leading-relaxed font-sans">
              Detailed pronunciation heatmaps, vocabulary mastery curves, and speech speed analysis will appear here.
            </p>
          </div>

          <div className="p-4 bg-cream-white rounded-2xl border border-warm-sand max-w-md mx-auto text-xs text-deep-brown/75 flex items-center justify-center gap-2">
            <TrendingUp className="h-4 w-4 text-peacock-teal" />
            <span>Fluency trend: Consistent speaking yields 40% higher retention in 2 weeks.</span>
          </div>

          <div className="pt-2">
            <Button asChild variant="primary" className="min-h-[44px] px-6">
              <Link to="/dashboard">
                Continue Practice Session
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </AppShell>
  );
}

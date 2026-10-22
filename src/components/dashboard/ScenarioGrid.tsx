import { Gamepad2, Filter, ArrowRight } from 'lucide-react';
import type { RoleplayScenario } from '../../lib/ai';
import { Badge } from '../ui/badge';

export type ScenarioFilterType = 'all' | 'daily' | 'travel' | 'career' | 'stories';

export interface ScenarioGridProps {
  scenarios: RoleplayScenario[];
  currentFilter: ScenarioFilterType;
  onFilterChange: (filter: ScenarioFilterType) => void;
  onStartScenario: (scenarioId: string) => void;
}

// Map scenario gradients to curated EduVaani palette colors
function getScenarioGradient(id: string, defaultGradient: string): string {
  switch (id) {
    case 'bazaar':
      return 'from-terracotta to-turmeric';
    case 'school':
      return 'from-peacock-teal to-peacock-teal-dark';
    case 'airport':
      return 'from-turmeric to-terracotta';
    case 'restaurant':
      return 'from-terracotta-hover to-turmeric';
    case 'interview':
      return 'from-peacock-teal to-deep-brown';
    case 'home':
      return 'from-turmeric to-warm-sand';
    case 'cricket':
      return 'from-peacock-teal to-turmeric';
    case 'story-kingdom':
      return 'from-terracotta to-peacock-teal';
    default:
      return defaultGradient || 'from-terracotta to-turmeric';
  }
}

export function ScenarioGrid({
  scenarios,
  currentFilter,
  onFilterChange,
  onStartScenario,
}: ScenarioGridProps) {
  const filterTabs: { id: ScenarioFilterType; label: string }[] = [
    { id: 'all', label: 'All Scenarios' },
    { id: 'daily', label: 'Daily Life' },
    { id: 'travel', label: 'Travel & Transport' },
    { id: 'career', label: 'Career & Studies' },
    { id: 'stories', label: 'Fun & Stories' },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header & Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-deep-brown">
                Practice Scenarios ({scenarios.length})
              </h2>
              <Badge variant="turmeric" className="text-[11px] font-bold">
                🇮🇳 Indian Realities
              </Badge>
            </div>
            <p className="text-xs text-deep-brown/65 mt-0.5">
              Roleplay real conversations in everyday Indian situations
            </p>
          </div>
        </div>

        {/* Filter Pills: active = terracotta fill, inactive = warm sand */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-warm-sand/50 border border-warm-sand">
          <Filter className="h-3.5 w-3.5 text-deep-brown/50 ml-2 mr-1" />
          {filterTabs.map((tab) => {
            const isActive = currentFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                type="button"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-terracotta text-cream-white shadow-warm-sm'
                    : 'text-deep-brown/75 hover:text-deep-brown hover:bg-warm-sand'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {scenarios.map((scenario) => {
          const gradientClass = getScenarioGradient(scenario.id, scenario.gradient);

          return (
            <button
              key={scenario.id}
              onClick={() => onStartScenario(scenario.id)}
              type="button"
              className="group rounded-3xl border border-warm-sand bg-warm-ivory hover:border-terracotta/40 p-5 sm:p-6 text-left transition-all duration-300 shadow-warm-sm hover:shadow-warm-md flex flex-col justify-between relative overflow-hidden cursor-pointer"
            >
              {/* Top Details */}
              <div>
                <div className="flex items-start gap-4 mb-3">
                  {/* Emoji in colored circular gradient badge */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-3xl shadow-warm-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}
                  >
                    {scenario.emoji}
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-deep-brown text-base sm:text-lg group-hover:text-terracotta transition-colors leading-tight font-display">
                      {scenario.title}
                    </h3>
                    <p className="text-deep-brown/70 text-xs mt-1 leading-relaxed line-clamp-2 font-sans">
                      {scenario.description}
                    </p>
                  </div>
                </div>

                {/* 2 Sample Phrases */}
                <div className="space-y-1.5 mt-3 pt-2 border-t border-warm-sand/50">
                  {scenario.suggestedPhrases.slice(0, 2).map((phrase, idx) => (
                    <div
                      key={idx}
                      className="text-[11px] text-deep-brown/75 truncate bg-cream-white/90 border border-warm-sand/70 px-2.5 py-1.5 rounded-xl font-sans"
                    >
                      💬 &quot;{phrase}&quot;
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-5 pt-3 border-t border-warm-sand/80 flex items-center justify-between text-xs">
                <span className="text-terracotta font-bold flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  Start Practice
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-peacock-teal font-semibold text-[11px] bg-peacock-teal/10 px-2 py-0.5 rounded-full">
                  8 Languages
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

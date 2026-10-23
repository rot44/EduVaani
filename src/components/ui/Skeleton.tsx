import React from 'react';

export function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-r from-warm-sand/40 via-warm-sand/75 to-warm-sand/40 animate-shimmer ${className}`}
      style={{ backgroundSize: '200% 100%' }}
      {...props}
    />
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse" role="status" aria-label="Loading statistics">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-3xl border border-warm-sand bg-warm-ivory p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-10 rounded-2xl" />
          </div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

export function ScenarioCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse" role="status" aria-label="Loading scenarios">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
          </div>
          <div className="pt-2">
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function VocabCardsSkeleton() {
  return (
    <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-8 max-w-md mx-auto space-y-6 text-center animate-pulse" role="status" aria-label="Loading flashcard">
      <div className="flex justify-center">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-10 w-44 mx-auto rounded-xl" />
      <Skeleton className="h-4 w-28 mx-auto" />
      <div className="flex justify-center pt-2">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <Skeleton className="h-3 w-36 mx-auto" />
    </div>
  );
}

export function AnalyticsChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse" role="status" aria-label="Loading analytics charts">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
          <div className="h-56 bg-cream-white/70 rounded-2xl border border-warm-sand/60 p-4 flex items-end justify-between gap-3">
            {[40, 75, 60, 90, 50, 80, 65].map((h, j) => (
              <Skeleton key={j} className="flex-1 rounded-t-xl" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-warm-sand/60">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

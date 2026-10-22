export function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page content"
      className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-cream-white w-full"
    >
      <div className="w-full max-w-4xl space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-4 text-center max-w-lg mx-auto">
          <div className="h-6 w-36 bg-warm-sand/70 rounded-full mx-auto" />
          <div className="h-10 w-3/4 bg-warm-sand/80 rounded-2xl mx-auto" />
          <div className="h-4 w-5/6 bg-warm-sand/50 rounded-xl mx-auto" />
        </div>

        {/* Content Skeleton Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-3xl border border-warm-sand bg-warm-ivory p-6 space-y-4 shadow-warm-sm"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-warm-sand/80" />
                <div className="h-5 w-16 bg-warm-sand/60 rounded-full" />
              </div>
              <div className="h-6 w-4/5 bg-warm-sand/70 rounded-xl" />
              <div className="space-y-2">
                <div className="h-3.5 w-full bg-warm-sand/50 rounded-lg" />
                <div className="h-3.5 w-4/5 bg-warm-sand/50 rounded-lg" />
              </div>
              <div className="pt-4 border-t border-warm-sand/50 flex justify-between items-center">
                <div className="h-4 w-20 bg-warm-sand/60 rounded-md" />
                <div className="h-4 w-12 bg-warm-sand/60 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

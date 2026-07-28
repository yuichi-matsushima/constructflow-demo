function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />;
}

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="h-7 w-48" />
        <SkeletonBlock className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <SkeletonBlock className="mb-3 h-4 w-24" />
            <SkeletonBlock className="h-7 w-16" />
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <SkeletonBlock className="mb-4 h-5 w-32" />
        <div className="flex flex-col divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="flex flex-col gap-2">
                <SkeletonBlock className="h-4 w-48" />
                <SkeletonBlock className="h-3 w-32" />
              </div>
              <SkeletonBlock className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

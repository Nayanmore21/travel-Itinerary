const Skeleton = ({ className }) => (
  <div className={`shimmer rounded-md ${className}`} />
);

export const ItineraryCardSkeleton = () => (
  <div className="rounded-lg border bg-card overflow-hidden">
    <Skeleton className="h-36 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <div className="flex gap-2 mt-3">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>
  </div>
);

export const DaySkeleton = () => (
  <div className="space-y-3 py-4">
    <Skeleton className="h-6 w-48" />
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-3">
        <Skeleton className="h-4 w-12 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    ))}
  </div>
);

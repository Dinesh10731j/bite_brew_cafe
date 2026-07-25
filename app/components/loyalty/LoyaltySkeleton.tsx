// ============================================================
// Bite & Brew — Loyalty Skeleton Loaders
// ============================================================

export function PointsCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 animate-pulse">
      <div className="h-4 w-24 bg-black/5 rounded-full mb-4" />
      <div className="h-12 w-36 bg-black/10 rounded-xl mb-3" />
      <div className="h-3 w-32 bg-black/5 rounded-full mb-6" />
      <div className="h-3 w-full bg-black/5 rounded-full mb-2" />
      <div className="h-3 w-3/4 bg-black/5 rounded-full" />
    </div>
  );
}

export function TierProgressSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 animate-pulse">
      <div className="h-4 w-20 bg-black/5 rounded-full mb-4" />
      <div className="h-8 w-28 bg-black/10 rounded-lg mb-4" />
      <div className="h-4 w-full bg-black/5 rounded-full mb-3" />
      <div className="h-3 w-48 bg-black/5 rounded-full" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 animate-pulse">
      <div className="h-4 w-16 bg-black/5 rounded-full mb-3" />
      <div className="h-8 w-24 bg-black/10 rounded-lg" />
    </div>
  );
}

export function RewardCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 animate-pulse">
      <div className="aspect-[4/3] bg-black/5" />
      <div className="p-5">
        <div className="h-4 w-3/4 bg-black/5 rounded-full mb-2" />
        <div className="h-3 w-full bg-black/5 rounded-full mb-1" />
        <div className="h-3 w-2/3 bg-black/5 rounded-full mb-4" />
        <div className="h-5 w-24 bg-black/5 rounded-full" />
      </div>
    </div>
  );
}

export function CheckInCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-black/5 rounded-2xl" />
        <div>
          <div className="h-4 w-20 bg-black/5 rounded-full mb-2" />
          <div className="h-3 w-16 bg-black/5 rounded-full" />
        </div>
      </div>
      <div className="h-12 w-full bg-black/5 rounded-2xl" />
    </div>
  );
}

export function ReferralCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 animate-pulse">
      <div className="h-4 w-24 bg-black/5 rounded-full mb-4" />
      <div className="h-10 w-full bg-black/5 rounded-xl mb-3" />
      <div className="h-10 w-full bg-black/5 rounded-xl" />
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-black/5 animate-pulse"
        >
          <div className="w-10 h-10 bg-black/5 rounded-xl shrink-0" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-black/5 rounded-full mb-2" />
            <div className="h-3 w-24 bg-black/5 rounded-full" />
          </div>
          <div className="h-6 w-16 bg-black/5 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PointsCardSkeleton />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <CheckInCardSkeleton />
          <ReferralCardSkeleton />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="h-8 w-40 bg-black/5 rounded-lg mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <RewardCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <div>
          <div className="h-8 w-40 bg-black/5 rounded-lg mb-4" />
          <HistorySkeleton />
        </div>
      </div>
    </div>
  );
}


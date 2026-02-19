export function MarketCardSkeleton() {
  return (
    <div className="rounded-lg border border-[#2A2F36] bg-[#1E2329] p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-20 bg-[#2A2F36] rounded" />
        <div className="h-3 w-24 bg-[#2A2F36] rounded" />
      </div>
      <div className="h-6 w-full bg-[#2A2F36] rounded mb-4" />
      <div className="h-2 w-full bg-[#2A2F36] rounded mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-6 w-16 bg-[#2A2F36] rounded" />
        <div className="h-6 w-12 bg-[#2A2F36] rounded" />
      </div>
    </div>
  );
}

export function FeaturedMarketSkeleton() {
  return (
    <div className="relative rounded-xl overflow-hidden border border-[#2A2F36] bg-[#1E2329] animate-pulse">
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-24 bg-[#2A2F36] rounded-full" />
          <div className="h-4 w-16 bg-[#2A2F36] rounded" />
        </div>
        <div className="h-10 w-full bg-[#2A2F36] rounded mb-4" />
        <div className="h-4 w-32 bg-[#2A2F36] rounded mb-6" />
        <div className="h-2 w-full bg-[#2A2F36] rounded mb-6" />
        <div className="h-12 w-full bg-[#2A2F36] rounded" />
      </div>
    </div>
  );
}

export function ConsensusCircleSkeleton() {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="w-[140px] h-[140px] rounded-full bg-[#2A2F36] mb-4" />
      <div className="h-4 w-24 bg-[#2A2F36] rounded" />
    </div>
  );
}

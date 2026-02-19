import { MarketCard } from "@/components/MarketCard";
import { FeaturedMarketCard } from "@/components/FeaturedMarketCard";
import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { MarketCardSkeleton, FeaturedMarketSkeleton } from "@/components/LoadingSkeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

type MarketWithStats = {
  id: string;
  topic_text: string;
  question_text: string;
  status: string;
  ends_at: string;
  yesPercentage: number;
  noPercentage: number;
  totalParticipants: number;
};

type MarketsPageProps = {
  searchParams: Promise<{
    category?: string;
    search?: string;
    topic?: string;
    trending?: string;
  }>;
};

async function getMarketsWithStats(
  category?: string,
  searchQuery?: string,
  topic?: string
) {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("markets")
    .select("id, topic_text, question_text, status, ends_at, subject_type")
    .eq("status", "open");

  // Aplicar filtro de categoría si existe
  if (category && category !== "All" && category !== "For You") {
    // Mapeo básico de categorías a subject_type o topic_text
    const categoryMap: Record<string, string> = {
      Politics: "public_figure",
      Sports: "event",
      Finance: "protocol"
    };
    
    if (categoryMap[category]) {
      query = query.eq("subject_type", categoryMap[category]);
    }
  }

  // Aplicar búsqueda si existe
  if (searchQuery) {
    query = query.or(
      `topic_text.ilike.%${searchQuery}%,question_text.ilike.%${searchQuery}%`
    );
  }

  // Aplicar filtro de tema si existe
  if (topic) {
    query = query.ilike("topic_text", `%${topic}%`);
  }

  query = query.order("ends_at", { ascending: true });

  const { data: markets, error } = await query;

  if (error || !markets) {
    return [];
  }

  const marketsWithStats: MarketWithStats[] = await Promise.all(
    markets.map(async (market) => {
      const { data: snapshot } = await supabase
        .from("market_snapshots")
        .select("total_predictions, yes_count, no_count")
        .eq("market_id", market.id)
        .order("snapshot_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const totalPredictions = snapshot?.total_predictions ?? 0;
      const yesCount = snapshot?.yes_count ?? 0;
      const noCount = snapshot?.no_count ?? 0;

      const yesPercentage =
        totalPredictions > 0
          ? Math.round((yesCount / totalPredictions) * 100)
          : 50;
      const noPercentage =
        totalPredictions > 0
          ? Math.round((noCount / totalPredictions) * 100)
          : 50;

      return {
        ...market,
        yesPercentage,
        noPercentage,
        totalParticipants: totalPredictions
      };
    })
  );

  // Para "For You", ordenar por participantes (más popular primero)
  if (category === "For You") {
    marketsWithStats.sort((a, b) => b.totalParticipants - a.totalParticipants);
  }

  return marketsWithStats;
}

async function MarketsContent({
  category,
  searchQuery
}: {
  category?: string;
  searchQuery?: string;
}) {
  const markets = await getMarketsWithStats(category, searchQuery);

  // Seleccionar mercado destacado (el más popular o el primero)
  const featuredMarket =
    markets.length > 0
      ? markets.reduce((prev, current) =>
          current.totalParticipants > prev.totalParticipants ? current : prev
        )
      : null;
  const otherMarkets = markets.filter((m) => m.id !== featuredMarket?.id);

  return (
    <>
      {/* Featured Market */}
      {featuredMarket && (
        <div className="mb-8">
          <FeaturedMarketCard
            id={featuredMarket.id}
            question_text={featuredMarket.question_text}
            topic_text={featuredMarket.topic_text}
            ends_at={featuredMarket.ends_at}
            yesPercentage={featuredMarket.yesPercentage}
            noPercentage={featuredMarket.noPercentage}
            totalParticipants={featuredMarket.totalParticipants}
          />
        </div>
      )}

      {/* Markets Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {otherMarkets.map((market) => (
          <MarketCard
            key={market.id}
            id={market.id}
            topic_text={market.topic_text}
            question_text={market.question_text}
            status={market.status}
            ends_at={market.ends_at}
            yesPercentage={market.yesPercentage}
            noPercentage={market.noPercentage}
            totalParticipants={market.totalParticipants}
          />
        ))}
      </div>

      {markets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#A0A5B0]">No hay mercados disponibles.</p>
        </div>
      )}
    </>
  );
}

export default async function MarketsPage({ searchParams }: MarketsPageProps) {
  const params = await searchParams;
  const category = params.category || "All";
  const searchQuery = params.search;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 lg:mr-80 px-4 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#2A2F36] overflow-x-auto">
          {["All", "For You", "Politics", "Sports", "Finance"].map((tab) => {
            const isActive = category === tab || (tab === "All" && !params.category);
            return (
              <a
                key={tab}
                href={`/markets${tab === "All" ? "" : `?category=${tab}`}`}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-[#3B82F6] text-white"
                    : "border-transparent text-[#A0A5B0] hover:text-white"
                }`}
              >
                {tab}
              </a>
            );
          })}
        </div>

        <Suspense
          fallback={
            <>
              <div className="mb-8">
                <FeaturedMarketSkeleton />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <MarketCardSkeleton key={i} />
                ))}
              </div>
            </>
          }
        >
          <MarketsContent category={category} searchQuery={searchQuery} />
        </Suspense>
      </main>
      <RightSidebar />
    </div>
  );
}

import { ConsensusCircle } from "@/components/ConsensusCircle";
import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { ParticipationCard } from "@/components/ParticipationCard";
import { formatDateTime } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Clock, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type MarketPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketPage({ params }: MarketPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: market, error } = await supabase
    .from("markets")
    .select(
      "id, topic_text, question_text, description, status, ends_at, starts_at, verification_source_url"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !market) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 mr-80 px-8 py-12">
          <p className="text-sm text-[#A0A5B0]">Mercado no encontrado.</p>
        </main>
        <RightSidebar />
      </div>
    );
  }

  const { data: snapshot } = await supabase
    .from("market_snapshots")
    .select("total_predictions, yes_count, no_count")
    .eq("market_id", id)
    .order("snapshot_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const totalPredictions = snapshot?.total_predictions ?? 0;
  const yesCount = snapshot?.yes_count ?? 0;
  const noCount = snapshot?.no_count ?? 0;

  const yesPercentage =
    totalPredictions > 0
      ? Math.round((yesCount / totalPredictions) * 100)
      : 0;
  const noPercentage =
    totalPredictions > 0
      ? Math.round((noCount / totalPredictions) * 100)
      : 0;

  const endsAt = new Date(market.ends_at);
  const now = new Date();
  const diffMs = endsAt.getTime() - now.getTime();
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 lg:mr-80 px-4 lg:px-8 py-12 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-[#A0A5B0]">
          <Link href="/markets" className="hover:text-white transition-colors">
            Eventos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#6B7280]">{market.topic_text}</span>
          <span className="mx-2">/</span>
          <span className="text-[#6B7280]">Elecciones 2024</span>
        </nav>

        {/* Question */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {market.question_text}
          </h1>
          {market.description && (
            <p className="text-lg text-[#A0A5B0] mb-6">{market.description}</p>
          )}

          {/* Source Box */}
          {market.verification_source_url && (
            <div className="bg-[#1E2329] border border-[#2A2F36] rounded-lg p-4 flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-[#3B82F6]" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-[#6B7280] uppercase mb-1">
                  FUENTE DE DISCUSIÓN
                </div>
                <a
                  href={market.verification_source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#3B82F6] hover:text-[#2563EB] flex items-center gap-2"
                >
                  Debate Público en Twitter/X
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Consensus Card */}
        <div className="bg-[#1E2329] border border-[#2A2F36] rounded-lg p-8 mb-8">
          <h2 className="text-xs font-semibold text-[#6B7280] uppercase mb-6">
            CONSENSO ACTUAL
          </h2>
          <div className="flex flex-col items-center mb-8">
            <ConsensusCircle
              percentage={yesPercentage}
              size={140}
              strokeWidth={10}
              label="A favor"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                <span className="text-xs font-semibold text-[#6B7280] uppercase">
                  A FAVOR
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{yesPercentage}%</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#6B7280]" />
                <span className="text-xs font-semibold text-[#6B7280] uppercase">
                  EN CONTRA
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{noPercentage}%</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#A0A5B0]" />
                <span className="text-xs font-semibold text-[#6B7280] uppercase">
                  PARTICIPANTES
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {totalPredictions.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-3 h-3 text-[#A0A5B0]" />
                <span className="text-xs font-semibold text-[#6B7280] uppercase">
                  RESTANTE
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{diffHours}h</div>
            </div>
          </div>
        </div>

        {/* Participation Card */}
        <ParticipationCard
          marketId={market.id}
          marketStatus={market.status}
          topicText={market.topic_text}
          questionText={market.question_text}
        />

        {/* Warning Banner */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 text-xl">⚠️</span>
            <div>
              <p className="text-sm font-medium text-yellow-500 mb-2">
                Esto muestra consenso social. No hay dinero real ni apuestas.
              </p>
              <p className="text-xs text-[#A0A5B0]">
                Chambresito utiliza créditos de participación no monetarios para
                visualizar la opinión pública. Los resultados no son vinculantes
                legalmente.
              </p>
            </div>
          </div>
        </div>
      </main>
      <RightSidebar />
    </div>
  );
}

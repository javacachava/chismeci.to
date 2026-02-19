import { Plus } from "lucide-react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { TrendingTopicsList } from "./TrendingTopicsList";

async function getTrendingTopics() {
  const supabase = await createSupabaseServerClient();

  // Obtener mercados abiertos con más participantes
  const { data: markets } = await supabase
    .from("markets")
    .select("id, topic_text, question_text")
    .eq("status", "open")
    .order("ends_at", { ascending: true })
    .limit(10);

  if (!markets || markets.length === 0) {
    return [];
  }

  // Obtener estadísticas de participantes para cada mercado
  const marketsWithStats = await Promise.all(
    markets.map(async (market) => {
      const { data: snapshot } = await supabase
        .from("market_snapshots")
        .select("total_predictions")
        .eq("market_id", market.id)
        .order("snapshot_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        id: market.id,
        title: market.question_text.length > 40 
          ? market.question_text.substring(0, 40) + "..." 
          : market.question_text,
        credits: snapshot?.total_predictions ?? 0
      };
    })
  );

  // Ordenar por participantes y tomar los top 5
  return marketsWithStats
    .sort((a, b) => b.credits - a.credits)
    .slice(0, 5);
}

export async function RightSidebar() {
  const trendingTopics = await getTrendingTopics();

  return (
    <aside className="hidden lg:block fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 border-l border-[#2A2F36] bg-[#151921] overflow-y-auto">
      <div className="p-6 space-y-8">
        {/* Have a question section */}
        <div className="bg-[#1E2329] rounded-lg p-6 border border-[#2A2F36]">
          <h3 className="text-lg font-semibold text-white mb-2">
            ¿Tienes una pregunta?
          </h3>
          <p className="text-sm text-[#A0A5B0] mb-4">
            Crea tu propio evento de consenso y gana créditos por participación.
          </p>
          <button className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Crear Evento
          </button>
        </div>

        {/* Trending Topics */}
        <TrendingTopicsList topics={trendingTopics} />

        {/* Footer Links */}
        <div className="pt-8 border-t border-[#2A2F36] space-y-2">
          <Link
            href="/terms"
            className="block text-sm text-[#A0A5B0] hover:text-white transition-colors"
          >
            Términos de Servicio
          </Link>
          <Link
            href="/privacy"
            className="block text-sm text-[#A0A5B0] hover:text-white transition-colors"
          >
            Política de Privacidad
          </Link>
          <Link
            href="/about"
            className="block text-sm text-[#A0A5B0] hover:text-white transition-colors"
          >
            Acerca de Chambresito
          </Link>
          <p className="text-xs text-[#6B7280] mt-4">
            © 2024 Chambresito Inc.
          </p>
        </div>
      </div>
    </aside>
  );
}

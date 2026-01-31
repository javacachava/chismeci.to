import { PredictionModal } from "@/components/PredictionModal";
import { formatDateTime } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

type MarketPageProps = {
  params: { id: string };
};

export default async function MarketPage({ params }: MarketPageProps) {
  const supabase = createSupabaseServerClient();

  const { data: market, error } = await supabase
    .from("markets")
    .select("id, topic_text, question_text, description, status, ends_at, starts_at")
    .eq("id", params.id)
    .maybeSingle();

  if (error || !market) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm text-neutral-600">Mercado no encontrado.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <div className="text-sm text-neutral-500">{market.topic_text}</div>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
          {market.question_text}
        </h1>
        {market.description ? (
          <p className="mt-3 text-sm text-neutral-600">{market.description}</p>
        ) : null}
        <div className="mt-4 text-sm text-neutral-600">
          Abre: {formatDateTime(market.starts_at)} · Cierra:{" "}
          {formatDateTime(market.ends_at)}
        </div>
        <div className="mt-2 inline-flex rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
          Estado: {market.status}
        </div>
      </div>
      <PredictionModal marketId={market.id} marketStatus={market.status} />
    </main>
  );
}

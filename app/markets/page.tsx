import { MarketCard } from "@/components/MarketCard";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function MarketsPage() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("markets")
    .select("id, topic_text, question_text, status, ends_at")
    .order("ends_at", { ascending: true });

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Mercados disponibles
        </h1>
        <p className="mt-4 text-sm text-neutral-600">
          No se pudo cargar la lista de mercados.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Mercados disponibles
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Participa con créditos de servicio. No hay dinero ni premios.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((market) => (
          <MarketCard key={market.id} {...market} />
        ))}
      </div>
    </main>
  );
}

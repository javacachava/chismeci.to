export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#151921] text-white px-6">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-[#3B82F6] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Página no encontrada</h2>
        <p className="text-[#A0A5B0] mb-8">
          El contenido que buscas no existe o fue movido.
        </p>
        <a
          href="/markets"
          className="inline-block px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors"
        >
          Ir a Mercados
        </a>
      </div>
    </main>
  );
}

import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#151921] py-20 lg:py-32">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#3B82F6]/20 rounded-[100%] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#2563EB]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#1E2329] border border-[#2A2F36] px-4 py-1.5 mb-8">
          <Trophy className="w-4 h-4 text-[#3B82F6]" />
          <span className="text-sm font-medium text-[#A0A5B0]">La plataforma #1 de predicciones sociales</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white lg:text-7xl mb-6">
          Predice el <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]">Futuro</span>.
          <br />
          Gana <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#93C5FD]">Respeto</span>.
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-[#A0A5B0] mb-10 leading-relaxed">
          Únete a la comunidad donde tu intuición es la moneda. Predice eventos reales sin arriesgar dinero real. Sube en el leaderboard y demuestra que tienes razón.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/markets"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
          >
            Explorar Mercados
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
          </Link>
          
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1E2329] hover:bg-[#2A2F36] text-white border border-[#2A2F36] rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
          >
            Ver Ranking Global
          </Link>
        </div>

        {/* Stats Preview */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-[#2A2F36] pt-10">
          <div>
            <div className="text-3xl font-bold text-white mb-2">10k+</div>
            <div className="text-[#A0A5B0]">Predicciones Realizadas</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">0%</div>
            <div className="text-[#A0A5B0]">Riesgo Financiero</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-[#A0A5B0]">Mercados Activos</div>
          </div>
        </div>
      </div>
    </section>
  );
}

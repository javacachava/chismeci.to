import { Clock, Users } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";

const MOCK_MARKETS = [
  {
    topic: "Cripto",
    question: "¿Bitcoin alcanzará los $100k antes de fin de año?",
    yes: 65,
    no: 35,
    votes: 12500,
    time: "2d",
    color: "from-orange-500/20 to-orange-600/5",
    iconColor: "text-orange-500"
  },
  {
    topic: "Política",
    question: "¿Se aprobará la nueva reforma ley de ciberseguridad?",
    yes: 42,
    no: 58,
    votes: 8430,
    time: "5h",
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-500"
  },
  {
    topic: "Social",
    question: "¿TikTok será prohibido en más países este mes?",
    yes: 28,
    no: 72,
    votes: 15200,
    time: "12h",
    color: "from-pink-500/20 to-pink-600/5",
    iconColor: "text-pink-500"
  },
  {
    topic: "Tendencias",
    question: "¿El movimiento Therian se volverá mainstream en 2026?",
    yes: 15,
    no: 85,
    votes: 5600,
    time: "4d",
    color: "from-green-500/20 to-green-600/5",
    iconColor: "text-green-500"
  }
];

function MockCard({ market }: { market: typeof MOCK_MARKETS[0] }) {
  return (
    <div className={`relative rounded-xl overflow-hidden border border-[#2A2F36] bg-[#1E2329] hover:border-[#3B82F6]/50 transition-all group h-full hover:-translate-y-1 hover:shadow-xl hover:shadow-[#3B82F6]/10`}>
      {/* Gradient Background Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${market.color} opacity-30`} />
      
      <div className="relative p-5 flex flex-col h-full z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-bold px-2 py-1 rounded bg-[#2A2F36] ${market.iconColor} bg-opacity-50`}>
            {market.topic}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[#A0A5B0]">
            <Clock className="w-3.5 h-3.5" />
            <span>{market.time}</span>
          </div>
        </div>

        {/* Question */}
        <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-[#3B82F6] transition-colors flex-grow">
          {market.question}
        </h3>

        {/* Stats */}
        <div className="space-y-4">
          <ProgressBar
            yesPercentage={market.yes}
            noPercentage={market.no}
            showLabels={true}
          />

          <div className="flex items-center justify-between pt-2 border-t border-[#2A2F36]/50">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-[#2A2F36] border-2 border-[#1E2329] flex items-center justify-center">
                    <Users className="w-3 h-3 text-[#A0A5B0]" />
                  </div>
                ))}
              </div>
              <span className="text-xs text-[#A0A5B0] font-medium">
                +{market.votes.toLocaleString()} votos
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MarketPreview() {
  return (
    <section className="py-24 bg-[#151921] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Predicciones en <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]">Tendencia</span>
            </h2>
            <p className="text-[#A0A5B0] text-lg">
              Desde finanzas hasta cultura pop. Si la gente está hablando de ello, puedes predecirlo aquí.
            </p>
          </div>
          <div className="hidden md:block">
            {/* Decoration line */}
            <div className="h-px w-32 bg-gradient-to-r from-[#3B82F6] to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_MARKETS.map((market, index) => (
            <MockCard key={index} market={market} />
          ))}
        </div>
      </div>
    </section>
  );
}

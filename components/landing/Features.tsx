import { Shield, Zap, Globe, Users, TrendingUp, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Sin Riesgo Financiero",
    description: "Usa créditos virtuales para participar. La emoción de predecir sin perder un centavo de tu bolsillo."
  },
  {
    icon: Zap,
    title: "Tiempo Real con X",
    description: "Nuestros mercados se alimentan de las tendencias más calientes de X (Twitter). Si es viral, está aquí."
  },
  {
    icon: Award,
    title: "Competencia Global",
    description: "Compite con predictores de todo el mundo. Sube de rango y gana badges exclusivos."
  },
  {
    icon: TrendingUp,
    title: "Mercados Dinámicos",
    description: "Probabilidades que cambian en tiempo real basadas en la sabiduría de la multitud."
  },
  {
    icon: Users,
    title: "Comunidad Activa",
    description: "Discute teorías, debate resultados y analiza tendencias con otros expertos."
  },
  {
    icon: Globe,
    title: "Transparencia Total",
    description: "Resolución de mercados verificable y basada en fuentes oficiales. Sin trucos."
  }
];

export function Features() {
  return (
    <section className="py-24 bg-[#151921] relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            ¿Por qué <span className="text-[#3B82F6]">Chambresito</span>?
          </h2>
          <p className="text-[#A0A5B0] text-lg">
            Reinventamos las predicciones eliminando el riesgo y maximizando la diversión y la competencia social.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-[#1E2329] border border-[#2A2F36] hover:border-[#3B82F6]/50 transition-colors hover:bg-[#1E2329]/80"
            >
              <div className="w-12 h-12 rounded-lg bg-[#2A2F36] flex items-center justify-center mb-6 group-hover:bg-[#3B82F6]/20 transition-colors">
                <feature.icon className="w-6 h-6 text-[#A0A5B0] group-hover:text-[#3B82F6] transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-[#A0A5B0] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

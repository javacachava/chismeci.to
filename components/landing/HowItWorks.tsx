import { UserPlus, Coins, BarChart2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Únete Gratis",
    description: "Crea tu cuenta en segundos y recibe tus primeros créditos de bienvenida.",
    icon: UserPlus
  },
  {
    number: "02",
    title: "Obtén Créditos",
    description: "Recibe créditos diarios y bonificaciones por actividad. Sin comprar nada.",
    icon: Coins
  },
  {
    number: "03",
    title: "Predice y Gana",
    description: "Elige tus mercados favoritos, coloca tus predicciones y sube en el ranking.",
    icon: BarChart2
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-[#1E2329] border-y border-[#2A2F36]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Cómo Funciona
          </h2>
          <p className="text-[#A0A5B0] text-lg">
            Empieza a ganar reputación en tres simples pasos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-[#2A2F36] to-transparent z-0" />

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#151921] border-2 border-[#3B82F6] flex items-center justify-center mb-6 shadow-lg shadow-[#3B82F6]/20">
                <span className="text-[#3B82F6] font-bold text-lg">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-[#A0A5B0] leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Hero } from "@/components/landing/Hero";
import { MarketPreview } from "@/components/landing/MarketPreview";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#151921] text-white">
      <Hero />
      <MarketPreview />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
}

import Link from "next/link";
import { Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#151921] border-t border-[#2A2F36] py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-white mb-4"
            >
              <div className="w-8 h-8 rounded bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <span>Chambresito</span>
            </Link>
            <p className="text-[#6B7280] text-sm">
              La plataforma de predicciones social donde tu reputación es lo que cuenta.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Plataforma</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/markets" className="text-[#A0A5B0] hover:text-[#3B82F6] text-sm transition-colors">
                  Mercados
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-[#A0A5B0] hover:text-[#3B82F6] text-sm transition-colors">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-[#A0A5B0] hover:text-[#3B82F6] text-sm transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#A0A5B0] hover:text-[#3B82F6] text-sm transition-colors">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Social</h4>
            <div className="flex gap-4">
              <a href="#" className="text-[#A0A5B0] hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#A0A5B0] hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#2A2F36] pt-8 text-center md:text-left">
          <p className="text-[#6B7280] text-sm">
            &copy; {new Date().getFullYear()} Chambresito. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

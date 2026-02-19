"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";

type AuthButtonProps = {
  userEmail: string | null;
};

export function AuthButton({ userEmail }: AuthButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setStatus("error");
    } else {
      setStatus("sent");
    }
  };

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (userEmail) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#A0A5B0]">{userEmail}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-[#A0A5B0] underline hover:text-white transition-colors"
        >
          Salir
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-[#A0A5B0] underline hover:text-white transition-colors"
      >
        Iniciar sesión
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-10 w-64 rounded-md border border-[#2A2F36] bg-[#1E2329] p-4 shadow-lg">
          {status === "sent" ? (
            <p className="text-sm text-[#A0A5B0]">
              Enlace enviado a tu correo. Revisa tu bandeja de entrada.
            </p>
          ) : (
            <form onSubmit={handleLogin}>
              <label className="block text-sm text-[#A0A5B0] mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="mt-1 w-full rounded border border-[#2A2F36] bg-[#151921] px-3 py-2 text-sm text-white placeholder-[#6B7280] focus:border-[#3B82F6] focus:outline-none"
                disabled={status === "loading"}
              />
              {status === "error" && (
                <p className="mt-2 text-sm text-red-500">
                  Error al enviar. Intenta de nuevo.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-3 w-full rounded bg-[#3B82F6] hover:bg-[#2563EB] px-3 py-2 text-sm text-white disabled:opacity-50 transition-colors"
              >
                {status === "loading" ? "Enviando..." : "Enviar enlace"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

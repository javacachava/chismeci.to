"use client";

import { useState, useEffect, useMemo } from "react";
import { createSupabaseBrowserClient } from "./supabaseBrowser";

/**
 * Hook para obtener créditos disponibles del usuario
 * Por ahora retorna un valor por defecto, pero está preparado para integrar con Vudy API
 */
export function useUserCredits() {
  const [credits, setCredits] = useState<number>(500); // Valor por defecto
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const session = await supabase.auth.getSession();
        if (!session.data.session) {
          setCredits(0);
          setIsLoading(false);
          return;
        }

        // TODO: Integrar con Vudy API para obtener créditos reales
        // Por ahora usamos un valor por defecto basado en reputación o un valor fijo
        // Ejemplo de integración futura:
        // const response = await fetch('/api/user/credits', {
        //   headers: { Authorization: `Bearer ${session.data.session.access_token}` }
        // });
        // const data = await response.json();
        // setCredits(data.credits || 500);

        // Por ahora, intentamos obtener desde /api/me para ver si hay reputación
        const accessToken = session.data.session.access_token;
        const response = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (response.ok) {
          const data = await response.json();
          // Usar reputación como créditos aproximados, o valor por defecto
          const reputationCredits = data.reputation?.total_points || 500;
          setCredits(Math.max(100, reputationCredits)); // Mínimo 100 créditos
        } else {
          // Si falla, usar valor por defecto
          setCredits(500);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
        setCredits(500); // Valor por defecto en caso de error
      } finally {
        setIsLoading(false);
      }
    }

    fetchCredits();
  }, [supabase]);

  return { credits, isLoading };
}

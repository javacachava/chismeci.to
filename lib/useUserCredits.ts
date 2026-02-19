"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "./supabaseBrowser";

export function useUserCredits() {
  const [credits, setCredits] = useState<number>(500);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // createSupabaseBrowserClient only called on the client, never during SSR
    const supabase = createSupabaseBrowserClient();

    async function fetchCredits() {
      try {
        const session = await supabase.auth.getSession();
        if (!session.data.session) {
          setCredits(0);
          setIsLoading(false);
          return;
        }

        const accessToken = session.data.session.access_token;
        const response = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (response.ok) {
          const data = await response.json();
          const reputationCredits = data.reputation?.total_points || 500;
          setCredits(Math.max(100, reputationCredits));
        } else {
          setCredits(500);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
        setCredits(500);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCredits();
  }, []);

  return { credits, isLoading };
}

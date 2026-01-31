"use client";

import { useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PredictionModalProps = {
  marketId: string;
  marketStatus: string;
};

const DEFAULT_AMOUNT = 10;

export function PredictionModal({ marketId, marketStatus }: PredictionModalProps) {
  const [choice, setChoice] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [message, setMessage] = useState<string | null>(null);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const disabled = marketStatus !== "open";

  async function handleSubmit() {
    setMessage(null);

    const session = await supabase.auth.getSession();
    const accessToken = session.data.session?.access_token;

    if (!accessToken) {
      setMessage("Necesitas iniciar sesión para participar.");
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/placePrediction`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        market_id: marketId,
        choice,
        amount
      })
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      setMessage(
        errorPayload?.error ?? "No se pudo registrar tu participación."
      );
      return;
    }

    setMessage("Participación registrada con éxito.");
  }

  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      <h3 className="text-base font-semibold text-neutral-900">
        Participar con créditos
      </h3>
      <p className="mt-1 text-sm text-neutral-600">
        Los créditos de participación son servicios externos. No representan dinero.
      </p>
      <div className="mt-4 flex gap-3">
        <button
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            choice === "yes"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-700"
          }`}
          onClick={() => setChoice("yes")}
          type="button"
        >
          Sí
        </button>
        <button
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            choice === "no"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-700"
          }`}
          onClick={() => setChoice("no")}
          type="button"
        >
          No
        </button>
      </div>
      <div className="mt-4">
        <label className="text-sm text-neutral-600" htmlFor="amount">
          Créditos a usar
        </label>
        <Input
          className="mt-1"
          id="amount"
          min={1}
          onChange={(event) => setAmount(Number(event.target.value))}
          type="number"
          value={amount}
        />
      </div>
      <Button
        className="mt-4 w-full"
        disabled={disabled}
        onClick={handleSubmit}
        type="button"
      >
        {disabled ? "Mercado cerrado" : "Confirmar participación"}
      </Button>
      {message ? <p className="mt-3 text-sm text-neutral-700">{message}</p> : null}
    </div>
  );
}

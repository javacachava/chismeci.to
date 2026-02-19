"use client";

import { useState, useEffect, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import { Slider } from "@/components/ui/slider";
import { ThumbsUp, ThumbsDown, Check, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type PredictionModalProps = {
  marketId: string;
  marketStatus: string;
  topicText?: string;
  questionText?: string;
  availableCredits?: number;
  onClose?: () => void;
  showHeader?: boolean;
};

const DEFAULT_AMOUNT = 50;
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 100;
const DEFAULT_CREDITS = 100;

export function PredictionModal({
  marketId,
  marketStatus,
  topicText,
  questionText,
  availableCredits = DEFAULT_CREDITS,
  onClose,
  showHeader = false
}: PredictionModalProps) {
  const [choice, setChoice] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabaseRef = useRef<ReturnType<typeof createSupabaseBrowserClient> | null>(null);

  useEffect(() => {
    supabaseRef.current = createSupabaseBrowserClient();
  }, []);

  const disabled = marketStatus !== "open";

  async function handleSubmit() {
    if (disabled || isSubmitting) return;

    setMessage(null);
    setIsSubmitting(true);

    const session = await supabaseRef.current?.auth.getSession();
    const accessToken = session?.data.session?.access_token;

    const url = "/api/predictions";

    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          market_id: marketId,
          choice,
          amount,
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        setMessage(
          errorPayload?.error ?? "No se pudo registrar tu participación."
        );
        return;
      }

      setMessage("Participación registrada con éxito.");
      // Reset form after success
      setTimeout(() => {
        setAmount(DEFAULT_AMOUNT);
        setMessage(null);
        if (onClose) {
          onClose();
        }
      }, 2000);
    } catch (error) {
      setMessage("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 relative">
      {/* Header with category and question (when showHeader is true or when topic/question provided) */}
      {(showHeader || (topicText || questionText)) && (
        <div className="mb-6 pb-6 border-b border-[#2A2F36]">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-[#A0A5B0] hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {topicText && (
            <div className="text-xs font-semibold text-[#6B7280] uppercase mb-2">
              {topicText.toUpperCase()}
            </div>
          )}
          {questionText && (
            <h3 className="text-xl font-bold text-white mb-3">{questionText}</h3>
          )}
          <p className="text-sm text-[#A0A5B0]">
            Participa en este evento antes de que cierre
          </p>
        </div>
      )}

      {/* Prediction Choice */}
      <div>
        <label className="block text-sm font-medium text-[#A0A5B0] mb-4">
          Tu predicción
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setChoice("yes")}
            disabled={disabled}
            className={cn(
              "relative flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all",
              choice === "yes"
                ? "bg-[#1E3A5F] border-[#3B82F6]"
                : "bg-[#1E2329] border-[#2A2F36] hover:border-[#3B82F6]/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {choice === "yes" && (
              <Check className="absolute top-2 right-2 w-5 h-5 text-[#3B82F6]" />
            )}
            <ThumbsUp className="w-8 h-8 mb-2 text-[#3B82F6]" />
            <span className="text-sm font-medium text-white">Sí</span>
          </button>

          <button
            type="button"
            onClick={() => setChoice("no")}
            disabled={disabled}
            className={cn(
              "relative flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all",
              choice === "no"
                ? "bg-[#1E3A5F] border-[#3B82F6]"
                : "bg-[#1E2329] border-[#2A2F36] hover:border-[#3B82F6]/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {choice === "no" && (
              <Check className="absolute top-2 right-2 w-5 h-5 text-[#3B82F6]" />
            )}
            <ThumbsDown className="w-8 h-8 mb-2 text-[#6B7280]" />
            <span className="text-sm font-medium text-white">No</span>
          </button>
        </div>
      </div>

      {/* Credits Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-[#A0A5B0]">
            Créditos a usar
          </label>
          <div className="text-right">
            <div className="text-xs text-[#6B7280] mb-1">DISPONIBLES</div>
            <div className="flex items-center gap-2 text-[#A0A5B0]">
              <span className="text-lg">💎</span>
              <span className="text-sm font-medium">{availableCredits}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Slider
            value={amount}
            onChange={setAmount}
            min={MIN_AMOUNT}
            max={Math.min(MAX_AMOUNT, availableCredits)}
            disabled={disabled}
          />

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAmount(MIN_AMOUNT)}
                disabled={disabled}
                className="px-3 py-1 text-xs font-medium text-[#A0A5B0] hover:text-white transition-colors disabled:opacity-50"
              >
                MIN
              </button>
              <button
                type="button"
                onClick={() => setAmount(Math.min(MAX_AMOUNT, availableCredits))}
                disabled={disabled}
                className="px-3 py-1 text-xs font-medium text-[#A0A5B0] hover:text-white transition-colors disabled:opacity-50"
              >
                MAX
              </button>
            </div>
            <div className="bg-[#1E2329] border border-[#2A2F36] rounded-lg px-4 py-2">
              <span className="text-lg font-semibold text-white">{amount}</span>
            </div>
          </div>

          <p className="text-xs text-[#6B7280]">
            Usa créditos de participación para expresar tu predicción
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || isSubmitting}
        className={cn(
          "w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2",
          (disabled || isSubmitting) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isSubmitting ? (
          "Procesando..."
        ) : (
          <>
            Confirmar participación
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {message && (
        <div
          className={cn(
            "p-3 rounded-lg text-sm",
            message.includes("éxito")
              ? "bg-green-500/10 text-green-500 border border-green-500/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          )}
        >
          {message}
        </div>
      )}
    </div>
  );
}

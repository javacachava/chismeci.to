"use client";

import { PredictionModal } from "./PredictionModal";
import { useUserCredits } from "@/lib/useUserCredits";

type ParticipationCardProps = {
  marketId: string;
  marketStatus: string;
  topicText?: string;
  questionText?: string;
};

export function ParticipationCard({
  marketId,
  marketStatus,
  topicText,
  questionText
}: ParticipationCardProps) {
  const { credits, isLoading } = useUserCredits();

  return (
    <div className="bg-[#1E2329] border border-[#2A2F36] rounded-lg p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">
          Participar en el consenso
        </h2>
        <div className="text-right">
          <div className="text-xs text-[#6B7280] mb-1">DISPONIBLES</div>
          <div className="flex items-center gap-2 text-[#A0A5B0]">
            <span className="text-lg">💎</span>
            <span className="text-sm font-medium">
              {isLoading ? "..." : `${credits.toLocaleString()} Créditos Disp.`}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-[#A0A5B0] mb-6">
        Utiliza tus créditos de reputación para opinar.
      </p>
      <PredictionModal
        marketId={marketId}
        marketStatus={marketStatus}
        topicText={topicText}
        questionText={questionText}
        availableCredits={credits}
      />
    </div>
  );
}

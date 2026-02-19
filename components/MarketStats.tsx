type MarketStatsProps = {
  yesPercentage: number;
  noPercentage: number;
  totalPredictions: number;
};

export function MarketStats({
  yesPercentage,
  noPercentage,
  totalPredictions
}: MarketStatsProps) {
  return (
    <div className="rounded-lg border border-[#2A2F36] bg-[#1E2329] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-white">
          Participación
        </span>
        <span className="text-sm text-[#A0A5B0]">
          {totalPredictions} {totalPredictions === 1 ? "predicción" : "predicciones"}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-[#A0A5B0]">Sí</span>
            <span className="font-medium text-white">{yesPercentage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#2A2F36]">
            <div
              className="h-full bg-[#3B82F6] transition-all"
              style={{ width: `${yesPercentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-[#A0A5B0]">No</span>
            <span className="font-medium text-white">{noPercentage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#2A2F36]">
            <div
              className="h-full bg-[#6B7280] transition-all"
              style={{ width: `${noPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

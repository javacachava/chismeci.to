type ProgressBarProps = {
  yesPercentage: number;
  noPercentage: number;
  showLabels?: boolean;
  className?: string;
};

export function ProgressBar({
  yesPercentage,
  noPercentage,
  showLabels = true,
  className = ""
}: ProgressBarProps) {
  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-white font-medium">
            {yesPercentage}% Sí
          </span>
          <span className="text-[#A0A5B0] font-medium">
            {noPercentage}% No
          </span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-[#2A2F36] overflow-hidden flex">
        <div
          className="h-full bg-[#3B82F6] transition-all duration-500 ease-out"
          style={{ width: `${yesPercentage}%` }}
        />
        <div
          className="h-full bg-[#6B7280] transition-all duration-500 ease-out"
          style={{ width: `${noPercentage}%` }}
        />
      </div>
    </div>
  );
}

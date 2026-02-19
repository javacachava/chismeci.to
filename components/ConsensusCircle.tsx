"use client";

import { useEffect, useState } from "react";

type ConsensusCircleProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
};

export function ConsensusCircle({
  percentage,
  size = 120,
  strokeWidth = 8,
  className = "",
  label
}: ConsensusCircleProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = percentage / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= percentage) {
        setAnimatedPercentage(percentage);
        clearInterval(timer);
      } else {
        setAnimatedPercentage(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2A2F36"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#3B82F6"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {Math.round(animatedPercentage)}%
          </span>
          {label && (
            <span className="text-sm text-[#3B82F6] mt-1">{label}</span>
          )}
        </div>
      </div>
    </div>
  );
}

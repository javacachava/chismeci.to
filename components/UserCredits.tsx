"use client";

import { Coins } from "lucide-react";
import { useUserCredits } from "@/lib/useUserCredits";

export function UserCredits() {
  const { credits, isLoading } = useUserCredits();

  return (
    <button className="flex items-center gap-2 bg-[#1E2329] border border-[#2A2F36] rounded-lg px-3 md:px-4 py-2 hover:bg-[#2A2F36] transition-colors">
      <Coins className="w-4 h-4 text-[#3B82F6]" />
      <span className="hidden sm:inline text-sm font-medium text-white">
        {isLoading ? "..." : `${credits.toLocaleString()} Credits`}
      </span>
    </button>
  );
}

"use client";

import { TrendingUp } from "lucide-react";
import Link from "next/link";

type TrendingTopic = {
  id: string;
  title: string;
  credits: number;
};

type TrendingTopicsListProps = {
  topics: TrendingTopic[];
};

export function TrendingTopicsList({ topics }: TrendingTopicsListProps) {
  const formatCredits = (credits: number) => {
    if (credits >= 1000) {
      return `${(credits / 1000).toFixed(1)}k`;
    }
    return credits.toString();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
        Trending Topics
      </h3>
      {topics.length === 0 ? (
        <p className="text-sm text-[#A0A5B0]">No hay temas trending aún.</p>
      ) : (
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <Link
              key={topic.id}
              href={`/markets/${topic.id}`}
              className="flex items-center justify-between p-3 rounded-lg bg-[#1E2329] border border-[#2A2F36] hover:bg-[#2A2F36] transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl font-bold text-[#6B7280] group-hover:text-[#3B82F6] transition-colors flex-shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-white truncate">
                  {topic.title}
                </span>
              </div>
              <span className="text-xs text-[#A0A5B0] flex-shrink-0 ml-2">
                {formatCredits(topic.credits)} Credits
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

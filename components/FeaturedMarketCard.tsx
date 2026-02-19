import Link from "next/link";
import { Clock } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { formatDateTime } from "@/lib/format";

type FeaturedMarketCardProps = {
  id: string;
  question_text: string;
  topic_text: string;
  ends_at: string;
  yesPercentage: number;
  noPercentage: number;
  totalParticipants: number;
  imageUrl?: string;
};

export function FeaturedMarketCard({
  id,
  question_text,
  topic_text,
  ends_at,
  yesPercentage,
  noPercentage,
  totalParticipants,
  imageUrl
}: FeaturedMarketCardProps) {
  const endsAt = new Date(ends_at);
  const now = new Date();
  const hoursLeft = Math.max(0, Math.floor((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60)));

  return (
    <Link href={`/markets/${id}`}>
      <div
        className="relative rounded-xl overflow-hidden border border-[#2A2F36] bg-[#1E2329] hover:border-[#3B82F6] transition-all group cursor-pointer"
        style={{
          backgroundImage: imageUrl
            ? `linear-gradient(rgba(21, 25, 33, 0.85), rgba(21, 25, 33, 0.85)), url(${imageUrl})`
            : "linear-gradient(135deg, #1E2329 0%, #2A2F36 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="p-8">
          {/* Badge and Time */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#3B82F6] text-white">
              FEATURED
            </span>
            <div className="flex items-center gap-2 text-sm text-[#A0A5B0]">
              <Clock className="w-4 h-4" />
              <span>{hoursLeft}h left</span>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-[#3B82F6] transition-colors">
            {question_text}
          </h2>

          {/* Participants */}
          <p className="text-sm text-[#A0A5B0] mb-6">
            {totalParticipants.toLocaleString()} Participants
          </p>

          {/* Consensus Bar */}
          <div className="mb-6">
            <ProgressBar
              yesPercentage={yesPercentage}
              noPercentage={noPercentage}
              showLabels={true}
            />
          </div>

          {/* Vote Button */}
          <button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Vote Now
          </button>
        </div>
      </div>
    </Link>
  );
}

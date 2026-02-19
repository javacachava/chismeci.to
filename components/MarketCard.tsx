import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

type MarketCardProps = {
  id: string;
  topic_text: string;
  question_text: string;
  status: string;
  ends_at: string;
  yesPercentage?: number;
  noPercentage?: number;
  totalParticipants?: number;
  imageUrl?: string;
};

export function MarketCard({
  id,
  topic_text,
  question_text,
  status,
  ends_at,
  yesPercentage = 50,
  noPercentage = 50,
  totalParticipants = 0,
  imageUrl
}: MarketCardProps) {
  const endsAt = new Date(ends_at);
  const now = new Date();
  const diffMs = endsAt.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  let timeLeft = "";
  if (diffDays > 0) {
    timeLeft = `${diffDays}d`;
  } else if (diffHours > 0) {
    timeLeft = `${diffHours}h`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    timeLeft = diffMinutes > 0 ? `${diffMinutes}m` : "Ends tomorrow";
  }

  return (
    <Link href={`/markets/${id}`}>
      <div
        className="relative rounded-lg overflow-hidden border border-[#2A2F36] bg-[#1E2329] hover:border-[#3B82F6] transition-all group cursor-pointer h-full"
        style={{
          backgroundImage: imageUrl
            ? `linear-gradient(rgba(30, 35, 41, 0.9), rgba(30, 35, 41, 0.9)), url(${imageUrl})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Time and Category */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs text-[#A0A5B0]">
              <Clock className="w-3 h-3" />
              <span>{timeLeft}</span>
            </div>
            <span className="text-xs text-[#A0A5B0]">
              {topic_text} • {totalParticipants.toLocaleString()} Votes
            </span>
          </div>

          {/* Question */}
          <h3 className="text-lg font-semibold text-white mb-4 line-clamp-2 group-hover:text-[#3B82F6] transition-colors flex-grow">
            {question_text}
          </h3>

          {/* Consensus Bar */}
          <div className="mb-4">
            <ProgressBar
              yesPercentage={yesPercentage}
              noPercentage={noPercentage}
              showLabels={false}
            />
          </div>

          {/* Participants Avatars and Vote Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-[#3B82F6] border-2 border-[#1E2329] flex items-center justify-center"
                  >
                    <Users className="w-3 h-3 text-white" />
                  </div>
                ))}
              </div>
            </div>
            <button className="text-sm font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors">
              Vote
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

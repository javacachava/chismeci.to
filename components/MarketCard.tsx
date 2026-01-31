import Link from "next/link";
import { formatDateTime } from "@/lib/format";

type MarketCardProps = {
  id: string;
  topic_text: string;
  question_text: string;
  status: string;
  ends_at: string;
};

export function MarketCard({
  id,
  topic_text,
  question_text,
  status,
  ends_at
}: MarketCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 p-4 shadow-sm">
      <div className="text-sm text-neutral-500">{topic_text}</div>
      <h3 className="mt-2 text-lg font-semibold text-neutral-900">{question_text}</h3>
      <div className="mt-2 text-sm text-neutral-600">
        Cierre: {formatDateTime(ends_at)}
      </div>
      <div className="mt-2 inline-flex rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
        Estado: {status}
      </div>
      <div className="mt-4">
        <Link
          className="inline-flex items-center rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
          href={`/markets/${id}`}
        >
          Ver detalle
        </Link>
      </div>
    </div>
  );
}

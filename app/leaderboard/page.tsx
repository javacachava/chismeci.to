import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Trophy, Medal, Award } from "lucide-react";

type LeaderboardEntry = {
  user_id: string;
  total_points: number;
  correct_predictions: number;
  email?: string;
};

async function getLeaderboard() {
  const supabase = await createSupabaseServerClient();

  // Obtener puntos de reputación agrupados por usuario
  const { data: reputationData, error } = await supabase
    .from("reputation_points")
    .select("user_id, points")
    .order("created_at", { ascending: false });

  if (error || !reputationData) {
    return [];
  }

  // Agrupar por usuario y calcular totales
  const userMap = new Map<string, LeaderboardEntry>();

  for (const entry of reputationData) {
    const existing = userMap.get(entry.user_id) || {
      user_id: entry.user_id,
      total_points: 0,
      correct_predictions: 0
    };
    existing.total_points += entry.points;
    existing.correct_predictions += 1;
    userMap.set(entry.user_id, existing);
  }

  // Convertir a array y ordenar por puntos
  const leaderboard = Array.from(userMap.values()).sort(
    (a, b) => b.total_points - a.total_points
  );

  return leaderboard.slice(0, 100); // Top 100
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 2) return <Award className="w-6 h-6 text-orange-600" />;
    return (
      <span className="w-6 h-6 flex items-center justify-center text-sm font-semibold text-[#6B7280]">
        {rank + 1}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 lg:mr-80 px-4 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            Leaderboard
          </h1>
          <p className="text-[#A0A5B0] mb-8">
            Ranking de usuarios por puntos de reputación
          </p>

          {leaderboard.length === 0 ? (
            <div className="bg-[#1E2329] border border-[#2A2F36] rounded-lg p-12 text-center">
              <p className="text-[#A0A5B0]">
                Aún no hay usuarios en el leaderboard. ¡Sé el primero en participar!
              </p>
            </div>
          ) : (
            <div className="bg-[#1E2329] border border-[#2A2F36] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#151921] border-b border-[#2A2F36]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">
                        Rango
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase">
                        Usuario
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-[#6B7280] uppercase">
                        Puntos
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-[#6B7280] uppercase">
                        Predicciones Correctas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr
                        key={entry.user_id}
                        className="border-b border-[#2A2F36] hover:bg-[#151921] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getRankIcon(index)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {entry.user_id.slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-white font-medium">
                              Usuario {entry.user_id.slice(0, 8)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-white font-semibold">
                            {entry.total_points.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-[#A0A5B0]">
                            {entry.correct_predictions}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <RightSidebar />
    </div>
  );
}

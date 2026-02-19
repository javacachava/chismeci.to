import Link from "next/link";
import { Search, User } from "lucide-react";
import { createSupabaseServerClient, getDevUser } from "@/lib/supabaseServer";
import { AuthButton } from "./AuthButton";
import { UserCredits } from "./UserCredits";

export async function Header() {
  const devUser = getDevUser();

  let userEmail: string | null = null;

  try {
    if (devUser) {
      userEmail = devUser.email;
    } else {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      userEmail = user?.email ?? null;
    }
  } catch {
    // During build time env vars may not be available — render header without user
    userEmail = null;
  }

  return (
    <header className="border-b border-[#2A2F36] bg-[#151921] sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/markets"
          className="flex items-center gap-2 text-xl font-semibold text-white hover:text-[#3B82F6] transition-colors"
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <span>Chambresito</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <form action="/markets" method="get" className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A5B0] w-4 h-4" />
            <input
              type="text"
              name="search"
              placeholder="Buscar temas..."
              className="w-full bg-[#1E2329] border border-[#2A2F36] rounded-lg pl-10 pr-4 py-2 text-white placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </form>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/markets"
            className="hidden md:block text-sm text-[#A0A5B0] hover:text-white transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/leaderboard"
            className="hidden md:block text-sm text-[#A0A5B0] hover:text-white transition-colors"
          >
            Leaderboard
          </Link>
          
          {/* Credits Button */}
          <UserCredits />

          {/* User Avatar */}
          {userEmail ? (
            <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
              <User className="w-5 h-5 text-white" />
            </div>
          ) : (
            <AuthButton userEmail={userEmail} />
          )}
        </div>
      </div>
    </header>
  );
}

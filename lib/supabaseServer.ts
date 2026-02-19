import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export type DevUser = {
  id: string;
  email: string;
};

export function getDevUser(): DevUser | null {
  if (process.env.DEV_BYPASS_AUTH !== "true") return null;
  return {
    id: process.env.DEV_USER_ID ?? "00000000-0000-0000-0000-000000000001",
    email: process.env.DEV_USER_EMAIL ?? "dev@example.com",
  };
}

export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const cookieStore = await cookies();


  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method is called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      }
    }
  });
}

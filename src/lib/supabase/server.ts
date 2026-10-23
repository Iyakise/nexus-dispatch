import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicEnv } from "@/lib/env";

/**
 * Supabase client for Server Components, Server Actions and Route
 * Handlers. Reads/writes auth cookies through Next's `cookies()` API, so
 * the session set here is what `proxy.ts` and subsequent requests see.
 *
 * `setAll` is wrapped in try/catch because Server *Components* cannot set
 * cookies (only Server Actions and Route Handlers can) — Next throws if
 * you try. When that happens here, it's harmless: `proxy.ts` refreshes
 * the session on every request anyway, so a skipped write just means this
 * one component didn't refresh it, not that the session is lost.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const env = getPublicEnv();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component — see note above.
        }
      },
    },
  });
}

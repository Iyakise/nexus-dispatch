import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Paths that require a signed-in session. Checked by prefix, not by route
 * group (the (dashboard)/(superadmin)/(portal) folders under src/app/ are
 * route groups — they don't appear in the URL — so this list is the
 * actual source of truth for what's protected, independent of how the
 * file tree is organised. Keep it in sync as Phase 4/5 add real routes
 * under these prefixes.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/fleet-map",
  "/shipments",
  "/alerts",
  "/billing",
  "/settings",
  "/superadmin",
  "/portal",
  // NOT "/onboarding" itself — that's the public signup form (step 1),
  // where no session exists yet. Only the steps reached AFTER account
  // creation need one.
  "/onboarding/subscription",
  "/onboarding/payment",
  "/onboarding/welcome",
];

/** Signed-in users land here instead of the page they tried to visit. */
const DEFAULT_AUTHENTICATED_PATH = "/dashboard";

/** Auth pages a signed-in user shouldn't see again (bounced to the app instead). */
const AUTH_ONLY_PREFIXES = ["/login"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/**
 * Derives the tenant subdomain from the request Host header, e.g.
 * "acme.nexusdispatch.com" -> "acme". Returns null for the bare root
 * domain, "www", and local development hosts (localhost, 127.0.0.1, and
 * any *.vercel.app / *.localhost preview host), so none of those are ever
 * mistaken for a tenant slug.
 */
function resolveTenantSlug(host: string, rootDomain: string): string | null {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  const root = rootDomain.toLowerCase();

  if (hostname === root || hostname === `www.${root}`) return null;
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".vercel.app")) return null;

  if (hostname.endsWith(`.${root}`)) {
    const sub = hostname.slice(0, -(root.length + 1));
    // A subdomain can itself have dots stripped off already handled above;
    // reject anything that still contains one (e.g. a stray "a.b.<root>").
    if (sub && !sub.includes(".")) return sub;
  }
  return null;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without Supabase configured (e.g. a fresh checkout before .env.local is
  // filled in), skip auth entirely rather than redirect-looping to a /login
  // that can't authenticate anyone yet.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Required even though the user isn't read here directly: this call is
  // what actually refreshes an expiring session and writes the renewed
  // cookies via setAll above. Skipping it is the #1 cause of "Server
  // Components see no user" bug reports for @supabase/ssr.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && AUTH_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    const url = request.nextUrl.clone();
    url.pathname = DEFAULT_AUTHENTICATED_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Tenant subdomain -> forwarded as a request header so Server Components
  // (the login page, in particular) can read it via next/headers without
  // every page needing its own host-parsing logic.
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "nexusdispatch.com";
  const host = request.headers.get("host") ?? "";
  const tenantSlug = resolveTenantSlug(host, rootDomain);
  if (tenantSlug) {
    response.headers.set("x-tenant-slug", tenantSlug);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything except:
     * - _next/static, _next/image (Next internals)
     * - favicon.ico, icon.svg
     * - files with an extension in public/ (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|webp|gif|woff2?|ttf)$).*)",
  ],
};

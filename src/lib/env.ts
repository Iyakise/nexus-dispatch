import { z } from "zod";

/**
 * Typed, validated environment access, split by service so a feature from
 * a later phase that isn't configured yet (Stripe, Resend, R2) never
 * breaks a feature from an earlier phase that is. `getSupabaseServerEnv()`
 * only requires the three Supabase variables Phase 2/3 actually need;
 * `getServerEnv()` additionally validates the Phase 4/5 secrets and is
 * for code that genuinely needs all of them (none yet).
 */

const publicSchema = z.object({
  NEXT_PUBLIC_ROOT_DOMAIN: z.string().min(1).default("nexusdispatch.com"),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().min(1).optional(),
});

/** Supabase service-role key, the only server-only secret Phases 2–3 use. */
const supabaseServerSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

/** Everything, including secrets no phase before 4/5 configures. */
const serverSchema = supabaseServerSchema.extend({
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  RESEND_API_KEY: z.string().startsWith("re_"),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
});

export type PublicEnv = z.infer<typeof publicSchema>;
export type SupabaseServerEnv = z.infer<typeof supabaseServerSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

function parse<T extends z.ZodType>(schema: T, source: NodeJS.ProcessEnv): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid environment configuration:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export function getPublicEnv(): PublicEnv {
  // NEXT_PUBLIC_* values are inlined at build time, so list them explicitly.
  return parse(publicSchema, {
    ...process.env,
    NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  });
}

/** What every Phase 2/3 server action should call — not getServerEnv(). */
export function getSupabaseServerEnv(): SupabaseServerEnv {
  return parse(supabaseServerSchema, process.env);
}

/** Requires Stripe/Resend/R2 too — nothing calls this before Phase 4/5. */
export function getServerEnv(): ServerEnv {
  return parse(serverSchema, process.env);
}

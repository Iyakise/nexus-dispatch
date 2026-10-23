/**
 * Zod schemas for every table in supabase/migrations/, one file per table,
 * inferred TypeScript types exported alongside each schema
 * (`export type Shipment = z.infer<typeof shipmentSchema>`).
 *
 * Each file's top comment names the exact migration it mirrors — when a
 * migration changes, update that file's schema in the same commit.
 */
export * from "./common";
export * from "./tenant";
export * from "./user";
export * from "./vehicle";
export * from "./tariff";
export * from "./shipment";
export * from "./telematics";
export * from "./alert";

import {
  createClient as supabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
let client: SupabaseClient | undefined;
// Only publishable credentials belong here. RLS is the authorization boundary.
export function createClient() {
  if (!client)
    client = supabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
        "https://hudtdmerjzqmyvgwajub.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        "sb_publishable_Drg_HlywJ6xAqhwUwyWBZA_KwNotfMh",
      {
        auth: {
          storageKey: "vitapath.auth",
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "implicit",
        },
      },
    );
  return client;
}
export const basePath =
  process.env.NODE_ENV === "production" ? "/VitaPath" : "";
export const authRedirect = () => `${window.location.origin}${basePath}/login/`;

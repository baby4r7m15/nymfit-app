import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SERVICE ROLE client — bypasses RLS entirely.
// Only ever import this in server-side code (route handlers / server actions)
// that has already verified the caller is an authenticated admin.
// Never import this in a "use client" file or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

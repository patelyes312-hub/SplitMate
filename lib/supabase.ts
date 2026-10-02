import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client. Uses the service role key so API routes can
// read/write without row-level-security getting in the way. This module must
// only ever be imported from server code (API routes / server actions) so the
// service key is never bundled into the browser.
const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error(
    "Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
}

export const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

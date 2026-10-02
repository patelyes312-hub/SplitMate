import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client. Uses the service role key so API routes can
// read/write without row-level-security getting in the way. This module must
// only ever be imported from server code (API routes / server actions) so the
// service key is never bundled into the browser.
//
// The client is created lazily on first use rather than at module load so that
// `next build` can import route modules to collect page data without requiring
// the env vars to be present at build time.
let client: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createSupabaseClient();
  }
  return client;
}

// Proxy that forwards property access to the lazily-created client. This keeps
// the existing `supabase.from(...)` call sites working unchanged while making
// sure the client (and the env var check) is only initialized at request time.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getSupabase() as object, prop, receiver);
    return typeof value === "function" ? value.bind(getSupabase()) : value;
  },
});

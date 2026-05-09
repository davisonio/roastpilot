import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client (service role — bypasses RLS, use only in server components/routes)
export const db = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

// Browser-safe client (anon key)
export const supabase = createClient(url, anonKey);

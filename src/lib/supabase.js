import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,      // без '!'
  import.meta.env.VITE_SUPABASE_ANON_KEY  // без '!'
);

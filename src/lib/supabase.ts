import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.ANON_KEY ?? "",
  {
    global: {
      headers: {
        apiKey: process.env.ANON_KEY ?? "",
      },
    },
  }
);

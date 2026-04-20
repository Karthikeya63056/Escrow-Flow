import { createClient } from "@supabase/supabase-js";

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
  supabaseUrl = "https://mock.supabase.co";
  supabaseAnonKey = "mock-anon-key";
}

// Only true if we are running without real variables
export const isMockMode = supabaseUrl === "https://mock.supabase.co";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

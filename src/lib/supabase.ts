import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rrhxwlfppofudpoowjov.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyaHh3bGZwcG9mdWRwb293am92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzUzMzYsImV4cCI6MjA5NTY1MTMzNn0.mR8szKqsTSg9x5fRwAFu9Fn0lOpqD9G4mmPX8sWMIrc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

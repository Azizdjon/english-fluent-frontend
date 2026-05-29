import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rrhxwlfppofudpoowjov.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyaHh3bGZwcG9mdWRwb293am92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzUzMzYsImV4cCI6MjA5NTY1MTMzNn0.mR8szKqsTSg9x5fRwAFu9Fn0lOpqD9G4mmPX8sWMIrc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type UserRole = 'student' | 'teacher' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  level: string;
  avatar_initials: string;
  is_active: boolean;
  created_at: string;
}

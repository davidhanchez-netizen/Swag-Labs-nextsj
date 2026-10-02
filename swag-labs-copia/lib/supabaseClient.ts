import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Reutiliza la instancia existente si ya fue creada (evita advertencias de GoTrueClient)
export const supabase =
  (globalThis as any).supabaseClient ||
  ((globalThis as any).supabaseClient = createClient(supabaseUrl, supabaseAnonKey));
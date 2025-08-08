import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PrIaMetrics = {
  id: number;
  repository: string;
  pr_number: number;
  ia_tool_used: string | string[] | null;
  ia_usage_scenarios: string | null;
  productivity_score: number | null;
  productivity_reason: string | null;
  updated_at?: string;
};
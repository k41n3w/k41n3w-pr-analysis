import { supabase } from '@/integrations/supabase/client';

export type PrIaMetrics = {
  repository: string;
  pr_number: number;
  ia_tool_used: string | null;
  ia_usage_scenarios: string | null;
  productivity_score: number | null;
  productivity_reason: string | null;
  updated_at?: string | null;
};

export class SupabaseService {
  async getPrMetrics(repository: string, prNumber: number): Promise<PrIaMetrics | null> {
    try {
      const { data, error } = await supabase
        .from('pr_metrics_v2')
        .select('*')
        .eq('repository', repository)
        .eq('pr_number', prNumber)
        .order('updated_at', { ascending: false, nullsFirst: false })
        .limit(1)
        .single();

      if (error) {
        // Se não encontrou registro, retorna null
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar métricas de IA:', error);
      throw error;
    }
  }
}

export default SupabaseService;
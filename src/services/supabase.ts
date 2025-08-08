import { supabase, PrIaMetrics } from '@/lib/supabase';

export class SupabaseService {
  async getPrMetrics(repository: string, prNumber: number): Promise<PrIaMetrics | null> {
    try {
      const { data, error } = await supabase
        .from('pr_metrics_v2')
        .select('*')
        .eq('repository', repository)
        .eq('pr_number', prNumber)
        .order('updated_at', { ascending: false, nullsFirst: false })
        .order('id', { ascending: false })
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
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, Loader2, AlertTriangle } from 'lucide-react';
import SupabaseService from '@/services/supabase';
import { PrIaMetrics } from '@/services/supabase';

interface PRIAMetricsProps {
  repository: string;
  prNumber: number;
}

export function PRIAMetrics({ repository, prNumber }: PRIAMetricsProps) {
  const [metrics, setMetrics] = useState<PrIaMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, [repository, prNumber]);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const supabaseService = new SupabaseService();
      const result = await supabaseService.getPrMetrics(repository, prNumber);
      setMetrics(result);
    } catch (err: any) {
      setError('Erro ao carregar métricas de IA: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const parseIaTools = (iaTools: string | string[] | null): string[] => {
    if (!iaTools) return [];
    if (Array.isArray(iaTools)) return iaTools;
    if (typeof iaTools === 'string') {
      return iaTools.split(',').map(tool => tool.trim()).filter(tool => tool.length > 0);
    }
    return [];
  };

  const getProductivityScoreColor = (score: number | null): string => {
    if (score === null) return 'bg-gray-500';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Métricas de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Carregando métricas de IA...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Métricas de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Métricas de IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!metrics ? (
          <div className="text-center py-4 text-muted-foreground">
            <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Sem Métricas de IA para o PR</p>
          </div>
        ) : (
          <>
            {/* Ferramentas de IA usadas */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Ferramentas de IA usadas:</h4>
              <div className="flex gap-2 flex-wrap">
                {parseIaTools(metrics.ia_tool_used).length > 0 ? (
                  parseIaTools(metrics.ia_tool_used).map((tool, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      {tool}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">Não especificado</span>
                )}
              </div>
            </div>

            {/* Cenários de uso de IA */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Cenários de uso de IA:</h4>
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                {metrics.ia_usage_scenarios || 'Não especificado'}
              </p>
            </div>

            {/* Score de Produtividade */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Score de Produtividade:</h4>
              <div className="flex items-center gap-2">
                {metrics.productivity_score !== null ? (
                  <Badge 
                    className={`text-white ${getProductivityScoreColor(metrics.productivity_score)}`}
                  >
                    {metrics.productivity_score}/100
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">Não avaliado</span>
                )}
              </div>
            </div>

            {/* Justificativa do Score */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Justificativa do Score:</h4>
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                {metrics.productivity_reason || 'Não especificado'}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
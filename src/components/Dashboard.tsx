import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  GitPullRequest, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Timer,
  TrendingUp,
  Users,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricCard } from './MetricCard';
import { PRTable } from './PRTable';
import { UserMetricsTable } from './UserMetricsTable';
import GitHubService from '@/services/github';
import { calculatePRAnalytics, calculateUserMetrics, formatDays } from '@/utils/analytics';
import { 
  GitHubRepository, 
  DateRange, 
  GitHubPullRequest, 
  GitHubReview, 
  PRAnalytics, 
  UserMetrics 
} from '@/types/github';

interface DashboardProps {
  token: string;
  repository: GitHubRepository;
  dateRange: DateRange;
  onBack: () => void;
  onPRClick: (pr: GitHubPullRequest) => void;
}

export function Dashboard({ token, repository, dateRange, onBack, onPRClick }: DashboardProps) {
  const [prs, setPRs] = useState<GitHubPullRequest[]>([]);
  const [reviews, setReviews] = useState<Map<number, GitHubReview[]>>(new Map());
  const [analytics, setAnalytics] = useState<PRAnalytics | null>(null);
  const [userMetrics, setUserMetrics] = useState<UserMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [repository, dateRange]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const githubService = new GitHubService(token);

      // Carregar PRs
      const pullRequests = await githubService.getPullRequests(
        repository.owner.login,
        repository.name,
        dateRange.startDate,
        dateRange.endDate
      );

      setPRs(pullRequests);

      // Carregar reviews para cada PR
      const reviewsMap = new Map<number, GitHubReview[]>();
      
      for (const pr of pullRequests) {
        try {
          const prReviews = await githubService.getPullRequestReviews(
            repository.owner.login,
            repository.name,
            pr.number
          );
          reviewsMap.set(pr.number, prReviews);
        } catch (err) {
          console.warn(`Erro ao carregar reviews do PR #${pr.number}:`, err);
          reviewsMap.set(pr.number, []);
        }
      }

      setReviews(reviewsMap);

      // Calcular analytics
      const prAnalytics = calculatePRAnalytics(pullRequests, reviewsMap);
      setAnalytics(prAnalytics);

      // Calcular métricas de usuário
      const userStats = calculateUserMetrics(pullRequests, reviewsMap);
      setUserMetrics(userStats);

    } catch (err: any) {
      setError('Erro ao carregar dados: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = analytics ? [
    {
      name: 'Abertura → 1ª Review',
      value: Math.round(analytics.avgTimeToFirstReview * 10) / 10,
      color: '#22c55e'
    },
    {
      name: '1ª Review → Aprovação',
      value: Math.round(analytics.avgTimeToApproval * 10) / 10,
      color: '#3b82f6'
    },
    {
      name: 'Aprovação → Merge',
      value: Math.round((analytics.avgLifeCycle - analytics.avgTimeToApproval - analytics.avgTimeToFirstReview) * 10) / 10,
      color: '#8b5cf6'
    },
    {
      name: 'Tempo Total',
      value: Math.round(analytics.avgLifeCycle * 10) / 10,
      color: '#f59e0b'
    }
  ] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-github-blue/5 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-lg font-medium">Carregando dados do repositório...</p>
              <p className="text-sm text-muted-foreground">
                Analisando Pull Requests de {repository.full_name}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-github-blue/5 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Dashboard de PRs</h1>
              <p className="text-muted-foreground">
                {repository.full_name} • {formatDays((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24))}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={`https://github.com/${repository.full_name}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver no GitHub
            </a>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analytics && (
          <>
            {/* Primeira fileira - Métricas principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total de PRs"
                value={analytics.totalPRs}
                icon={GitPullRequest}
                color="blue"
              />
              <MetricCard
                title="PRs Abertos"
                value={analytics.openPRs}
                icon={AlertCircle}
                color="orange"
              />
              <MetricCard
                title="PRs Revisados"
                value={analytics.reviewedPRs}
                subtitle={`${Math.round((analytics.reviewedPRs / analytics.totalPRs) * 100)}% do total`}
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Aguardando Review"
                value={analytics.pendingReviewPRs}
                subtitle={`${Math.round((analytics.pendingReviewPRs / analytics.totalPRs) * 100)}% do total`}
                icon={Clock}
                color="red"
              />
            </div>

            {/* Segunda fileira - Análise de Gargalos */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Análise de Gargalos - Onde o Tempo é Perdido
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricCard
                  title="Tempo até 1ª Review"
                  value={formatDays(analytics.avgTimeToFirstReview)}
                  subtitle="tempo médio em dias"
                  icon={Clock}
                  color="blue"
                />
                <MetricCard
                  title="Tempo até Aprovação"
                  value={formatDays(analytics.avgTimeToApproval)}
                  subtitle="tempo médio em dias"
                  icon={CheckCircle}
                  color="green"
                />
                <MetricCard
                  title="Tempo de Resposta"
                  value={formatDays(analytics.avgResponseTime)}
                  subtitle="tempo médio em dias"
                  icon={Timer}
                  color="orange"
                />
                <MetricCard
                  title="Tempo em Desenvolvimento"
                  value={formatDays(analytics.avgDevelopmentTime)}
                  subtitle="tempo médio em dias"
                  icon={TrendingUp}
                  color="purple"
                />
                <MetricCard
                  title="Ciclo de Vida Completo"
                  value={formatDays(analytics.avgLifeCycle)}
                  subtitle="tempo médio em dias"
                  icon={GitPullRequest}
                  color="red"
                />
              </div>
            </div>

            {/* Terceira fileira - Gráfico de Distribuição */}
            <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Distribuição do Tempo no Ciclo de Vida (dias)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="horizontal" margin={{ left: 120, right: 30, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={110} />
                      <Tooltip 
                        formatter={(value: any) => [`${value} dias`, 'Tempo Médio']}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Métricas por Usuário */}
        <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Métricas por Usuário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserMetricsTable userMetrics={userMetrics} />
          </CardContent>
        </Card>

        {/* Lista de PRs */}
        <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="w-5 h-5" />
              Pull Requests ({prs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PRTable prs={prs} reviews={reviews} onPRClick={onPRClick} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
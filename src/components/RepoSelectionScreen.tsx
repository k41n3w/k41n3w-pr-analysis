import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, GitBranch, Loader2, Calendar as CalendarIconLucide } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import GitHubService from '@/services/github';
import { GitHubRepository, DateRange } from '@/types/github';

interface RepoSelectionScreenProps {
  token: string;
  onRepoSelected: (repo: GitHubRepository, dateRange: DateRange) => void;
  onBack: () => void;
}

export function RepoSelectionScreen({ token, onRepoSelected, onBack }: RepoSelectionScreenProps) {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    endDate: new Date()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRepositories();
  }, []);

  const loadRepositories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const githubService = new GitHubService(token);
      const repos = await githubService.getUserRepositories();
      setRepositories(repos);
    } catch (err: any) {
      setError('Erro ao carregar repositórios: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedRepo) return;
    
    setIsSubmitting(true);
    try {
      onRepoSelected(selectedRepo, dateRange);
    } catch (err) {
      setError('Erro ao processar seleção');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setQuickDateRange = (days: number) => {
    const endDate = new Date();
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setDateRange({ startDate, endDate });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-github-purple/5 p-4">
      <div className="max-w-2xl mx-auto space-y-6 pt-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Configuração da Análise</h1>
          <p className="text-muted-foreground">
            Selecione o repositório e período para análise dos Pull Requests
          </p>
        </div>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Repositório e Período
            </CardTitle>
            <CardDescription>
              Escolha o repositório e defina o período de análise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Seleção de Repositório */}
            <div className="space-y-2">
              <Label>Repositório</Label>
              {isLoading ? (
                <div className="flex items-center gap-2 p-4 border rounded-md">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Carregando repositórios...</span>
                </div>
              ) : (
                <Select
                  value={selectedRepo?.full_name || ''}
                  onValueChange={(value) => {
                    const repo = repositories.find(r => r.full_name === value);
                    setSelectedRepo(repo || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um repositório" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {repositories.map((repo) => (
                      <SelectItem key={repo.id} value={repo.full_name}>
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4" />
                          <span>{repo.full_name}</span>
                          {repo.private && (
                            <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              Privado
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Período de Análise */}
            <div className="space-y-4">
              <Label>Período de Análise</Label>
              
              {/* Botões de período rápido */}
              <div className="flex flex-wrap gap-2">
                {[7, 14, 30, 60, 90].map((days) => (
                  <Button
                    key={days}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateRange(days)}
                    className={cn(
                      "transition-colors",
                      Math.abs((new Date().getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24) - days) < 1 &&
                      "bg-primary text-primary-foreground"
                    )}
                  >
                    Últimos {days} dias
                  </Button>
                ))}
              </div>

              {/* Seletores de data customizada */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.startDate ? (
                          format(dateRange.startDate, "dd/MM/yyyy", { locale: pt })
                        ) : (
                          <span>Selecionar data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.startDate}
                        onSelect={(date) => date && setDateRange(prev => ({ ...prev, startDate: date }))}
                        disabled={(date) => date > new Date() || date < new Date("2020-01-01")}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Data Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.endDate ? (
                          format(dateRange.endDate, "dd/MM/yyyy", { locale: pt })
                        ) : (
                          <span>Selecionar data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.endDate}
                        onSelect={(date) => date && setDateRange(prev => ({ ...prev, endDate: date }))}
                        disabled={(date) => date > new Date() || date < dateRange.startDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                <CalendarIconLucide className="w-4 h-4 inline mr-1" />
                Período selecionado: <strong>
                  {Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24))} dias
                </strong>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Voltar
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!selectedRepo || isSubmitting}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Carregando PRs...
                  </>
                ) : (
                  'Carregar PRs'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  ExternalLink, 
  GitCommit, 
  Calendar, 
  User, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  Plus,
  Minus,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { 
  GitHubPullRequest, 
  GitHubReview, 
  GitHubCommit,
  GitHubComment
} from '@/types/github';
import { getStatusColor, formatDays, calculateTimeMetrics } from '@/utils/analytics';
import GitHubService from '@/services/github';

interface PRDetailScreenProps {
  pr: GitHubPullRequest;
  token: string;
  repositoryFullName: string;
  onBack: () => void;
}

export function PRDetailScreen({ pr, token, repositoryFullName, onBack }: PRDetailScreenProps) {
  const [reviews, setReviews] = useState<GitHubReview[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [comments, setComments] = useState<GitHubComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPRDetails();
  }, [pr]);

  const loadPRDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [owner, repo] = repositoryFullName.split('/');
      const githubService = new GitHubService(token);

      const [prReviews, prCommits, prComments] = await Promise.all([
        githubService.getPullRequestReviews(owner, repo, pr.number),
        githubService.getPullRequestCommits(owner, repo, pr.number),
        githubService.getPullRequestComments(owner, repo, pr.number)
      ]);

      setReviews(prReviews);
      setCommits(prCommits);
      setComments(prComments);
    } catch (err: any) {
      setError('Erro ao carregar detalhes do PR: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = (pr: GitHubPullRequest): string => {
    if (pr.merged_at) return 'Mergeado';
    if (pr.state === 'closed') return 'Fechado';
    return 'Aberto';
  };

  const getReviewIcon = (state: string) => {
    switch (state) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-github-green" />;
      case 'CHANGES_REQUESTED':
        return <XCircle className="w-4 h-4 text-github-red" />;
      case 'COMMENTED':
        return <MessageSquare className="w-4 h-4 text-github-blue" />;
      default:
        return <Clock className="w-4 h-4 text-github-orange" />;
    }
  };

  const getReviewStateText = (state: string): string => {
    switch (state) {
      case 'APPROVED':
        return 'Aprovado';
      case 'CHANGES_REQUESTED':
        return 'Mudanças Solicitadas';
      case 'COMMENTED':
        return 'Comentado';
      case 'PENDING':
        return 'Pendente';
      default:
        return state;
    }
  };

  const timeMetrics = calculateTimeMetrics(pr, reviews);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-github-purple/5 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-lg font-medium">Carregando detalhes do PR...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-github-purple/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">PR #{pr.number}</h1>
              <p className="text-muted-foreground">{repositoryFullName}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={pr.html_url} target="_blank" rel="noopener noreferrer">
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

        {/* Informações principais */}
        <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl">{pr.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: getStatusColor(getStatusText(pr)),
                      color: getStatusColor(getStatusText(pr))
                    }}
                  >
                    {getStatusText(pr)}
                  </Badge>
                  {pr.draft && (
                    <Badge variant="secondary">Rascunho</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={pr.user.avatar_url} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{pr.user.login}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {pr.body && (
              <div className="space-y-2">
                <h4 className="font-medium">Descrição</h4>
                <div className="bg-muted/30 p-3 rounded-md text-sm prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{pr.body}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Labels */}
            {pr.labels && pr.labels.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Labels</h4>
                <div className="flex gap-2 flex-wrap">
                  {pr.labels.map((label) => (
                    <Badge 
                      key={label.name} 
                      variant="secondary"
                      style={{ backgroundColor: `#${label.color}20`, color: `#${label.color}` }}
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Datas e estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Datas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Criação:</span>
                <span>{format(new Date(pr.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última atualização:</span>
                <span>{format(new Date(pr.updated_at), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}</span>
              </div>
              {pr.merged_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Merge:</span>
                  <span>{format(new Date(pr.merged_at), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}</span>
                </div>
              )}
              {pr.closed_at && !pr.merged_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fechamento:</span>
                  <span>{format(new Date(pr.closed_at), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commits:</span>
                <span className="flex items-center gap-1">
                  <GitCommit className="w-4 h-4" />
                  {commits.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Linhas adicionadas:</span>
                <span className="flex items-center gap-1 text-github-green">
                  <Plus className="w-4 h-4" />
                  {pr.additions || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Linhas removidas:</span>
                <span className="flex items-center gap-1 text-github-red">
                  <Minus className="w-4 h-4" />
                  {pr.deletions || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reviews:</span>
                <span>{reviews.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comentários:</span>
                <span>{comments.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Análise de tempo */}
        <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Análise de Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-github-blue">
                  {formatDays(timeMetrics.creationToFirstReview)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Criação → 1ª Review
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-github-green">
                  {formatDays(timeMetrics.firstReviewToApproval)}
                </div>
                <div className="text-xs text-muted-foreground">
                  1ª Review → Aprovação
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-github-purple">
                  {formatDays(timeMetrics.approvalToMerge)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Aprovação → Merge
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-github-orange">
                  {formatDays(timeMetrics.totalTime)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Tempo Total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        {reviews.length > 0 && (
          <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Reviews ({reviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review, index) => (
                <div key={review.id} className="flex gap-3 p-3 bg-muted/20 rounded-md">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={review.user.avatar_url} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user.login}</span>
                        <div className="flex items-center gap-1">
                          {getReviewIcon(review.state)}
                          <span className="text-sm text-muted-foreground">
                            {getReviewStateText(review.state)}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(review.submitted_at), "dd/MM/yy 'às' HH:mm", { locale: pt })}
                      </span>
                    </div>
                    {review.body && (
                      <div className="text-sm bg-background/50 p-2 rounded">
                        {review.body}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Commits */}
        {commits.length > 0 && (
          <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GitCommit className="w-5 h-5" />
                Commits ({commits.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {commits.map((commit, index) => (
                <div key={commit.sha} className="flex gap-3 p-3 bg-muted/20 rounded-md">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={commit.author?.avatar_url} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{commit.author?.login || commit.commit.author.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(commit.commit.author.date), "dd/MM/yy 'às' HH:mm", { locale: pt })}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {commit.commit.message}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {commit.sha.substring(0, 8)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Comentários */}
        {comments.length > 0 && (
          <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comentários ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 bg-muted/20 rounded-md">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.user.avatar_url} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{comment.user.login}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.created_at), "dd/MM/yy 'às' HH:mm", { locale: pt })}
                      </span>
                    </div>
                    <div className="text-sm bg-background/50 p-2 rounded whitespace-pre-wrap">
                      {comment.body}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
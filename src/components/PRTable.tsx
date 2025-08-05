import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, GitCommit, Plus, Minus, Calendar, User, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { GitHubPullRequest, GitHubReview } from '@/types/github';
import { getStatusColor, formatDays } from '@/utils/analytics';

interface PRTableProps {
  prs: GitHubPullRequest[];
  reviews: Map<number, GitHubReview[]>;
  onPRClick: (pr: GitHubPullRequest) => void;
}

type SortField = 'number' | 'title' | 'author' | 'status' | 'created_at' | 'time_open' | 'commits' | 'lines' | 'reviews';
type SortDirection = 'asc' | 'desc';

export function PRTable({ prs, reviews, onPRClick }: PRTableProps) {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const getStatusText = (pr: GitHubPullRequest): string => {
    if (pr.merged_at) return 'Mergeado';
    if (pr.state === 'closed') return 'Fechado';
    return 'Aberto';
  };

  const getTimeOpen = (pr: GitHubPullRequest): string => {
    const startDate = new Date(pr.created_at);
    const endDate = pr.merged_at 
      ? new Date(pr.merged_at) 
      : pr.closed_at 
      ? new Date(pr.closed_at) 
      : new Date();
    
    const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return formatDays(days);
  };

  const getReviewers = (pr: GitHubPullRequest): string => {
    const prReviews = reviews.get(pr.number) || [];
    const reviewers = new Set(prReviews.map(r => r.user.login));
    return Array.from(reviewers).join(', ') || 'Nenhum';
  };

  const getRequestedReviewers = (pr: GitHubPullRequest): string => {
    return pr.requested_reviewers?.map(r => r.login).join(', ') || 'Nenhum';
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedPRs = () => {
    return [...prs].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'number':
          aValue = a.number;
          bValue = b.number;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.user.login.toLowerCase();
          bValue = b.user.login.toLowerCase();
          break;
        case 'status':
          aValue = getStatusText(a);
          bValue = getStatusText(b);
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'time_open':
          aValue = getTimeOpenValue(a);
          bValue = getTimeOpenValue(b);
          break;
        case 'commits':
          aValue = a.commits || 0;
          bValue = b.commits || 0;
          break;
        case 'lines':
          aValue = (a.additions || 0) + (a.deletions || 0);
          bValue = (b.additions || 0) + (b.deletions || 0);
          break;
        case 'reviews':
          aValue = (reviews.get(a.number) || []).length;
          bValue = (reviews.get(b.number) || []).length;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getTimeOpenValue = (pr: GitHubPullRequest): number => {
    const startDate = new Date(pr.created_at);
    const endDate = pr.merged_at 
      ? new Date(pr.merged_at) 
      : pr.closed_at 
      ? new Date(pr.closed_at) 
      : new Date();
    
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        className="h-auto p-0 font-semibold hover:bg-transparent"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-1">
          {children}
          <ArrowUpDown className="w-3 h-3" />
        </div>
      </Button>
    </TableHead>
  );

  return (
    <div className="rounded-md border bg-background/50">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader field="number">PR</SortableHeader>
            <SortableHeader field="author">Autor</SortableHeader>
            <SortableHeader field="status">Status</SortableHeader>
            <SortableHeader field="created_at">Abertura</SortableHeader>
            <SortableHeader field="time_open">Tempo</SortableHeader>
            <SortableHeader field="commits">Commits</SortableHeader>
            <SortableHeader field="lines">Linhas</SortableHeader>
            <TableHead>Labels</TableHead>
            <SortableHeader field="reviews">Reviewers</SortableHeader>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getSortedPRs().map((pr) => (
            <TableRow key={pr.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="space-y-1">
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-left justify-start"
                    onClick={() => onPRClick(pr)}
                  >
                    #{pr.number}
                  </Button>
                  <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                    {pr.title}
                  </p>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={pr.user.avatar_url} />
                    <AvatarFallback>
                      <User className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{pr.user.login}</span>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge 
                  variant="outline"
                  style={{ 
                    borderColor: getStatusColor(getStatusText(pr)),
                    color: getStatusColor(getStatusText(pr))
                  }}
                >
                  {getStatusText(pr)}
                </Badge>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(pr.created_at), 'dd/MM/yy', { locale: pt })}
                </div>
              </TableCell>
              
              <TableCell>
                <span className="text-sm font-medium">
                  {getTimeOpen(pr)}
                </span>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1">
                  <GitCommit className="w-3 h-3" />
                  <span className="text-sm">{pr.commits || 'N/A'}</span>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-github-green">
                    <Plus className="w-3 h-3" />
                    {pr.additions || 0}
                  </div>
                  <div className="flex items-center gap-1 text-github-red">
                    <Minus className="w-3 h-3" />
                    {pr.deletions || 0}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex gap-1 flex-wrap max-w-32">
                  {pr.labels?.slice(0, 2).map((label) => (
                    <Badge 
                      key={label.name} 
                      variant="secondary" 
                      className="text-xs"
                      style={{ backgroundColor: `#${label.color}20`, color: `#${label.color}` }}
                    >
                      {label.name}
                    </Badge>
                  ))}
                  {pr.labels && pr.labels.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{pr.labels.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    <strong>Solicitados:</strong><br />
                    {getRequestedReviewers(pr)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong>Revisaram:</strong><br />
                    {getReviewers(pr)}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPRClick(pr)}
                  >
                    Detalhes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={pr.html_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {getSortedPRs().length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                Nenhum Pull Request encontrado no período selecionado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
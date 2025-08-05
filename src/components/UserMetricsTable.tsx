import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, GitPullRequest, MessageSquare, Timer, TrendingUp } from 'lucide-react';
import { UserMetrics } from '@/types/github';
import { formatDays } from '@/utils/analytics';

interface UserMetricsTableProps {
  userMetrics: UserMetrics[];
}

export function UserMetricsTable({ userMetrics }: UserMetricsTableProps) {
  return (
    <div className="rounded-md border bg-background/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>PRs Abertos</TableHead>
            <TableHead>Linhas</TableHead>
            <TableHead>Interações Totais</TableHead>
            <TableHead>Reviews Dados</TableHead>
            <TableHead>Tempo Médio de Resposta</TableHead>
            <TableHead>Tempo Médio até Merge</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userMetrics.map((user, index) => (
            <TableRow key={user.username} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground w-6 text-center">
                      #{index + 1}
                    </span>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <Badge variant="outline" className="text-xs">
                        {user.totalInteractions} interações
                      </Badge>
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1">
                  <GitPullRequest className="w-4 h-4 text-github-blue" />
                  <span className="font-medium">{user.totalPRs}</span>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-github-green">+{user.linesAdded.toLocaleString()}</span>
                    <span className="text-github-red">-{user.linesRemoved.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total: {(user.linesAdded + user.linesRemoved).toLocaleString()}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {user.totalInteractions}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.totalPRs} PRs + {user.reviewsGiven} reviews
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-github-orange" />
                  <span className="font-medium">{user.reviewsGiven}</span>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4 text-github-purple" />
                  <span className="font-medium">
                    {user.avgResponseTime > 0 ? formatDays(user.avgResponseTime) : 'N/A'}
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-github-green" />
                  <span className="font-medium">
                    {user.avgTimeToMerge > 0 ? formatDays(user.avgTimeToMerge) : 'N/A'}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {userMetrics.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Nenhuma métrica de usuário disponível
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
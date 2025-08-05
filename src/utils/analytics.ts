import { 
  GitHubPullRequest, 
  GitHubReview, 
  PRAnalytics, 
  UserMetrics, 
  TimeMetrics 
} from '@/types/github';

export function calculatePRAnalytics(
  prs: GitHubPullRequest[], 
  reviews: Map<number, GitHubReview[]>
): PRAnalytics {
  const totalPRs = prs.length;
  const openPRs = prs.filter(pr => pr.state === 'open').length;
  
  // PRs com pelo menos 1 review
  const reviewedPRs = prs.filter(pr => {
    const prReviews = reviews.get(pr.number) || [];
    return prReviews.length > 0;
  }).length;
  
  const pendingReviewPRs = totalPRs - reviewedPRs;

  // Calcular tempos médios
  const timeMetrics = prs.map(pr => calculateTimeMetrics(pr, reviews.get(pr.number) || []));
  
  const avgTimeToFirstReview = calculateAverage(
    timeMetrics.map(tm => tm.creationToFirstReview).filter(t => t > 0)
  );
  
  const avgTimeToApproval = calculateAverage(
    timeMetrics.map(tm => tm.firstReviewToApproval).filter(t => t > 0)
  );
  
  const avgResponseTime = calculateAverage(
    timeMetrics.map(tm => tm.firstReviewToApproval).filter(t => t > 0)
  );
  
  const avgDevelopmentTime = calculateAverage(
    prs.map(pr => {
      const created = new Date(pr.created_at);
      const lastUpdate = new Date(pr.updated_at);
      return (lastUpdate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    })
  );
  
  const avgLifeCycle = calculateAverage(
    timeMetrics.map(tm => tm.totalTime).filter(t => t > 0)
  );

  return {
    totalPRs,
    openPRs,
    reviewedPRs,
    pendingReviewPRs,
    avgTimeToFirstReview,
    avgTimeToApproval,
    avgResponseTime,
    avgDevelopmentTime,
    avgLifeCycle
  };
}

export function calculateTimeMetrics(
  pr: GitHubPullRequest, 
  reviews: GitHubReview[]
): TimeMetrics {
  const createdAt = new Date(pr.created_at);
  const mergedAt = pr.merged_at ? new Date(pr.merged_at) : null;
  const closedAt = pr.closed_at ? new Date(pr.closed_at) : null;
  const endTime = mergedAt || closedAt || new Date();

  // Primeira review
  const firstReview = reviews
    .filter(r => r.state !== 'PENDING')
    .sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime())[0];

  const firstReviewTime = firstReview ? new Date(firstReview.submitted_at) : null;

  // Primeira aprovação
  const firstApproval = reviews
    .filter(r => r.state === 'APPROVED')
    .sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime())[0];

  const firstApprovalTime = firstApproval ? new Date(firstApproval.submitted_at) : null;

  // Calcular tempos em dias
  const creationToFirstReview = firstReviewTime 
    ? (firstReviewTime.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    : 0;

  const firstReviewToApproval = firstReviewTime && firstApprovalTime
    ? (firstApprovalTime.getTime() - firstReviewTime.getTime()) / (1000 * 60 * 60 * 24)
    : 0;

  const approvalToMerge = firstApprovalTime && mergedAt
    ? (mergedAt.getTime() - firstApprovalTime.getTime()) / (1000 * 60 * 60 * 24)
    : 0;

  const totalTime = (endTime.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  return {
    creationToFirstReview,
    firstReviewToApproval,
    approvalToMerge,
    totalTime
  };
}

export function calculateUserMetrics(
  prs: GitHubPullRequest[], 
  reviews: Map<number, GitHubReview[]>
): UserMetrics[] {
  const userMap = new Map<string, UserMetrics>();

  // Analisar PRs como autor
  prs.forEach(pr => {
    const username = pr.user.login;
    if (!userMap.has(username)) {
      userMap.set(username, {
        username,
        avatar_url: pr.user.avatar_url,
        totalPRs: 0,
        linesAdded: 0,
        linesRemoved: 0,
        totalInteractions: 0,
        avgResponseTime: 0,
        avgTimeToMerge: 0,
        reviewsGiven: 0,
        commentsGiven: 0
      });
    }

    const user = userMap.get(username)!;
    user.totalPRs++;
    user.linesAdded += pr.additions || 0;
    user.linesRemoved += pr.deletions || 0;
    user.totalInteractions++;

    // Calcular tempo até merge para este PR
    if (pr.merged_at) {
      const created = new Date(pr.created_at);
      const merged = new Date(pr.merged_at);
      const timeToMerge = (merged.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      user.avgTimeToMerge = (user.avgTimeToMerge + timeToMerge) / 2;
    }
  });

  // Analisar reviews dados
  reviews.forEach((prReviews, prNumber) => {
    prReviews.forEach(review => {
      const username = review.user.login;
      if (!userMap.has(username)) {
        userMap.set(username, {
          username,
          avatar_url: review.user.avatar_url,
          totalPRs: 0,
          linesAdded: 0,
          linesRemoved: 0,
          totalInteractions: 0,
          avgResponseTime: 0,
          avgTimeToMerge: 0,
          reviewsGiven: 0,
          commentsGiven: 0
        });
      }

      const user = userMap.get(username)!;
      user.reviewsGiven++;
      user.totalInteractions++;
    });
  });

  return Array.from(userMap.values())
    .sort((a, b) => b.totalInteractions - a.totalInteractions);
}

export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

export function formatDays(days: number): string {
  if (days < 1) {
    const hours = Math.round(days * 24);
    return `${hours}h`;
  }
  return `${Math.round(days * 10) / 10}d`;
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'open':
    case 'aberto':
      return 'hsl(var(--github-green))';
    case 'closed':
    case 'fechado':
      return 'hsl(var(--github-red))';
    case 'merged':
    case 'mergeado':
      return 'hsl(var(--github-purple))';
    default:
      return 'hsl(var(--muted-foreground))';
  }
}
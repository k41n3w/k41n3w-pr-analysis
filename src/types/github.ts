export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  private: boolean;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string;
  html_url: string;
  state: 'open' | 'closed';
  merged_at: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
  assignees: Array<{
    login: string;
    avatar_url: string;
  }>;
  requested_reviewers: Array<{
    login: string;
    avatar_url: string;
  }>;
  additions: number;
  deletions: number;
  commits: number;
  draft: boolean;
}

export interface GitHubReview {
  id: number;
  user: {
    login: string;
    avatar_url: string;
  };
  body: string;
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'PENDING';
  submitted_at: string;
  pull_request_url: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubComment {
  id: number;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PRAnalytics {
  totalPRs: number;
  openPRs: number;
  reviewedPRs: number;
  pendingReviewPRs: number;
  avgTimeToFirstReview: number;
  avgTimeToApproval: number;
  avgResponseTime: number;
  avgDevelopmentTime: number;
  avgLifeCycle: number;
}

export interface UserMetrics {
  username: string;
  avatar_url: string;
  totalPRs: number;
  linesAdded: number;
  linesRemoved: number;
  totalInteractions: number;
  avgResponseTime: number;
  avgTimeToMerge: number;
  reviewsGiven: number;
  commentsGiven: number;
}

export interface TimeMetrics {
  creationToFirstReview: number;
  firstReviewToApproval: number;
  approvalToMerge: number;
  totalTime: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface AppState {
  token: string | null;
  user: GitHubUser | null;
  selectedRepo: GitHubRepository | null;
  dateRange: DateRange;
  currentScreen: 'auth' | 'repo-selection' | 'dashboard' | 'pr-detail';
  selectedPR: GitHubPullRequest | null;
  isLoading: boolean;
  error: string | null;
}
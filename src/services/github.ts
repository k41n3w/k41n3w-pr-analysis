import { 
  GitHubUser, 
  GitHubRepository, 
  GitHubPullRequest, 
  GitHubReview, 
  GitHubCommit,
  GitHubComment 
} from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';

class GitHubService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async validateToken(): Promise<GitHubUser> {
    return this.makeRequest<GitHubUser>('/user');
  }

  async getUserRepositories(): Promise<GitHubRepository[]> {
    const repos = await this.makeRequest<GitHubRepository[]>('/user/repos?sort=updated&per_page=100');
    return repos.filter(repo => !repo.private || repo.owner.login);
  }

  async getPullRequests(
    owner: string, 
    repo: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<GitHubPullRequest[]> {
    const since = startDate.toISOString();
    let allPRs: GitHubPullRequest[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const prs = await this.makeRequest<GitHubPullRequest[]>(
        `/repos/${owner}/${repo}/pulls?state=all&sort=updated&direction=desc&per_page=100&page=${page}&since=${since}`
      );

      if (prs.length === 0) {
        hasMore = false;
      } else {
        // Filtrar PRs dentro do período
        const filteredPRs = prs.filter(pr => {
          const createdAt = new Date(pr.created_at);
          return createdAt >= startDate && createdAt <= endDate;
        });

        allPRs = [...allPRs, ...filteredPRs];
        
        // Se todos os PRs da página são anteriores ao período, parar
        const oldestPR = prs[prs.length - 1];
        if (new Date(oldestPR.created_at) < startDate) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }

    return allPRs;
  }

  async getPullRequestDetails(
    owner: string, 
    repo: string, 
    prNumber: number
  ): Promise<GitHubPullRequest> {
    return this.makeRequest<GitHubPullRequest>(`/repos/${owner}/${repo}/pulls/${prNumber}`);
  }

  async getPullRequestReviews(
    owner: string, 
    repo: string, 
    prNumber: number
  ): Promise<GitHubReview[]> {
    return this.makeRequest<GitHubReview[]>(`/repos/${owner}/${repo}/pulls/${prNumber}/reviews`);
  }

  async getPullRequestCommits(
    owner: string, 
    repo: string, 
    prNumber: number
  ): Promise<GitHubCommit[]> {
    return this.makeRequest<GitHubCommit[]>(`/repos/${owner}/${repo}/pulls/${prNumber}/commits`);
  }

  async getPullRequestComments(
    owner: string, 
    repo: string, 
    prNumber: number
  ): Promise<GitHubComment[]> {
    return this.makeRequest<GitHubComment[]>(`/repos/${owner}/${repo}/issues/${prNumber}/comments`);
  }

  async getRepositoryComments(
    owner: string, 
    repo: string,
    since: string
  ): Promise<GitHubComment[]> {
    return this.makeRequest<GitHubComment[]>(`/repos/${owner}/${repo}/issues/comments?since=${since}&per_page=100`);
  }
}

export default GitHubService;
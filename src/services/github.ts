import { 
  GitHubUser, 
  GitHubRepository, 
  GitHubPullRequest, 
  GitHubReview, 
  GitHubCommit,
  GitHubComment 
} from '@/types/github';
import { 
  DEMO_TOKEN, 
  mockUser, 
  mockRepositories, 
  mockPullRequests, 
  generateMockReviews, 
  generateMockCommits, 
  generateMockComments 
} from './mockData';

const GITHUB_API_BASE = 'https://api.github.com';

class GitHubService {
  private token: string;
  private isDemoMode: boolean;

  constructor(token: string) {
    this.token = token;
    this.isDemoMode = token === DEMO_TOKEN;
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
    if (this.isDemoMode) {
      return Promise.resolve(mockUser);
    }
    return this.makeRequest<GitHubUser>('/user');
  }

  async getUserRepositories(): Promise<GitHubRepository[]> {
    if (this.isDemoMode) {
      return Promise.resolve(mockRepositories);
    }
    const repos = await this.makeRequest<GitHubRepository[]>('/user/repos?sort=updated&per_page=100');
    return repos.filter(repo => !repo.private || repo.owner.login);
  }

  async getPullRequests(
    owner: string, 
    repo: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<GitHubPullRequest[]> {
    if (this.isDemoMode) {
      // Filtrar PRs mockados por data
      return Promise.resolve(
        mockPullRequests.filter(pr => {
          const createdAt = new Date(pr.created_at);
          return createdAt >= startDate && createdAt <= endDate;
        })
      );
    }

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

        // Enriquecer PRs com informações adicionais
        const enrichedPRs = await Promise.all(
          filteredPRs.map(async (pr) => {
            try {
              const detailedPR = await this.getPullRequestDetails(owner, repo, pr.number);
              return {
                ...pr,
                additions: detailedPR.additions,
                deletions: detailedPR.deletions,
                commits: detailedPR.commits
              };
            } catch (error) {
              console.warn(`Erro ao obter detalhes do PR #${pr.number}:`, error);
              return pr;
            }
          })
        );

        allPRs = [...allPRs, ...enrichedPRs];
        
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
    if (this.isDemoMode) {
      const pr = mockPullRequests.find(p => p.number === prNumber);
      if (pr) {
        return Promise.resolve(pr);
      }
      throw new Error('PR não encontrado');
    }
    return this.makeRequest<GitHubPullRequest>(`/repos/${owner}/${repo}/pulls/${prNumber}`);
  }

  async getPullRequestReviews(
    owner: string, 
    repo: string, 
    prNumber: number
  ): Promise<GitHubReview[]> {
    if (this.isDemoMode) {
      const reviewsMap = generateMockReviews();
      return Promise.resolve(reviewsMap.get(prNumber) || []);
    }
    return this.makeRequest<GitHubReview[]>(`/repos/${owner}/${repo}/pulls/${prNumber}/reviews`);
  }

  async getPullRequestCommits(
    owner: string, 
    repo: string, 
    prNumber: number
  ): Promise<GitHubCommit[]> {
    if (this.isDemoMode) {
      const pr = mockPullRequests.find(p => p.number === prNumber);
      if (pr) {
        return Promise.resolve(generateMockCommits(pr));
      }
      return Promise.resolve([]);
    }
    return this.makeRequest<GitHubCommit[]>(`/repos/${owner}/${repo}/pulls/${prNumber}/commits`);
  }

  async getPullRequestComments(
    owner: string, 
    repo: string, 
    prNumber: number
  ): Promise<GitHubComment[]> {
    if (this.isDemoMode) {
      const pr = mockPullRequests.find(p => p.number === prNumber);
      if (pr) {
        return Promise.resolve(generateMockComments(pr));
      }
      return Promise.resolve([]);
    }
    return this.makeRequest<GitHubComment[]>(`/repos/${owner}/${repo}/issues/${prNumber}/comments`);
  }

  async getRepositoryComments(
    owner: string, 
    repo: string,
    since: string
  ): Promise<GitHubComment[]> {
    if (this.isDemoMode) {
      // Retorna comentários de todos os PRs mockados
      const allComments: GitHubComment[] = [];
      mockPullRequests.forEach(pr => {
        allComments.push(...generateMockComments(pr));
      });
      return Promise.resolve(allComments);
    }
    return this.makeRequest<GitHubComment[]>(`/repos/${owner}/${repo}/issues/comments?since=${since}&per_page=100`);
  }
}

export default GitHubService;

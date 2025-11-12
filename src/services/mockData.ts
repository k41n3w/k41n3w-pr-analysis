import { GitHubUser, GitHubRepository, GitHubPullRequest, GitHubReview, GitHubCommit, GitHubComment } from '@/types/github';

// Token de demonstração
export const DEMO_TOKEN = 'demo_token_12345';

// Usuário de demonstração
export const mockUser: GitHubUser = {
  login: 'demo_user',
  id: 1,
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  name: 'Usuário Demo',
  email: 'demo@example.com'
};

// Repositório de demonstração
export const mockRepository: GitHubRepository = {
  id: 1,
  name: 'projeto-demo',
  full_name: 'demo_user/projeto-demo',
  owner: {
    login: 'demo_user'
  },
  private: false
};

// 10 Colaboradores fictícios
export const mockCollaborators = [
  { login: 'ana_silva', name: 'Ana Silva', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana', email: 'ana.silva@demo.com' },
  { login: 'bruno_costa', name: 'Bruno Costa', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bruno', email: 'bruno.costa@demo.com' },
  { login: 'carla_santos', name: 'Carla Santos', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carla', email: 'carla.santos@demo.com' },
  { login: 'daniel_oliveira', name: 'Daniel Oliveira', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=daniel', email: 'daniel.oliveira@demo.com' },
  { login: 'fernanda_lima', name: 'Fernanda Lima', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda', email: 'fernanda.lima@demo.com' },
  { login: 'gabriel_rocha', name: 'Gabriel Rocha', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gabriel', email: 'gabriel.rocha@demo.com' },
  { login: 'helena_martins', name: 'Helena Martins', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=helena', email: 'helena.martins@demo.com' },
  { login: 'igor_ferreira', name: 'Igor Ferreira', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=igor', email: 'igor.ferreira@demo.com' },
  { login: 'julia_alves', name: 'Júlia Alves', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=julia', email: 'julia.alves@demo.com' },
  { login: 'leonardo_souza', name: 'Leonardo Souza', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leonardo', email: 'leonardo.souza@demo.com' }
];

// Função para gerar data aleatória nos últimos 30 dias
const getRandomDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Função para adicionar horas a uma data
const addHours = (dateStr: string, hours: number): string => {
  const date = new Date(dateStr);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
};

// 20 Pull Requests fictícios
export const mockPullRequests: GitHubPullRequest[] = [
  {
    id: 1,
    number: 1,
    title: 'Implementar autenticação com JWT',
    body: 'Adiciona sistema de autenticação usando tokens JWT para maior segurança.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/1',
    state: 'closed',
    merged_at: getRandomDate(5),
    created_at: getRandomDate(8),
    updated_at: getRandomDate(5),
    closed_at: getRandomDate(5),
    user: { login: mockCollaborators[0].login, avatar_url: mockCollaborators[0].avatar_url },
    labels: [{ name: 'feature', color: '0e8a16' }, { name: 'security', color: 'd73a4a' }],
    assignees: [{ login: mockCollaborators[1].login, avatar_url: mockCollaborators[1].avatar_url }],
    requested_reviewers: [],
    additions: 450,
    deletions: 120,
    commits: 8,
    draft: false
  },
  {
    id: 2,
    number: 2,
    title: 'Adicionar testes unitários para módulo de pagamentos',
    body: 'Cobertura de testes para garantir qualidade do código.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/2',
    state: 'closed',
    merged_at: getRandomDate(3),
    created_at: getRandomDate(6),
    updated_at: getRandomDate(3),
    closed_at: getRandomDate(3),
    user: { login: mockCollaborators[1].login, avatar_url: mockCollaborators[1].avatar_url },
    labels: [{ name: 'test', color: 'fbca04' }],
    assignees: [],
    requested_reviewers: [],
    additions: 320,
    deletions: 45,
    commits: 5,
    draft: false
  },
  {
    id: 3,
    number: 3,
    title: 'Corrigir bug no carrinho de compras',
    body: 'Resolve problema de duplicação de itens no carrinho.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/3',
    state: 'closed',
    merged_at: getRandomDate(2),
    created_at: getRandomDate(4),
    updated_at: getRandomDate(2),
    closed_at: getRandomDate(2),
    user: { login: mockCollaborators[2].login, avatar_url: mockCollaborators[2].avatar_url },
    labels: [{ name: 'bug', color: 'd73a4a' }],
    assignees: [],
    requested_reviewers: [],
    additions: 85,
    deletions: 62,
    commits: 3,
    draft: false
  },
  {
    id: 4,
    number: 4,
    title: 'Otimizar queries do banco de dados',
    body: 'Melhora performance das consultas mais frequentes.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/4',
    state: 'closed',
    merged_at: getRandomDate(7),
    created_at: getRandomDate(10),
    updated_at: getRandomDate(7),
    closed_at: getRandomDate(7),
    user: { login: mockCollaborators[3].login, avatar_url: mockCollaborators[3].avatar_url },
    labels: [{ name: 'performance', color: '1d76db' }],
    assignees: [{ login: mockCollaborators[4].login, avatar_url: mockCollaborators[4].avatar_url }],
    requested_reviewers: [],
    additions: 220,
    deletions: 180,
    commits: 6,
    draft: false
  },
  {
    id: 5,
    number: 5,
    title: 'Implementar dashboard de analytics',
    body: 'Nova página com métricas e gráficos de uso da plataforma.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/5',
    state: 'open',
    merged_at: null,
    created_at: getRandomDate(2),
    updated_at: getRandomDate(1),
    closed_at: null,
    user: { login: mockCollaborators[4].login, avatar_url: mockCollaborators[4].avatar_url },
    labels: [{ name: 'feature', color: '0e8a16' }],
    assignees: [],
    requested_reviewers: [{ login: mockCollaborators[5].login, avatar_url: mockCollaborators[5].avatar_url }],
    additions: 680,
    deletions: 95,
    commits: 12,
    draft: false
  },
  {
    id: 6,
    number: 6,
    title: 'Atualizar dependências do projeto',
    body: 'Atualiza bibliotecas para versões mais recentes com correções de segurança.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/6',
    state: 'closed',
    merged_at: getRandomDate(1),
    created_at: getRandomDate(3),
    updated_at: getRandomDate(1),
    closed_at: getRandomDate(1),
    user: { login: mockCollaborators[5].login, avatar_url: mockCollaborators[5].avatar_url },
    labels: [{ name: 'dependencies', color: '0366d6' }],
    assignees: [],
    requested_reviewers: [],
    additions: 145,
    deletions: 132,
    commits: 2,
    draft: false
  },
  {
    id: 7,
    number: 7,
    title: 'Refatorar componentes de UI',
    body: 'Reorganiza estrutura de componentes para melhor manutenibilidade.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/7',
    state: 'closed',
    merged_at: getRandomDate(6),
    created_at: getRandomDate(9),
    updated_at: getRandomDate(6),
    closed_at: getRandomDate(6),
    user: { login: mockCollaborators[6].login, avatar_url: mockCollaborators[6].avatar_url },
    labels: [{ name: 'refactor', color: 'fbca04' }],
    assignees: [],
    requested_reviewers: [],
    additions: 520,
    deletions: 485,
    commits: 15,
    draft: false
  },
  {
    id: 8,
    number: 8,
    title: 'Adicionar integração com API de pagamento',
    body: 'Integra plataforma com gateway de pagamento Stripe.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/8',
    state: 'open',
    merged_at: null,
    created_at: getRandomDate(1),
    updated_at: getRandomDate(1),
    closed_at: null,
    user: { login: mockCollaborators[7].login, avatar_url: mockCollaborators[7].avatar_url },
    labels: [{ name: 'feature', color: '0e8a16' }, { name: 'integration', color: 'd4c5f9' }],
    assignees: [{ login: mockCollaborators[8].login, avatar_url: mockCollaborators[8].avatar_url }],
    requested_reviewers: [{ login: mockCollaborators[0].login, avatar_url: mockCollaborators[0].avatar_url }],
    additions: 395,
    deletions: 28,
    commits: 7,
    draft: false
  },
  {
    id: 9,
    number: 9,
    title: 'Implementar sistema de notificações',
    body: 'Sistema de notificações em tempo real usando WebSockets.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/9',
    state: 'closed',
    merged_at: getRandomDate(4),
    created_at: getRandomDate(7),
    updated_at: getRandomDate(4),
    closed_at: getRandomDate(4),
    user: { login: mockCollaborators[8].login, avatar_url: mockCollaborators[8].avatar_url },
    labels: [{ name: 'feature', color: '0e8a16' }],
    assignees: [],
    requested_reviewers: [],
    additions: 440,
    deletions: 75,
    commits: 9,
    draft: false
  },
  {
    id: 10,
    number: 10,
    title: 'Corrigir responsividade em dispositivos móveis',
    body: 'Ajustes de layout para melhor experiência mobile.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/10',
    state: 'closed',
    merged_at: getRandomDate(3),
    created_at: getRandomDate(5),
    updated_at: getRandomDate(3),
    closed_at: getRandomDate(3),
    user: { login: mockCollaborators[9].login, avatar_url: mockCollaborators[9].avatar_url },
    labels: [{ name: 'bug', color: 'd73a4a' }, { name: 'ui', color: 'c5def5' }],
    assignees: [],
    requested_reviewers: [],
    additions: 165,
    deletions: 142,
    commits: 4,
    draft: false
  },
  {
    id: 11,
    number: 11,
    title: 'Adicionar documentação da API',
    body: 'Documentação completa dos endpoints usando Swagger.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/11',
    state: 'open',
    merged_at: null,
    created_at: getRandomDate(3),
    updated_at: getRandomDate(2),
    closed_at: null,
    user: { login: mockCollaborators[0].login, avatar_url: mockCollaborators[0].avatar_url },
    labels: [{ name: 'documentation', color: '0075ca' }],
    assignees: [],
    requested_reviewers: [{ login: mockCollaborators[1].login, avatar_url: mockCollaborators[1].avatar_url }],
    additions: 280,
    deletions: 15,
    commits: 6,
    draft: false
  },
  {
    id: 12,
    number: 12,
    title: 'Implementar cache com Redis',
    body: 'Adiciona camada de cache para melhorar performance.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/12',
    state: 'closed',
    merged_at: getRandomDate(8),
    created_at: getRandomDate(11),
    updated_at: getRandomDate(8),
    closed_at: getRandomDate(8),
    user: { login: mockCollaborators[1].login, avatar_url: mockCollaborators[1].avatar_url },
    labels: [{ name: 'performance', color: '1d76db' }],
    assignees: [],
    requested_reviewers: [],
    additions: 310,
    deletions: 88,
    commits: 7,
    draft: false
  },
  {
    id: 13,
    number: 13,
    title: 'Adicionar modo escuro',
    body: 'Implementa tema escuro para toda a aplicação.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/13',
    state: 'closed',
    merged_at: getRandomDate(5),
    created_at: getRandomDate(8),
    updated_at: getRandomDate(5),
    closed_at: getRandomDate(5),
    user: { login: mockCollaborators[2].login, avatar_url: mockCollaborators[2].avatar_url },
    labels: [{ name: 'feature', color: '0e8a16' }, { name: 'ui', color: 'c5def5' }],
    assignees: [{ login: mockCollaborators[3].login, avatar_url: mockCollaborators[3].avatar_url }],
    requested_reviewers: [],
    additions: 225,
    deletions: 105,
    commits: 5,
    draft: false
  },
  {
    id: 14,
    number: 14,
    title: 'Configurar CI/CD com GitHub Actions',
    body: 'Pipeline automatizado de testes e deploy.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/14',
    state: 'closed',
    merged_at: getRandomDate(6),
    created_at: getRandomDate(9),
    updated_at: getRandomDate(6),
    closed_at: getRandomDate(6),
    user: { login: mockCollaborators[3].login, avatar_url: mockCollaborators[3].avatar_url },
    labels: [{ name: 'devops', color: 'bfd4f2' }],
    assignees: [],
    requested_reviewers: [],
    additions: 185,
    deletions: 42,
    commits: 4,
    draft: false
  },
  {
    id: 15,
    number: 15,
    title: 'Implementar busca com Elasticsearch',
    body: 'Sistema de busca avançada com filtros e ordenação.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/15',
    state: 'open',
    merged_at: null,
    created_at: getRandomDate(4),
    updated_at: getRandomDate(3),
    closed_at: null,
    user: { login: mockCollaborators[4].login, avatar_url: mockCollaborators[4].avatar_url },
    labels: [{ name: 'feature', color: '0e8a16' }],
    assignees: [],
    requested_reviewers: [{ login: mockCollaborators[5].login, avatar_url: mockCollaborators[5].avatar_url }],
    additions: 540,
    deletions: 120,
    commits: 11,
    draft: true
  },
  {
    id: 16,
    number: 16,
    title: 'Adicionar validação de formulários',
    body: 'Validação client-side e server-side para todos os forms.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/16',
    state: 'closed',
    merged_at: getRandomDate(2),
    created_at: getRandomDate(4),
    updated_at: getRandomDate(2),
    closed_at: getRandomDate(2),
    user: { login: mockCollaborators[5].login, avatar_url: mockCollaborators[5].avatar_url },
    labels: [{ name: 'enhancement', color: 'a2eeef' }],
    assignees: [],
    requested_reviewers: [],
    additions: 195,
    deletions: 78,
    commits: 5,
    draft: false
  },
  {
    id: 17,
    number: 17,
    title: 'Implementar upload de arquivos',
    body: 'Sistema de upload com suporte a múltiplos arquivos e preview.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/17',
    state: 'closed',
    merged_at: getRandomDate(7),
    created_at: getRandomDate(10),
    updated_at: getRandomDate(7),
    closed_at: getRandomDate(7),
    user: { login: mockCollaborators[6].login, avatar_url: mockCollaborators[6].avatar_url },
    labels: [{ name: 'feature', color: '0e8a16' }],
    assignees: [],
    requested_reviewers: [],
    additions: 380,
    deletions: 65,
    commits: 8,
    draft: false
  },
  {
    id: 18,
    number: 18,
    title: 'Corrigir vazamento de memória',
    body: 'Resolve problema de memory leak identificado em produção.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/18',
    state: 'closed',
    merged_at: getRandomDate(1),
    created_at: getRandomDate(2),
    updated_at: getRandomDate(1),
    closed_at: getRandomDate(1),
    user: { login: mockCollaborators[7].login, avatar_url: mockCollaborators[7].avatar_url },
    labels: [{ name: 'bug', color: 'd73a4a' }, { name: 'critical', color: 'b60205' }],
    assignees: [{ login: mockCollaborators[8].login, avatar_url: mockCollaborators[8].avatar_url }],
    requested_reviewers: [],
    additions: 55,
    deletions: 48,
    commits: 2,
    draft: false
  },
  {
    id: 19,
    number: 19,
    title: 'Adicionar internacionalização (i18n)',
    body: 'Suporte para múltiplos idiomas (PT, EN, ES).',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/19',
    state: 'open',
    merged_at: null,
    created_at: getRandomDate(5),
    updated_at: getRandomDate(4),
    closed_at: null,
    user: { login: mockCollaborators[8].login, avatar_url: mockCollaborators[8].avatar_url },
    labels: [{ name: 'feature', color: '0e8a16' }, { name: 'enhancement', color: 'a2eeef' }],
    assignees: [],
    requested_reviewers: [{ login: mockCollaborators[9].login, avatar_url: mockCollaborators[9].avatar_url }],
    additions: 620,
    deletions: 205,
    commits: 14,
    draft: false
  },
  {
    id: 20,
    number: 20,
    title: 'Implementar logs estruturados',
    body: 'Sistema de logging com Winston e formatação JSON.',
    html_url: 'https://github.com/demo_user/projeto-demo/pull/20',
    state: 'closed',
    merged_at: getRandomDate(4),
    created_at: getRandomDate(6),
    updated_at: getRandomDate(4),
    closed_at: getRandomDate(4),
    user: { login: mockCollaborators[9].login, avatar_url: mockCollaborators[9].avatar_url },
    labels: [{ name: 'enhancement', color: 'a2eeef' }],
    assignees: [],
    requested_reviewers: [],
    additions: 170,
    deletions: 92,
    commits: 4,
    draft: false
  }
];

// Gerar reviews para os PRs
export const generateMockReviews = (): Map<number, GitHubReview[]> => {
  const reviewsMap = new Map<number, GitHubReview[]>();
  
  mockPullRequests.forEach(pr => {
    const reviews: GitHubReview[] = [];
    const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews por PR
    
    for (let i = 0; i < numReviews; i++) {
      const reviewer = mockCollaborators[Math.floor(Math.random() * mockCollaborators.length)];
      const states: ('APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED')[] = 
        pr.state === 'closed' && pr.merged_at ? ['APPROVED', 'COMMENTED'] : ['APPROVED', 'CHANGES_REQUESTED', 'COMMENTED'];
      
      reviews.push({
        id: pr.number * 100 + i,
        user: {
          login: reviewer.login,
          avatar_url: reviewer.avatar_url
        },
        body: i === 0 ? 'LGTM! Ótimo trabalho!' : 'Alguns ajustes necessários antes do merge.',
        state: states[Math.floor(Math.random() * states.length)],
        submitted_at: addHours(pr.created_at, (i + 1) * 4),
        pull_request_url: pr.html_url
      });
    }
    
    reviewsMap.set(pr.number, reviews);
  });
  
  return reviewsMap;
};

// Gerar commits para um PR específico
export const generateMockCommits = (pr: GitHubPullRequest): GitHubCommit[] => {
  const commits: GitHubCommit[] = [];
  const numCommits = pr.commits;
  
  for (let i = 0; i < numCommits; i++) {
    commits.push({
      sha: `${pr.number}abc${i}def${Math.random().toString(36).substring(7)}`,
      commit: {
        message: i === 0 ? 'Initial implementation' : `Update: iteration ${i}`,
        author: {
          name: pr.user.login,
          date: addHours(pr.created_at, i * 2)
        }
      },
      author: {
        login: pr.user.login,
        avatar_url: pr.user.avatar_url
      }
    });
  }
  
  return commits;
};

// Gerar comentários para um PR específico
export const generateMockComments = (pr: GitHubPullRequest): GitHubComment[] => {
  const comments: GitHubComment[] = [];
  const numComments = Math.floor(Math.random() * 5) + 2; // 2-6 comentários
  
  for (let i = 0; i < numComments; i++) {
    const commenter = mockCollaborators[Math.floor(Math.random() * mockCollaborators.length)];
    comments.push({
      id: pr.number * 1000 + i,
      body: i === 0 ? 'Poderia adicionar alguns testes?' : 'Sugestão: considere usar async/await aqui.',
      user: {
        login: commenter.login,
        avatar_url: commenter.avatar_url
      },
      created_at: addHours(pr.created_at, (i + 1) * 3),
      updated_at: addHours(pr.created_at, (i + 1) * 3)
    });
  }
  
  return comments;
};

// Lista de todos os repositórios (apenas 1 para demo)
export const mockRepositories: GitHubRepository[] = [mockRepository];

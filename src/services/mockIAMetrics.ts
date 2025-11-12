import { PrIaMetrics } from './supabase';

// Métricas de IA fictícias para os PRs de demonstração
export const mockIAMetrics: Record<number, PrIaMetrics> = {
  1: {
    repository: 'demo_user/projeto-demo',
    pr_number: 1,
    ia_tool_used: 'GitHub Copilot, ChatGPT',
    ia_usage_scenarios: 'Geração de código de autenticação JWT, Sugestões de melhores práticas de segurança',
    productivity_score: 9,
    productivity_reason: 'O uso de IA acelerou significativamente a implementação da autenticação, reduzindo o tempo de desenvolvimento em cerca de 40%. Copilot gerou boilerplate e ChatGPT ajudou com padrões de segurança.'
  },
  2: {
    repository: 'demo_user/projeto-demo',
    pr_number: 2,
    ia_tool_used: 'GitHub Copilot',
    ia_usage_scenarios: 'Geração de casos de teste unitários',
    productivity_score: 8,
    productivity_reason: 'Copilot acelerou a escrita de testes, gerando estruturas de teste e casos básicos. Economizou cerca de 30% do tempo normalmente gasto.'
  },
  3: {
    repository: 'demo_user/projeto-demo',
    pr_number: 3,
    ia_tool_used: 'ChatGPT',
    ia_usage_scenarios: 'Debug e análise de bug no carrinho',
    productivity_score: 7,
    productivity_reason: 'ChatGPT ajudou a identificar a causa raiz do problema de duplicação mais rapidamente, economizando tempo de debug.'
  },
  4: {
    repository: 'demo_user/projeto-demo',
    pr_number: 4,
    ia_tool_used: 'GitHub Copilot, ChatGPT',
    ia_usage_scenarios: 'Otimização de queries SQL, Sugestões de índices',
    productivity_score: 9,
    productivity_reason: 'IA sugeriu otimizações específicas para queries complexas e recomendou índices apropriados. Melhorou performance em 60% e reduziu tempo de desenvolvimento em 50%.'
  },
  5: {
    repository: 'demo_user/projeto-demo',
    pr_number: 5,
    ia_tool_used: 'GitHub Copilot, ChatGPT',
    ia_usage_scenarios: 'Geração de componentes React, Configuração de gráficos',
    productivity_score: 8,
    productivity_reason: 'Copilot gerou estrutura inicial dos componentes e ChatGPT ajudou com configurações específicas de biblioteca de charts. Economizou 35% do tempo.'
  },
  6: {
    repository: 'demo_user/projeto-demo',
    pr_number: 6,
    ia_tool_used: null,
    ia_usage_scenarios: null,
    productivity_score: null,
    productivity_reason: null
  },
  7: {
    repository: 'demo_user/projeto-demo',
    pr_number: 7,
    ia_tool_used: 'GitHub Copilot',
    ia_usage_scenarios: 'Refatoração de código, Sugestões de estrutura',
    productivity_score: 7,
    productivity_reason: 'Copilot ajudou com padrões de refatoração e sugeriu estruturas melhores para componentes. Economizou 25% do tempo.'
  },
  8: {
    repository: 'demo_user/projeto-demo',
    pr_number: 8,
    ia_tool_used: 'ChatGPT, GitHub Copilot',
    ia_usage_scenarios: 'Documentação da API Stripe, Geração de código de integração',
    productivity_score: 9,
    productivity_reason: 'ChatGPT forneceu exemplos claros da integração com Stripe e Copilot completou o código rapidamente. Reduziu tempo de implementação em 45%.'
  },
  9: {
    repository: 'demo_user/projeto-demo',
    pr_number: 9,
    ia_tool_used: 'GitHub Copilot, ChatGPT',
    ia_usage_scenarios: 'Implementação de WebSockets, Gerenciamento de estado em tempo real',
    productivity_score: 8,
    productivity_reason: 'IA ajudou com padrões de WebSocket e gerenciamento de conexões. Acelerou implementação em 40%.'
  },
  10: {
    repository: 'demo_user/projeto-demo',
    pr_number: 10,
    ia_tool_used: 'GitHub Copilot',
    ia_usage_scenarios: 'Ajustes de CSS responsivo',
    productivity_score: 6,
    productivity_reason: 'Copilot sugeriu media queries e ajustes de layout. Economizou 20% do tempo, mas ainda exigiu bastante ajuste manual.'
  },
  11: {
    repository: 'demo_user/projeto-demo',
    pr_number: 11,
    ia_tool_used: 'ChatGPT',
    ia_usage_scenarios: 'Geração de documentação Swagger, Exemplos de uso da API',
    productivity_score: 9,
    productivity_reason: 'ChatGPT gerou documentação detalhada e exemplos práticos rapidamente. Economizou cerca de 50% do tempo de documentação.'
  },
  12: {
    repository: 'demo_user/projeto-demo',
    pr_number: 12,
    ia_tool_used: 'ChatGPT, GitHub Copilot',
    ia_usage_scenarios: 'Configuração do Redis, Estratégias de cache',
    productivity_score: 8,
    productivity_reason: 'IA forneceu melhores práticas para configuração de cache e padrões de invalidação. Reduziu tempo de implementação em 35%.'
  },
  13: {
    repository: 'demo_user/projeto-demo',
    pr_number: 13,
    ia_tool_used: 'GitHub Copilot',
    ia_usage_scenarios: 'Geração de tema escuro, Variáveis CSS',
    productivity_score: 7,
    productivity_reason: 'Copilot ajudou a gerar variáveis de tema e aplicar em componentes. Economizou 30% do tempo.'
  },
  14: {
    repository: 'demo_user/projeto-demo',
    pr_number: 14,
    ia_tool_used: 'ChatGPT',
    ia_usage_scenarios: 'Configuração de workflows GitHub Actions',
    productivity_score: 8,
    productivity_reason: 'ChatGPT gerou configurações completas de CI/CD com boas práticas. Economizou 40% do tempo de setup.'
  },
  15: {
    repository: 'demo_user/projeto-demo',
    pr_number: 15,
    ia_tool_used: 'ChatGPT, GitHub Copilot',
    ia_usage_scenarios: 'Configuração Elasticsearch, Implementação de queries de busca',
    productivity_score: 9,
    productivity_reason: 'IA ajudou com configuração complexa do Elasticsearch e sugeriu queries otimizadas. Reduziu curva de aprendizado em 60%.'
  },
  16: {
    repository: 'demo_user/projeto-demo',
    pr_number: 16,
    ia_tool_used: 'GitHub Copilot',
    ia_usage_scenarios: 'Validações de formulário, Mensagens de erro',
    productivity_score: 7,
    productivity_reason: 'Copilot gerou validações padrão e mensagens de erro consistentes. Economizou 25% do tempo.'
  },
  17: {
    repository: 'demo_user/projeto-demo',
    pr_number: 17,
    ia_tool_used: 'GitHub Copilot, ChatGPT',
    ia_usage_scenarios: 'Implementação de upload de arquivos, Preview de imagens',
    productivity_score: 8,
    productivity_reason: 'IA forneceu código base para upload e preview, incluindo tratamento de erros. Economizou 35% do tempo.'
  },
  18: {
    repository: 'demo_user/projeto-demo',
    pr_number: 18,
    ia_tool_used: 'ChatGPT',
    ia_usage_scenarios: 'Debug de memory leak, Análise de código',
    productivity_score: 9,
    productivity_reason: 'ChatGPT identificou rapidamente o padrão que causava o memory leak. Economizou horas de debug manual.'
  },
  19: {
    repository: 'demo_user/projeto-demo',
    pr_number: 19,
    ia_tool_used: 'GitHub Copilot, ChatGPT',
    ia_usage_scenarios: 'Setup de i18n, Tradução de textos',
    productivity_score: 8,
    productivity_reason: 'IA ajudou com configuração do sistema de tradução e geração de arquivos de idioma. Economizou 40% do tempo.'
  },
  20: {
    repository: 'demo_user/projeto-demo',
    pr_number: 20,
    ia_tool_used: 'ChatGPT',
    ia_usage_scenarios: 'Configuração de Winston logger, Estruturação de logs',
    productivity_score: 7,
    productivity_reason: 'ChatGPT forneceu configuração completa e melhores práticas de logging. Economizou 30% do tempo.'
  }
};

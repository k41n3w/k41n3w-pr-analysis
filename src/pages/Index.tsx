import { useState } from 'react';
import { AuthScreen } from '@/components/AuthScreen';
import { RepoSelectionScreen } from '@/components/RepoSelectionScreen';
import { Dashboard } from '@/components/Dashboard';
import { PRDetailScreen } from '@/components/PRDetailScreen';
import { AppState, GitHubUser, GitHubRepository, DateRange, GitHubPullRequest } from '@/types/github';

const Index = () => {
  const [appState, setAppState] = useState<AppState>({
    token: null,
    user: null,
    selectedRepo: null,
    dateRange: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    },
    currentScreen: 'auth',
    selectedPR: null,
    isLoading: false,
    error: null
  });

  const handleAuthenticated = (token: string, user: GitHubUser) => {
    setAppState(prev => ({
      ...prev,
      token,
      user,
      currentScreen: 'repo-selection'
    }));
  };

  const handleRepoSelected = (repo: GitHubRepository, dateRange: DateRange) => {
    setAppState(prev => ({
      ...prev,
      selectedRepo: repo,
      dateRange,
      currentScreen: 'dashboard'
    }));
  };

  const handlePRClick = (pr: GitHubPullRequest) => {
    setAppState(prev => ({
      ...prev,
      selectedPR: pr,
      currentScreen: 'pr-detail'
    }));
  };

  const goBack = () => {
    switch (appState.currentScreen) {
      case 'repo-selection':
        setAppState(prev => ({ ...prev, currentScreen: 'auth', user: null, token: null }));
        break;
      case 'dashboard':
        setAppState(prev => ({ ...prev, currentScreen: 'repo-selection', selectedRepo: null }));
        break;
      case 'pr-detail':
        setAppState(prev => ({ ...prev, currentScreen: 'dashboard', selectedPR: null }));
        break;
    }
  };

  switch (appState.currentScreen) {
    case 'auth':
      return <AuthScreen onAuthenticated={handleAuthenticated} />;
    
    case 'repo-selection':
      return (
        <RepoSelectionScreen
          token={appState.token!}
          onRepoSelected={handleRepoSelected}
          onBack={goBack}
        />
      );
    
    case 'dashboard':
      return (
        <Dashboard
          token={appState.token!}
          repository={appState.selectedRepo!}
          dateRange={appState.dateRange}
          onBack={goBack}
          onPRClick={handlePRClick}
        />
      );
    
    case 'pr-detail':
      return (
        <PRDetailScreen
          pr={appState.selectedPR!}
          token={appState.token!}
          repositoryFullName={appState.selectedRepo!.full_name}
          onBack={goBack}
        />
      );
    
    default:
      return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }
};

export default Index;

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Github, Lock, Loader2 } from 'lucide-react';
import GitHubService from '@/services/github';

interface AuthScreenProps {
  onAuthenticated: (token: string, user: any) => void;
}

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const githubService = new GitHubService(token);
      const user = await githubService.validateToken();
      onAuthenticated(token, user);
    } catch (err: any) {
      setError('Token inválido. Verifique se o token está correto e tem as permissões necessárias.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-github-blue/5 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-elevated">
            <Github className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            k41n3w TL
          </h1>
          <p className="text-lg text-muted-foreground">
            Análise de Pull Requests
          </p>
        </div>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Autenticação
            </CardTitle>
            <CardDescription>
              Digite seu token pessoal do GitHub para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token Pessoal do GitHub</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="font-mono"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  O token precisa ter permissões de leitura para repositórios e pull requests
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={isLoading || !token.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  'Conectar'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Como criar um token:</strong><br />
                1. Vá para GitHub → Settings → Developer settings<br />
                2. Clique em "Personal access tokens" → "Tokens (classic)"<br />
                3. Gere um novo token com permissões: repo, user
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
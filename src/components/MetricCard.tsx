import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'green' | 'blue' | 'orange' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

const colorClasses = {
  default: 'from-muted/50 to-muted/30 text-foreground',
  green: 'from-github-green/20 to-github-green/5 text-github-green border-github-green/20',
  blue: 'from-github-blue/20 to-github-blue/5 text-github-blue border-github-blue/20',
  orange: 'from-github-orange/20 to-github-orange/5 text-github-orange border-github-orange/20',
  red: 'from-github-red/20 to-github-red/5 text-github-red border-github-red/20',
  purple: 'from-github-purple/20 to-github-purple/5 text-github-purple border-github-purple/20',
};

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'default',
  size = 'md'
}: MetricCardProps) {
  return (
    <Card className={cn(
      "shadow-card border bg-gradient-to-br transition-all duration-300 hover:shadow-elevated hover:-translate-y-1",
      colorClasses[color]
    )}>
      <CardHeader className={cn("pb-2", sizeClasses[size])}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="w-5 h-5 opacity-60" />
        </div>
      </CardHeader>
      <CardContent className={cn("pt-0", sizeClasses[size])}>
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-medium",
              trend.isPositive ? "text-github-green" : "text-github-red"
            )}>
              <span className={cn(
                "mr-1",
                trend.isPositive ? "text-github-green" : "text-github-red"
              )}>
                {trend.isPositive ? "↗" : "↘"}
              </span>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
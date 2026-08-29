import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface KPICardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  trend?: { value: number; isPositive: boolean };
  href?: string;
  iconBg?: string;
}

export function KPICard({ icon: Icon, label, value, trend, href, iconBg }: KPICardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
            {trend && (
              <p
                className={cn(
                  'mt-1 text-xs font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}% from last month
              </p>
            )}
          </div>
          <div className={cn('rounded-lg p-2', iconBg || 'bg-primary/10')}>
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        {href && (
          <Link
            to={href}
            className="text-primary mt-3 inline-flex items-center gap-1 text-xs font-medium hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const statusConfig: Record<string, { variant: BadgeVariant; className: string }> = {
  ACTIVE: {
    variant: 'default',
    className: 'border-success/20 bg-success/10 text-success hover:bg-success/10',
  },
  PLANNED: {
    variant: 'outline',
    className: 'border-info/20 bg-info/10 text-info hover:bg-info/10',
  },
  ONGOING: {
    variant: 'default',
    className: 'border-success/20 bg-success/10 text-success hover:bg-success/10',
  },
  COMPLETED: {
    variant: 'secondary',
    className: 'border-border bg-muted text-muted-foreground hover:bg-muted',
  },
  SUSPENDED: {
    variant: 'outline',
    className: 'border-warning/20 bg-warning/10 text-warning hover:bg-warning/10',
  },
  ON_HOLD: {
    variant: 'outline',
    className: 'border-warning/20 bg-warning/10 text-warning hover:bg-warning/10',
  },
  PROPOSED: {
    variant: 'outline',
    className: 'border-info/20 bg-info/10 text-info hover:bg-info/10',
  },
  AVAILABLE: {
    variant: 'default',
    className: 'border-success/20 bg-success/10 text-success hover:bg-success/10',
  },
  IN_USE: {
    variant: 'default',
    className: 'border-warning/20 bg-warning/10 text-warning hover:bg-warning/10',
  },
  UNDER_MAINTENANCE: {
    variant: 'outline',
    className: 'border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/10',
  },
  DECOMMISSIONED: {
    variant: 'secondary',
    className: 'border-border bg-muted text-muted-foreground hover:bg-muted',
  },
  UNREAD: {
    variant: 'default',
    className: 'border-primary/20 bg-primary/10 text-primary hover:bg-primary/10',
  },
  READ: {
    variant: 'secondary',
    className: 'border-border bg-muted text-muted-foreground hover:bg-muted',
  },
  IN_PROGRESS: {
    variant: 'outline',
    className: 'border-warning/20 bg-warning/10 text-warning hover:bg-warning/10',
  },
  REPLIED: {
    variant: 'default',
    className: 'border-success/20 bg-success/10 text-success hover:bg-success/10',
  },
  ARCHIVED: {
    variant: 'secondary',
    className: 'border-border bg-muted text-muted-foreground hover:bg-muted',
  },
  DRAFT: {
    variant: 'secondary',
    className: 'border-border bg-muted text-muted-foreground hover:bg-muted',
  },
  PUBLISHED: {
    variant: 'default',
    className: 'border-success/20 bg-success/10 text-success hover:bg-success/10',
  },
  INACTIVE: {
    variant: 'secondary',
    className: 'border-border bg-muted text-muted-foreground hover:bg-muted',
  },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    variant: 'secondary' as BadgeVariant,
    className: '',
  };

  return (
    <Badge
      variant={config.variant}
      className={cn('text-[10px] font-medium', config.className, className)}
    >
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}

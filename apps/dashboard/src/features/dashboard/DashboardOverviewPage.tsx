import { getMetrics } from '@/api/domains/dashboard';
import { getUnreadMessages } from '@/api/domains/messages';
import { listProjects } from '@/api/domains/projects';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Car, FolderOpen, MessageSquare, Users } from 'lucide-react';
import { ContentOverviewChart } from './ContentOverviewChart';
import { KPICard } from './KPICard';
import { LatestProjectsTable } from './LatestProjectsTable';
import { RecentActivityList } from './RecentActivityList';
import { UnreadMessagesList } from './UnreadMessagesList';

function KPICardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-12" />
        </div>
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  );
}

export function DashboardOverviewPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: getMetrics,
  });

  const { data: projectsData } = useQuery({
    queryKey: ['admin-projects-overview'],
    queryFn: () => listProjects({ limit: 5 }),
  });

  const { data: unreadMessages } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: getUnreadMessages,
  });

  const kpiCards = metrics
    ? [
        { icon: Users, label: 'Staff', value: metrics.totalStaff, href: '/dashboard/staff' },
        {
          icon: FolderOpen,
          label: 'Projects',
          value: metrics.totalProjects,
          href: '/dashboard/projects',
        },
        {
          icon: BookOpen,
          label: 'Publications',
          value: metrics.totalPublications,
          href: '/dashboard/publications',
        },
        {
          icon: Car,
          label: 'Vehicles',
          value: `${metrics.availableVehicles} / ${metrics.totalVehicles}`,
          href: '/dashboard/vehicles',
        },
        {
          icon: MessageSquare,
          label: 'Messages',
          value: metrics.unreadMessages,
          href: '/dashboard/messages',
        },
      ]
    : [];

  const chartData = [
    { label: 'Projects', value: metrics?.totalProjects || 0, color: 'hsl(var(--chart-1))' },
    {
      label: 'Publications',
      value: metrics?.totalPublications || 0,
      color: 'hsl(var(--chart-2))',
    },
    { label: 'Staff', value: metrics?.totalStaff || 0, color: 'hsl(var(--chart-3))' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of TARCMS content and activities.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {isLoading
          ? Array.from({ length: 5 }, (_, i) => <KPICardSkeleton key={`skeleton-${i}`} />)
          : kpiCards.map((card) => <KPICard key={card.label} {...card} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ContentOverviewChart data={chartData} />
        <RecentActivityList activities={[]} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LatestProjectsTable projects={projectsData?.data ?? []} />
        <UnreadMessagesList messages={unreadMessages ?? []} />
      </div>
    </div>
  );
}

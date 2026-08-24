import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Car, FolderOpen, MessageSquare, Users } from 'lucide-react';

interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  totalPublications: number;
  totalStaff: number;
  availableVehicles: number;
  totalVehicles: number;
  unreadMessages: number;
}

async function fetchMetrics(): Promise<DashboardMetrics> {
  const response = await fetch('/api/v1/admin/dashboard/metrics', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const data = await response.json();
  return data.data;
}

function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

export function DashboardOverviewPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: fetchMetrics,
  });

  const cards = metrics
    ? [
        { title: 'Total Projects', value: metrics.totalProjects, icon: FolderOpen },
        { title: 'Active Projects', value: metrics.activeProjects, icon: FolderOpen },
        { title: 'Publications', value: metrics.totalPublications, icon: BookOpen },
        { title: 'Staff Members', value: metrics.totalStaff, icon: Users },
        {
          title: 'Available Vehicles',
          value: `${metrics.availableVehicles} / ${metrics.totalVehicles}`,
          icon: Car,
        },
        { title: 'Unread Messages', value: metrics.unreadMessages, icon: MessageSquare },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to the TARC Management Portal</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? [
              'skeleton-1',
              'skeleton-2',
              'skeleton-3',
              'skeleton-4',
              'skeleton-5',
              'skeleton-6',
            ].map((key) => <MetricCardSkeleton key={key} />)
          : cards.map((card) => (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}

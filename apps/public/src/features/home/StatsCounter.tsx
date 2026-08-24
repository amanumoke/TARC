/**
 * @file apps/public/src/features/home/StatsCounter.tsx
 * @description Dynamic statistics counter displaying key institutional metrics.
 * Shows active projects, published papers, and varieties released.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { Beaker, BookOpen, Sprout } from 'lucide-react';

interface DashboardStats {
  totalDepartments: number;
  totalStaff: number;
  totalPublications: number;
  totalProjects: number;
}

async function fetchStats(): Promise<DashboardStats> {
  const response = await fetch('/api/v1/admin/dashboard/metrics');
  const data = await response.json();
  return data.data;
}

/**
 * Stats counter section displaying key institutional metrics.
 * Fetches data from dashboard metrics API.
 */
export function StatsCounter() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['public-stats'],
    queryFn: fetchStats,
  });

  const statItems = [
    {
      label: 'Active Projects',
      value: stats?.totalProjects || 0,
      icon: Beaker,
    },
    {
      label: 'Published Papers',
      value: stats?.totalPublications || 0,
      icon: BookOpen,
    },
    {
      label: 'Research Staff',
      value: stats?.totalStaff || 0,
      icon: Sprout,
    },
  ];

  return (
    <section className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map(() => (
                <Card key={crypto.randomUUID()}>
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))
            : statItems.map((item) => (
                <Card key={item.label}>
                  <CardContent className="p-6 text-center">
                    <item.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                    <div className="text-3xl font-bold">{item.value}</div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
}

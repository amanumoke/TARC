/**
 * @file apps/public/src/features/home/StatsCounter.tsx
 * @description Stats section matching the TARCMS design screenshot.
 * Three stat cards with icons in a row.
 */

import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileText, Users } from 'lucide-react';

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

export function StatsCounter() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['public-stats'],
    queryFn: fetchStats,
  });

  const statItems = [
    {
      label: 'ACTIVE PROGRAMS',
      value: stats?.totalProjects || 0,
      suffix: '+',
      icon: BookOpen,
    },
    {
      label: 'PUBLICATIONS',
      value: stats?.totalPublications || 0,
      suffix: '+',
      icon: FileText,
    },
    {
      label: 'SPECIALIZED STAFF',
      value: stats?.totalStaff || 0,
      suffix: '+',
      icon: Users,
    },
  ];

  return (
    <section className="py-10 px-6 border-t border-[#e2e3e0]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-[#e2e3e0]">
          {isLoading
            ? Array.from({ length: 3 }).map(() => (
                <div key={crypto.randomUUID()} className="flex items-center gap-4 px-8 py-4">
                  <Skeleton className="h-9 w-9 rounded" />
                  <div>
                    <Skeleton className="h-7 w-14 mb-1" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              ))
            : statItems.map((item) => (
                <div key={item.label} className="flex items-center gap-4 px-8 py-4">
                  <div className="h-9 w-9 rounded border border-[#e2e3e0] flex items-center justify-center">
                    <item.icon className="h-4.5 w-4.5 text-[#414844]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#1a1c1a]">
                      {item.value}
                      <span className="text-[#1B4332]">{item.suffix}</span>
                    </div>
                    <div className="text-[10px] font-semibold text-[#717973] tracking-widest uppercase">
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

/**
 * @file apps/public/src/features/home/FeaturedResearchSection.tsx
 * @description Featured research section matching the TARCMS design screenshot.
 * Horizontal cards with image left, content right.
 */

import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';

interface ResearchProgram {
  id: string;
  title: string;
  description: string;
  status: string;
}

async function fetchPrograms(): Promise<ResearchProgram[]> {
  const response = await fetch('/api/v1/research/programs');
  const data = await response.json();
  return data.data;
}

export function FeaturedResearchSection() {
  const { data: programs, isLoading } = useQuery({
    queryKey: ['featured-programs'],
    queryFn: fetchPrograms,
  });

  const fallbackPrograms = [
    {
      id: '1',
      title: 'High Yielding Ginger Cultivars',
      description:
        'Identifying and evaluating ginger varieties specifically adapted to the southwest highland ecology, maximizing rhizome size and disease resistance for local farmers.',
      status: 'ACTIVE',
    },
    {
      id: '2',
      title: 'Coffee Wilt Disease Management',
      description:
        'A comprehensive study investigating the epidemiology of Tracheomyocosis in Arabica coffee, aiming to establish integrated pest management strategies to protect this vital cash crop.',
      status: 'PENDING',
    },
  ];

  const items = programs?.slice(0, 2) || fallbackPrograms;

  return (
    <section className="py-16 px-6 border-t border-[#e2e3e0]">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[10px] font-semibold text-[#717973] tracking-[0.2em] uppercase mb-2">
              ── Ongoing Focus
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#1a1c1a]"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Featured Research Areas
            </h2>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 text-xs font-semibold text-[#1a1c1a] tracking-widest uppercase hover:text-[#1B4332] transition-colors"
          >
            VIEW ALL PROJECTS
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Cards */}
        <div className="space-y-0 divide-y divide-[#e2e3e0] border-t border-[#e2e3e0]">
          {isLoading
            ? Array.from({ length: 2 }).map(() => (
                <div key={crypto.randomUUID()} className="flex gap-8 py-6">
                  <Skeleton className="h-36 w-40 rounded flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-1/3 mb-3" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              ))
            : items.map((program) => (
                <div key={program.id} className="flex gap-8 py-6 group">
                  {/* Image placeholder */}
                  <div className="h-36 w-40 bg-[#e8e8e5] rounded flex-shrink-0" />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-base text-[#1a1c1a]">{program.title}</h3>
                      <span className="text-[10px] font-semibold text-[#717973] tracking-widest uppercase border border-[#e2e3e0] rounded px-2 py-0.5 flex-shrink-0">
                        {program.status === 'ACTIVE' ? 'HORTICULTURE' : 'PLANT PATHOLOGY'}
                      </span>
                    </div>
                    <p className="text-sm text-[#414844] leading-relaxed line-clamp-2 mb-4">
                      {program.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[10px] font-semibold text-[#717973] tracking-widest uppercase">
                        <span>
                          STATUS:{' '}
                          <span className="text-[#1a1c1a]">
                            {program.status === 'ACTIVE' ? 'ACTIVE PHASE 2' : 'PENDING'}
                          </span>
                        </span>
                        <span>ID: PRG-23-{String(program.id).padStart(3, '0')}</span>
                      </div>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-[10px] font-semibold text-[#1a1c1a] tracking-widest uppercase hover:text-[#1B4332] transition-colors"
                      >
                        DETAILS
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

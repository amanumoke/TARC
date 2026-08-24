/**
 * @file apps/public/src/features/home/FeaturedResearchSection.tsx
 * @description Featured research section displaying highlight cards.
 * Shows featured programs and projects from the research portfolio.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Compass, Sprout } from 'lucide-react';

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

/**
 * Featured research section displaying key programs.
 * Fetches active programs from the research API.
 */
export function FeaturedResearchSection() {
  const { data: programs, isLoading } = useQuery({
    queryKey: ['featured-programs'],
    queryFn: fetchPrograms,
  });

  const icons = [Sprout, Compass, BookOpen];

  return (
    <section className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Research Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map(() => (
                <Card key={crypto.randomUUID()}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))
            : programs?.slice(0, 3).map((program, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <Card key={program.id}>
                    <CardHeader>
                      <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{program.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {program.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">Status: {program.status}</p>
                    </CardContent>
                  </Card>
                );
              })}
        </div>
      </div>
    </section>
  );
}

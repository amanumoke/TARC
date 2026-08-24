/**
 * @file apps/public/src/features/research/PublicResearchPage.tsx
 * @description Public research page displaying programs and projects.
 * Shows active research programs and their associated projects.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

interface ResearchProgram {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface ResearchProject {
  id: string;
  title: string;
  summary: string;
  status: string;
}

async function fetchPrograms(): Promise<ResearchProgram[]> {
  const response = await fetch('/api/v1/research/programs');
  const data = await response.json();
  return data.data;
}

async function fetchProjects(): Promise<ResearchProject[]> {
  const response = await fetch('/api/v1/research/projects');
  const data = await response.json();
  return data.data;
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  );
}

export function PublicResearchPage() {
  const { data: programs, isLoading: programsLoading } = useQuery({
    queryKey: ['public-programs'],
    queryFn: fetchPrograms,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['public-projects'],
    queryFn: fetchProjects,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Research Programs</h1>
        <p className="text-muted-foreground">
          Strategic research initiatives at Tepi Agricultural Research Center
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Programs</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {programsLoading
            ? Array.from({ length: 2 }).map(() => <CardSkeleton key={crypto.randomUUID()} />)
            : programs?.map((program) => (
                <Card key={program.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{program.status}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{program.description}</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Active Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {projectsLoading
            ? Array.from({ length: 4 }).map(() => <CardSkeleton key={crypto.randomUUID()} />)
            : projects?.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.status}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{project.summary}</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </section>
    </div>
  );
}

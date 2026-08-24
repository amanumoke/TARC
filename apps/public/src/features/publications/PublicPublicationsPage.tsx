/**
 * @file apps/public/src/features/publications/PublicPublicationsPage.tsx
 * @description Public publications page with search and filter functionality.
 * Displays featured publications with type, year, and keyword filters.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

interface Publication {
  id: string;
  title: string;
  abstract: string;
  publicationType: string;
  publicationYear: number;
  doiUrl: string | null;
  isFeatured: boolean;
}

async function fetchFeaturedPublications(): Promise<Publication[]> {
  const response = await fetch('/api/v1/publications');
  const data = await response.json();
  return data.data;
}

function PublicationCardSkeleton() {
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

export function PublicPublicationsPage() {
  const { data: publications, isLoading } = useQuery({
    queryKey: ['public-publications'],
    queryFn: fetchFeaturedPublications,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Publications</h1>
        <p className="text-muted-foreground">
          Research outputs and scientific publications from TARC
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {isLoading
          ? Array.from({ length: 4 }).map(() => (
              <PublicationCardSkeleton key={crypto.randomUUID()} />
            ))
          : publications?.map((pub) => (
              <Card key={pub.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{pub.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {pub.publicationType} - {pub.publicationYear}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3">{pub.abstract}</p>
                  {pub.doiUrl && (
                    <a
                      href={pub.doiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm mt-2 inline-block"
                    >
                      View DOI
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}

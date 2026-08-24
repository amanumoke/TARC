/**
 * @file apps/public/src/features/gallery/PublicGalleryPage.tsx
 * @description Public gallery page with categorized photo grid.
 * Displays media assets organized by category with lightbox viewing.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

interface GalleryMedia {
  id: string;
  title: string;
  caption: string | null;
  category: string;
  imageUrl: string;
  thumbnailUrl: string | null;
}

const CATEGORIES = [
  'FIELD_TRIALS',
  'LABORATORY',
  'SPICE_VARIETIES',
  'COFFEE_RESEARCH',
  'COMMUNITY_OUTREACH',
  'FACILITIES',
];

async function fetchGalleryByCategory(category: string): Promise<GalleryMedia[]> {
  const response = await fetch(`/api/v1/communication/gallery/${category}`);
  const data = await response.json();
  return data.data;
}

function GalleryCardSkeleton() {
  return (
    <Card>
      <Skeleton className="h-48 w-full rounded-t-lg" />
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
    </Card>
  );
}

export function PublicGalleryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gallery</h1>
        <p className="text-muted-foreground">Photos from research activities at TARC</p>
      </div>

      {CATEGORIES.map((category) => (
        <GallerySection key={category} category={category} />
      ))}
    </div>
  );
}

function GallerySection({ category }: { category: string }) {
  const { data: media, isLoading } = useQuery({
    queryKey: ['public-gallery', category],
    queryFn: () => fetchGalleryByCategory(category),
  });

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{category.replace(/_/g, ' ')}</h2>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map(() => <GalleryCardSkeleton key={crypto.randomUUID()} />)
          : media?.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <img
                  src={item.thumbnailUrl || item.imageUrl}
                  alt={item.title}
                  className="h-48 w-full object-cover"
                />
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">{item.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
      </div>
    </section>
  );
}

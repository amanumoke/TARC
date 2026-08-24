/**
 * @file apps/public/src/features/news/PublicNewsPage.tsx
 * @description Public news page displaying published articles.
 * Shows news articles with category filtering.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
}

async function fetchPublishedNews(): Promise<NewsArticle[]> {
  const response = await fetch('/api/v1/communication/news');
  const data = await response.json();
  return data.data;
}

function NewsCardSkeleton() {
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

export function PublicNewsPage() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['public-news'],
    queryFn: fetchPublishedNews,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">News</h1>
        <p className="text-muted-foreground">Latest updates and announcements from TARC</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {isLoading
          ? Array.from({ length: 4 }).map(() => <NewsCardSkeleton key={crypto.randomUUID()} />)
          : articles?.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {article.category} - {new Date(article.publishedAt).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3">{article.summary}</p>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}

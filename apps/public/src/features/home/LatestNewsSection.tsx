import { PlaceholderImage } from '@/components/PlaceholderImage';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNews } from '@/hooks/useNews';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function NewsCardSkeleton() {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function LatestNewsSection() {
  const { data: newsItems, isLoading } = useNews({ limit: 3 });

  const items = newsItems || [];

  return (
    <section className="py-16 px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-muted-foreground tracking-[0.2em] uppercase mb-2">
              ── Latest Updates
            </p>
            <h2 className="text-3xl md:text-4xl text-foreground font-heading">
              News & Announcements
            </h2>
          </div>
          <Button
            variant="outline"
            className="text-xs font-semibold tracking-wide uppercase"
            render={<Link to="/news" />}
          >
            View All News
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <NewsCardSkeleton key={i} />)
            : items.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.slug}`}
                  className="group border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
                >
                  <PlaceholderImage
                    label={item.title}
                    aspectRatio="video"
                    className="rounded-none border-0 border-b"
                  />
                  <div className="p-5 space-y-3">
                    {item.category && (
                      <span className="inline-block bg-primary/10 text-primary text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5">
                        {item.category}
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.summary || item.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.publishedAt || item.createdAt)}
                      </span>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide group-hover:underline">
                        Read More
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

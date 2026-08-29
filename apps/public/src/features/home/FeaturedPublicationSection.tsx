import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePublications } from '@/hooks/usePublications';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

function PublicationCardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-5 bg-card space-y-3">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function FeaturedPublicationSection() {
  const { data: publications, isLoading } = usePublications();

  const items = (publications || []).slice(0, 3);

  return (
    <section className="py-16 px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-muted-foreground tracking-[0.2em] uppercase mb-2">
              ── Our Contributions
            </p>
            <h2 className="text-3xl md:text-4xl text-foreground font-heading">
              Featured Publications
            </h2>
          </div>
          <Button
            variant="outline"
            className="text-xs font-semibold tracking-wide uppercase"
            render={<Link to="/publications" />}
          >
            View All Publications
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <PublicationCardSkeleton key={i} />)
          ) : items.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground text-sm">
              No publications available.
            </div>
          ) : (
            items.map((pub) => (
              <div
                key={pub.id}
                className="border border-border rounded-lg p-5 bg-card hover:shadow-md transition-shadow space-y-3"
              >
                {pub.type && (
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                    {pub.type}
                  </Badge>
                )}
                <h3 className="text-lg font-semibold text-foreground line-clamp-2 leading-snug">
                  {pub.title}
                </h3>
                {pub.authors && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors}
                  </p>
                )}
                {pub.abstract && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{pub.abstract}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {pub.year || 'N/A'}
                  </span>
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary hover:underline uppercase tracking-wide"
                    >
                      DOI Link
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

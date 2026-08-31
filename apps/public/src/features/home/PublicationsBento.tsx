import { usePublications } from '@/api/hooks/usePublications';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PublicationsBento() {
  const { data: publications, isLoading } = usePublications();

  const items = (publications || []).slice(0, 4);

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Our Contributions
            </p>
            <h2 className="font-heading text-[28px] lg:text-[36px] font-bold text-foreground leading-[1.1]">
              Publications
            </h2>
          </div>
          <Link
            to="/publications"
            className="hidden sm:flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-6">
                <Skeleton className="h-4 w-16 mb-3" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8">No publications yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((pub, index) => (
              <div
                key={pub.id}
                className={`bg-white p-6 lg:p-8 ${index === 0 ? 'md:row-span-2' : ''}`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                  {pub.publicationYear}
                </span>
                <h3
                  className={`mt-3 font-heading font-bold text-foreground leading-snug ${
                    index === 0 ? 'text-[22px] lg:text-[28px]' : 'text-[17px] lg:text-[20px]'
                  }`}
                >
                  {pub.title}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                  {pub.authors && (
                    <span>
                      {Array.isArray(pub.authors)
                        ? pub.authors.slice(0, 2).join(', ')
                        : pub.authors}
                    </span>
                  )}
                  {pub.publicationType && (
                    <>
                      <span className="text-border">&middot;</span>
                      <span className="uppercase tracking-widest">{pub.publicationType}</span>
                    </>
                  )}
                </div>
                {pub.abstract && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{pub.abstract}</p>
                )}
                {pub.doiUrl && (
                  <a
                    href={`https://doi.org/${pub.doiUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                  >
                    DOI <ArrowRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

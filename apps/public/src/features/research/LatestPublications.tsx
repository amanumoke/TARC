import { usePublications } from '@/api/hooks/usePublications';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LatestPublications() {
  const { data: publications, isLoading } = usePublications();

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-24 bg-[var(--r-border)]/30 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const pubs = publications || [];

  return (
    <section className="py-20 lg:py-32 bg-[var(--r-bg)]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--r-text-secondary)] mb-4">
              Latest Research Outputs
            </p>
            <h2 className="font-editorial text-[32px] lg:text-[48px] font-bold uppercase tracking-tight text-[var(--r-text)] leading-[0.95]">
              Publications
            </h2>
          </div>
          <Link
            to="/publications"
            className="hidden sm:flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-[var(--r-forest)] hover:text-[var(--r-secondary)] transition-colors"
          >
            All Publications
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {pubs.length === 0 ? (
          <p className="text-[var(--r-text-secondary)]">No publications available yet.</p>
        ) : (
          <div>
            {pubs.map((pub) => (
              <div
                key={pub.id}
                className="flex items-start justify-between gap-6 py-6 border-b border-[var(--r-border)]"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--r-accent)]">
                    {pub.publicationYear}
                  </span>
                  <h3 className="mt-2 text-[16px] lg:text-[20px] font-medium text-[var(--r-text)] leading-snug">
                    {pub.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-[12px] text-[var(--r-text-secondary)]">
                    <span>{pub.authors?.slice(0, 2).join(', ')}</span>
                    <span className="text-[var(--r-border)]">&middot;</span>
                    <span className="uppercase tracking-widest">{pub.publicationType}</span>
                  </div>
                </div>

                <Link
                  to="/publications"
                  className="hidden sm:flex items-center gap-1 text-[12px] font-medium uppercase tracking-widest text-[var(--r-text-secondary)] hover:text-[var(--r-forest)] transition-colors flex-shrink-0"
                >
                  Read
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

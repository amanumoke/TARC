import { usePublications } from '@/api/hooks/usePublications';
import { ArrowRight, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function PublicPublicationsPage() {
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  const { data: publications, isLoading } = usePublications({
    year: year || undefined,
    type: type || undefined,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const years = publications
    ? [...new Set(publications.map((p) => p.publicationYear).filter(Boolean))].sort().reverse()
    : [];
  const types = publications
    ? [...new Set(publications.map((p) => p.publicationType).filter(Boolean))]
    : [];

  const filtered = (publications || []).filter(
    (p) => !search || p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Publications</span>
          </p>
          <h1 className="font-heading text-[48px] lg:text-[80px] xl:text-[100px] font-bold text-foreground leading-[0.95]">
            Publications
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Research outputs and publications from TARC.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search publications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full border border-border bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="h-10 border border-border bg-white px-4 text-sm"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-10 border border-border bg-white px-4 text-sm"
            >
              <option value="">All Types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Publications List */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          {isLoading ? (
            <div className="space-y-0 divide-y divide-border border-t border-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-6">
                  <div className="h-4 w-20 rounded bg-muted mb-3" />
                  <div className="h-6 w-3/4 rounded bg-muted mb-2" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground py-12">No publications found.</p>
          ) : (
            <div>
              {filtered.map((pub) => (
                <div
                  key={pub.id}
                  className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 py-6 border-t border-border"
                >
                  <div className="sm:w-32 flex-shrink-0">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                      {pub.publicationYear}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[18px] lg:text-[22px] font-semibold text-foreground leading-snug">
                      {pub.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-3 text-[12px] text-muted-foreground">
                      {pub.authors && (
                        <span>
                          {Array.isArray(pub.authors)
                            ? pub.authors.slice(0, 3).join(', ')
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
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                        {pub.abstract}
                      </p>
                    )}
                  </div>
                  {pub.doiUrl && (
                    <a
                      href={`https://doi.org/${pub.doiUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:flex items-center gap-1 text-[12px] font-medium uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex-shrink-0 self-center"
                    >
                      DOI
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

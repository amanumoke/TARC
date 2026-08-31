import { usePublications } from '@/api/hooks/usePublications';
import { BookOpen, Search } from 'lucide-react';
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Publications</span>
      </nav>
      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">Publications</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Research outputs and publications from TARC.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search publications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="h-10 rounded-lg border bg-white px-4 text-sm"
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
          className="h-10 rounded-lg border bg-white px-4 text-sm"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <div className="mt-10 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border bg-card p-5">
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="mt-2 h-5 w-3/4 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {publications
            ?.filter((p) => !search || p.title?.toLowerCase().includes(search.toLowerCase()))
            .map((pub) => (
              <div
                key={pub.id}
                className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    {pub.publicationType || 'Publication'}
                  </span>
                  {pub.publicationYear && (
                    <span className="text-xs text-muted-foreground">{pub.publicationYear}</span>
                  )}
                </div>
                <h2 className="mt-2 font-heading text-lg font-semibold text-foreground">
                  {pub.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pub.authors?.join(', ') || 'Unknown authors'}
                </p>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {pub.abstract || 'No abstract available.'}
                </p>
                {pub.doiUrl && (
                  <a
                    href={pub.doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-primary hover:underline"
                  >
                    View Publication →
                  </a>
                )}
              </div>
            ))}
        </div>
      )}
      {!isLoading &&
        publications?.filter(
          (p) => !search || p.title?.toLowerCase().includes(search.toLowerCase())
        ).length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">No publications found.</p>
          </div>
        )}
    </div>
  );
}

import { PlaceholderImage } from '@/components/PlaceholderImage';
import { useNews } from '@/hooks/useNews';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function NewsListPage() {
  const { data: news, isLoading } = useNews();
  const [category, setCategory] = useState('');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = news ? [...new Set(news.map((n) => n.category).filter(Boolean))] : [];
  const filtered = news?.filter((n) => !category || n.category === category) || [];
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">News</span>
      </nav>
      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">News</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Latest announcements and updates from TARC.
      </p>
      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${!category ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCategory(c || '')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${category === c ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      {isLoading ? (
        <div className="mt-10 space-y-6">
          <div className="animate-pulse rounded-xl border bg-card p-6">
            <div className="aspect-video rounded-lg bg-muted" />
            <div className="mt-4 h-6 w-3/4 rounded bg-muted" />
          </div>
        </div>
      ) : (
        <>
          {featured && (
            <Link
              to={`/news/${featured.slug}`}
              className="mt-10 block rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <PlaceholderImage label="Featured News" className="rounded-lg" />
              <div className="mt-4">
                {featured.category && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {featured.category}
                  </span>
                )}
                <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">
                  {featured.title}
                </h2>
                <p className="mt-2 text-muted-foreground">{featured.summary || featured.excerpt}</p>
                <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(featured.publishedAt || featured.createdAt).toLocaleDateString(
                    'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </div>
              </div>
            </Link>
          )}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <Link
                key={article.id}
                to={`/news/${article.slug}`}
                className="group rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
              >
                <PlaceholderImage label="News Image" className="rounded-md" />
                <div className="mt-4">
                  {article.category && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {article.category}
                    </span>
                  )}
                  <h3 className="mt-2 font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {article.summary || article.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                      'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

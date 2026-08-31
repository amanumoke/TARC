import { useNews } from '@/api/hooks/useNews';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export function NewsListPage() {
  const { data: news, isLoading } = useNews();
  const [category, setCategory] = useState('');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = news ? [...new Set(news.map((n) => n.category).filter(Boolean))] : [];
  const filtered = news?.filter((n) => !category || n.category === category) || [];

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
            <span className="text-foreground">News</span>
          </p>
          <h1 className="font-heading text-[48px] lg:text-[80px] xl:text-[100px] font-bold text-foreground leading-[0.95]">
            News
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Latest announcements and updates from TARC.
          </p>
        </div>
      </section>

      {/* Filters */}
      {categories.length > 0 && (
        <section className="pb-12">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategory('')}
                className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-widest transition-colors ${
                  !category
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c || '')}
                  className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-widest transition-colors ${
                    category === c
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News List */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          {isLoading ? (
            <div className="space-y-0 divide-y divide-border border-t border-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="py-6">
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground py-12">No news articles available.</p>
          ) : (
            <div>
              {filtered.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 py-6 border-t border-border transition-colors hover:bg-muted/30 -mx-6 px-6 lg:-mx-16 lg:px-16"
                >
                  <div className="sm:w-32 flex-shrink-0">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      {formatDate(article.publishedAt || article.createdAt)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {article.category && (
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                          {article.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-[18px] lg:text-[22px] font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                        {article.summary}
                      </p>
                    )}
                  </div>
                  <div className="hidden sm:flex items-center self-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

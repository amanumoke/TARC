import { useNews } from '@/api/hooks/useNews';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function formatShortDate(dateStr: string): { day: string; month: string; year: string } {
  try {
    const d = new Date(dateStr);
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      year: d.getFullYear().toString(),
    };
  } catch {
    return { day: '--', month: '---', year: '----' };
  }
}

function categoryColor(cat: string): string {
  const c = cat?.toLowerCase();
  if (c?.includes('research')) return 'bg-emerald-700/90';
  if (c?.includes('event')) return 'bg-blue-700/90';
  if (c?.includes('achievement')) return 'bg-amber-700/90';
  if (c?.includes('partner')) return 'bg-purple-700/90';
  return 'bg-primary/90';
}

export function NewsListPage() {
  const { data: news, isLoading } = useNews();
  const [category, setCategory] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = news ? [...new Set(news.map((n) => n.category).filter(Boolean))] : [];
  const filtered = news?.filter((n) => !category || n.category === category) || [];

  // Split into featured (first) and the rest
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div>
      {/* ── Hero with background image ── */}
      <section className="relative overflow-hidden min-h-[300px] lg:min-h-[360px] flex items-end">
        <div className="absolute inset-0">
          <img
            src="/images/spices.jpg"
            alt="TARC news"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f14]/92 via-[#0a1f14]/72 to-[#0a1f14]/35" />
        </div>
        <div className="relative w-full max-w-[1440px] mx-auto px-6 lg:px-16 pb-12 pt-24 lg:pb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">News</span>
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            News & Updates
          </h1>
          <p className="mt-3 text-base text-white/65 max-w-xl leading-relaxed">
            Latest announcements, research highlights, and stories from Tepi Agricultural Research Center.
          </p>
        </div>
      </section>

      {/* ── Category filters ── */}
      <div className="border-b border-border bg-white sticky top-[65px] z-30">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="flex flex-wrap gap-0 -mb-px overflow-x-auto">
            <button
              type="button"
              onClick={() => setCategory('')}
              className={`px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest transition-colors whitespace-nowrap border-b-2 ${
                !category
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCategory(c || '')}
                className={`px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest transition-colors whitespace-nowrap border-b-2 ${
                  category === c
                    ? 'text-primary border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {c?.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="py-12 lg:py-16 pb-24 lg:pb-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">No news articles available.</p>
          ) : (
            <div className="space-y-10">

              {/* ── Featured article (first item) ── */}
              {featured && (
                <Link
                  to={`/news/${featured.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-0 overflow-hidden border border-border hover:border-primary/50 transition-colors"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-muted min-h-[260px] lg:min-h-[320px]">
                    {featured.coverImageUrl ? (
                      <img
                        src={featured.coverImageUrl}
                        alt={featured.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        loading="eager"
                      />
                    ) : (
                      <img
                        src="/images/red pepper.jpg"
                        alt="TARC news"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        loading="eager"
                      />
                    )}
                    {featured.category && (
                      <span className={`absolute top-4 left-4 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white ${categoryColor(featured.category)}`}>
                        {featured.category.replace(/_/g, ' ')}
                      </span>
                    )}
                    <span className="absolute top-4 right-4 bg-black/40 text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1">
                      Featured
                    </span>
                  </div>
                  {/* Text */}
                  <div className="flex flex-col justify-between p-8 lg:p-10 bg-white">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-4">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(featured.publishedAt || featured.createdAt)}</span>
                      </div>
                      <h2 className="font-heading text-[22px] lg:text-[26px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {featured.title}
                      </h2>
                      {featured.summary && (
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {featured.summary}
                        </p>
                      )}
                    </div>
                    <div className="mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-primary">
                      Read Article
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )}

              {/* ── Rest of articles — 3-col card grid ── */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((article) => {
                    const { day, month, year } = formatShortDate(article.publishedAt || article.createdAt);
                    return (
                      <Link
                        key={article.id}
                        to={`/news/${article.slug}`}
                        className="group flex flex-col overflow-hidden border border-border hover:border-primary/50 transition-colors bg-white"
                      >
                        {/* Image / date block */}
                        <div className="relative overflow-hidden bg-muted h-44 flex-shrink-0">
                          {article.coverImageUrl ? (
                            <img
                              src={article.coverImageUrl}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#0f2519] flex flex-col items-center justify-center">
                              <span className="text-[42px] font-bold text-white/20 leading-none">{day}</span>
                              <span className="text-[13px] font-semibold text-white/40 uppercase tracking-widest">{month}</span>
                              <span className="text-[11px] text-white/25 tracking-widest mt-1">{year}</span>
                            </div>
                          )}
                          {article.category && (
                            <span className={`absolute top-3 left-3 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white ${categoryColor(article.category)}`}>
                              {article.category.replace(/_/g, ' ')}
                            </span>
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex flex-col flex-1 p-5">
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-2">
                            <Calendar className="h-2.5 w-2.5" />
                            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                          </div>
                          <h3 className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 flex-1">
                            {article.title}
                          </h3>
                          {article.summary && (
                            <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {article.summary}
                            </p>
                          )}
                          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary">
                            Read more
                            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { useNews } from '@/api/hooks/useNews';
import { useNewsBySlug } from '@/api/hooks/useNewsBySlug';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useNewsBySlug(slug || '');
  const { data: allNews } = useNews({ limit: 5 });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const relatedNews = allNews?.filter((n) => n.slug !== slug).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/4 rounded bg-muted" />
          <div className="h-12 w-3/4 rounded bg-muted" />
          <div className="aspect-video rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-20 text-center">
        <p className="text-muted-foreground">Article not found.</p>
        <Link
          to="/news"
          className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to News
        </Link>
      </div>
    );
  }

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
            <Link to="/news" className="hover:text-foreground transition-colors">
              News
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground line-clamp-1">{article.title}</span>
          </p>
          {article.category && (
            <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-primary mb-4">
              {article.category}
            </span>
          )}
          <h1 className="font-heading text-[36px] lg:text-[64px] xl:text-[80px] font-bold text-foreground leading-[0.95]">
            {article.title}
          </h1>
          <div className="mt-6 flex items-center gap-6 text-[13px] text-muted-foreground">
            <span>
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-20">
            <article>
              <PlaceholderImage label="Article Image" className="w-full rounded-none" />
              <div className="mt-10 prose prose-lg max-w-none text-muted-foreground leading-relaxed [&_p]:mb-6">
                {article.content ? (
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                  <p>{article.summary || 'No content available.'}</p>
                )}
              </div>
            </article>

            <aside>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
                Related News
              </p>
              <div className="space-y-0 divide-y divide-border border-t border-border">
                {relatedNews.map((n) => (
                  <Link key={n.id} to={`/news/${n.slug}`} className="group block py-5">
                    <h4 className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {n.title}
                    </h4>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {new Date(n.publishedAt || n.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </Link>
                ))}
              </div>
              <Link
                to="/news"
                className="mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> All News
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

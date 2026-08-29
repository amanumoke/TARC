import { PlaceholderImage } from '@/components/PlaceholderImage';
import { useNews } from '@/hooks/useNews';
import { useNewsBySlug } from '@/hooks/useNewsBySlug';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
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

  const articleHtml = article?.content || '';

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/4 rounded bg-muted" />
          <div className="h-8 w-3/4 rounded bg-muted" />
          <div className="aspect-video rounded-xl bg-muted" />
        </div>
      </div>
    );
  }
  if (!article) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <p className="text-muted-foreground">Article not found.</p>
        <Link
          to="/news"
          className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/news" className="hover:text-primary">
          News
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground line-clamp-1">{article.title}</span>
      </nav>
      <div className="mt-8 grid gap-12 lg:grid-cols-3">
        <article className="lg:col-span-2">
          {article.category && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {article.category}
            </span>
          )}
          <h1 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <button type="button" className="flex items-center gap-1.5 hover:text-primary">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
          <PlaceholderImage label="Article Image" className="mt-6 rounded-xl" />
          <div className="prose prose-gray mt-8 max-w-none">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: articleHtml }} />
            ) : (
              <p>{article.summary || 'No content available.'}</p>
            )}
          </div>
        </article>
        <aside>
          <h3 className="font-heading text-lg font-semibold text-foreground">Related News</h3>
          <div className="mt-4 space-y-4">
            {relatedNews.map((n) => (
              <Link
                key={n.id}
                to={`/news/${n.slug}`}
                className="block rounded-lg border p-3 transition-shadow hover:shadow-sm"
              >
                <h4 className="font-heading text-sm font-semibold text-foreground line-clamp-2">
                  {n.title}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
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
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> All News
          </Link>
        </aside>
      </div>
    </div>
  );
}

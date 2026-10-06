import { useEvents } from '@/api/hooks/useEvents';
import { useNews } from '@/api/hooks/useNews';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  } catch { return ''; }
}

function formatShort(dateStr: string): { day: string; month: string } {
  try {
    const d = new Date(dateStr);
    return { day: String(d.getDate()), month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase() };
  } catch { return { day: '--', month: '---' }; }
}

function formatTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch { return ''; }
}

// Cycle through available images for news items that have no cover image
const NEWS_FALLBACKS = ['/images/field-3.jpg', '/images/planting.jpg', '/images/red-coffee.jpg', '/images/cacao-research.jpg'];

export function NewsEventsBento() {
  const { data: newsItems, isLoading: newsLoading } = useNews({ limit: 5 });
  const { data: events, isLoading: eventsLoading } = useEvents({ limit: 4, upcoming: true });

  const news = newsItems || [];
  const eventItems = events || [];

  const [featuredNews, ...restNews] = news;

  return (
    <section className="py-16 lg:py-20 bg-[#F5F5F0]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">

        {/* ── Section label ── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Stay Informed
            </p>
            <h2 className="font-heading text-[26px] lg:text-[34px] font-bold text-foreground leading-tight">
              News & Events
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-5">
            <Link to="/news" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors">
              All News <ArrowRight className="h-3 w-3" />
            </Link>
            <Link to="/events" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              All Events <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ── Featured news (large, image card) ── */}
          <div className="lg:col-span-5">
            {newsLoading ? (
              <Skeleton className="h-[360px] w-full" />
            ) : featuredNews ? (
              <Link
                to={`/news/${featuredNews.slug}`}
                className="group relative flex flex-col overflow-hidden h-full min-h-[320px] lg:min-h-[400px] bg-[#0a1f14]"
              >
                <div className="absolute inset-0">
                  <img
                    src={featuredNews.coverImageUrl || NEWS_FALLBACKS[0]}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                <div className="relative flex flex-col justify-end h-full p-6 lg:p-8">
                  {featuredNews.category && (
                    <span className="inline-block bg-primary text-white text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 mb-3 self-start">
                      {featuredNews.category.replace(/_/g, ' ')}
                    </span>
                  )}
                  <h3 className="font-heading text-[18px] lg:text-[22px] font-bold text-white leading-snug group-hover:text-[#9ed8b2] transition-colors">
                    {featuredNews.title}
                  </h3>
                  {featuredNews.summary && (
                    <p className="mt-2 text-sm text-white/60 line-clamp-2 leading-relaxed">{featuredNews.summary}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[10px] text-white/50">
                      <Calendar className="h-3 w-3" />
                      {formatDate(featuredNews.publishedAt || featuredNews.createdAt)}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-primary">
                      Read <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ) : null}
          </div>

          {/* ── News list ── */}
          <div className="lg:col-span-4 flex flex-col">
            {newsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : restNews.length === 0 ? (
              <div className="flex-1 flex items-center justify-center bg-white p-6">
                <p className="text-sm text-muted-foreground">No more news.</p>
              </div>
            ) : (
              <div className="flex flex-col h-full divide-y divide-border border border-border bg-white">
                {restNews.map((item, i) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.slug}`}
                    className="group flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors flex-1"
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-14 h-14 overflow-hidden bg-muted">
                      <img
                        src={item.coverImageUrl || NEWS_FALLBACKS[i % NEWS_FALLBACKS.length]}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.category && (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary block mb-0.5">
                          {item.category.replace(/_/g, ' ')}
                        </span>
                      )}
                      <h4 className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDate(item.publishedAt || item.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── Events column ── */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="bg-[#0f2519] text-white flex flex-col h-full">
              <div className="px-5 pt-5 pb-3 border-b border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/40">Upcoming</p>
                  <h3 className="font-heading text-[18px] font-bold">Events</h3>
                </div>
                <Link to="/events" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                  All →
                </Link>
              </div>

              {eventsLoading ? (
                <div className="p-5 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-10 w-10 bg-white/10 flex-shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-3 w-3/4 bg-white/10" />
                        <Skeleton className="h-2.5 w-1/2 bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : eventItems.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6">
                  <p className="text-white/40 text-sm text-center">No upcoming events.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-white/8 flex-1">
                  {eventItems.map((event) => {
                    const { day, month } = formatShort(event.startTime || '');
                    return (
                      <div key={event.id} className="flex items-start gap-3 px-5 py-4 hover:bg-white/5 transition-colors">
                        {/* Date block */}
                        <div className="flex-shrink-0 w-10 h-10 bg-primary flex flex-col items-center justify-center">
                          <span className="text-[14px] font-bold text-white leading-none">{day}</span>
                          <span className="text-[7px] font-bold uppercase tracking-wider text-white/70">{month}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[12px] font-semibold leading-snug text-white line-clamp-2">{event.title}</h4>
                          <div className="flex flex-wrap gap-2 mt-1 text-[10px] text-white/40">
                            {event.startTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />{formatTime(event.startTime)}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5" />{event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

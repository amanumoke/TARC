import { useEvents } from '@/api/hooks/useEvents';
import { useNews } from '@/api/hooks/useNews';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
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

function formatEventDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function formatTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function NewsEventsBento() {
  const { data: newsItems, isLoading: newsLoading } = useNews({ limit: 4 });
  const { data: events, isLoading: eventsLoading } = useEvents({ limit: 4, upcoming: true });

  const news = newsItems || [];
  const eventItems = events || [];

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4">
          {/* News — 7 cols */}
          <div className="lg:col-span-7 bg-white p-6 lg:p-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Latest Updates
                </p>
                <h2 className="font-heading text-[28px] lg:text-[36px] font-bold text-foreground leading-[1.1]">
                  News
                </h2>
              </div>
              <Link
                to="/news"
                className="hidden sm:flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
              >
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {newsLoading ? (
              <div className="space-y-0 divide-y divide-border border-t border-border">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="py-4">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                ))}
              </div>
            ) : news.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8">No news yet.</p>
            ) : (
              <div className="divide-y divide-border border-t border-border">
                {news.map((item) => (
                  <Link key={item.id} to={`/news/${item.slug}`} className="group flex gap-5 py-4">
                    <div className="flex-shrink-0 w-20">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        {formatDate(item.publishedAt || item.createdAt)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.category && (
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-primary block mb-1">
                          {item.category}
                        </span>
                      )}
                      <h3 className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Events — 5 cols */}
          <div className="lg:col-span-5 bg-[#101712] text-white p-6 lg:p-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-3">
                  Upcoming
                </p>
                <h2 className="font-heading text-[28px] lg:text-[36px] font-bold leading-[1.1]">
                  Events
                </h2>
              </div>
              <Link
                to="/events"
                className="hidden sm:flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
              >
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {eventsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 w-12 bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4 bg-white/10" />
                      <Skeleton className="h-3 w-1/2 bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : eventItems.length === 0 ? (
              <p className="text-white/50 text-sm py-8">No upcoming events.</p>
            ) : (
              <div className="space-y-0 divide-y divide-white/10 border-t border-white/10">
                {eventItems.map((event) => (
                  <div key={event.id} className="flex gap-4 py-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/10 flex flex-col items-center justify-center">
                      <span className="text-sm font-bold leading-none">
                        {formatEventDate(event.startTime || '').split(' ')[1]}
                      </span>
                      <span className="text-[8px] font-semibold uppercase tracking-wider opacity-60">
                        {formatEventDate(event.startTime || '').split(' ')[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-semibold leading-snug">{event.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-white/40">
                        {event.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {formatTime(event.startTime)}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

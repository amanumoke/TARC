import { useEvents } from '@/api/hooks/useEvents';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type TimeFilter = 'all' | 'upcoming' | 'past';

export function PublicEventsPage() {
  const { t } = useTranslation();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const { data: events, isLoading } = useEvents({
    upcoming: timeFilter === 'upcoming' ? true : undefined,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered =
    events?.filter((e) => {
      if (timeFilter === 'past') return new Date(e.startTime || '') < new Date();
      return true;
    }) || [];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[280px] lg:min-h-[340px] flex items-end">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/planting.jpg"
            alt="TARC field activities"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f14]/90 via-[#0a1f14]/65 to-[#0a1f14]/30" />
        </div>
        {/* Content */}
        <div className="relative w-full max-w-[1440px] mx-auto px-6 lg:px-16 pb-12 pt-20 lg:pb-16 lg:pt-28">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 mb-3">
            <Link to="/" className="hover:text-white transition-colors">
              {t('common.home')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{t('events.breadcrumb')}</span>
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            {t('events.title')}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
            {t('events.description')}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="flex gap-2">
            {(['all', 'upcoming', 'past'] as TimeFilter[]).map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-widest transition-colors ${
                  timeFilter === f
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(`events.${f}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          {isLoading ? (
            <div className="space-y-0 divide-y divide-border border-t border-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-6 py-6">
                  <Skeleton className="h-14 w-14 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground py-12">{t('events.noEventsFound')}</p>
          ) : (
            <div className="space-y-0 divide-y divide-border border-t border-border">
              {filtered.map((event) => {
                const date = new Date(event.startTime || '');
                return (
                  <div key={event.id} className="flex gap-6 py-6 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-primary text-white flex flex-col items-center justify-center">
                      <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                      <span className="text-[9px] font-semibold uppercase tracking-wider opacity-80">
                        {date.toLocaleString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[17px] font-semibold text-foreground group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                        {event.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {date.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {event.location}
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 max-w-2xl">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

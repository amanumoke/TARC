import { useEvents } from '@/api/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function formatDateParts(dateStr: string): { day: string; month: string } {
  try {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString('en-US', { day: 'numeric' }),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  } catch {
    return { day: '--', month: '---' };
  }
}

function formatTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function EventCardSkeleton() {
  return (
    <div className="flex gap-4 py-4">
      <Skeleton className="h-16 w-16 rounded flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function UpcomingEventsSection() {
  const { data: events, isLoading } = useEvents({ limit: 5, upcoming: true });

  const items = events || [];

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-muted-foreground tracking-[0.2em] uppercase mb-2">
              ── Mark Your Calendar
            </p>
            <h2 className="text-3xl md:text-4xl text-foreground font-heading">Upcoming Events</h2>
          </div>
          <Button
            variant="outline"
            className="text-xs font-semibold tracking-wide uppercase"
            render={<Link to="/events" />}
          >
            View All Events
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="divide-y divide-border border-t border-border">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No upcoming events at this time.
            </div>
          ) : (
            items.map((event) => {
              const { day, month } = formatDateParts(event.startTime || '');
              return (
                <div key={event.id} className="flex gap-5 py-5 group">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary text-primary-foreground flex flex-col items-center justify-center rounded">
                    <span className="text-xl font-bold leading-none">{day}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider">
                      {month}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                      {event.startTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(event.startTime)}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateParts(event.startTime || '').month}{' '}
                        {formatDateParts(event.startTime || '').day}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

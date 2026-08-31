import { useEvents } from '@/api/hooks/useEvents';
import { Clock, Filter, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type TimeFilter = 'all' | 'upcoming' | 'past';

export function PublicEventsPage() {
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
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Events</span>
      </nav>
      <h1 className="mt-6 font-heading text-4xl font-bold text-foreground">Events</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Workshops, conferences, and activities at TARC.
      </p>
      <div className="mt-8 flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {(['all', 'upcoming', 'past'] as TimeFilter[]).map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${timeFilter === f ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {f}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="mt-10 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-4 rounded-lg border bg-card p-4">
              <div className="h-16 w-16 rounded bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {filtered.map((event) => {
            const date = new Date(event.startTime || '');
            return (
              <div
                key={event.id}
                className="flex gap-4 rounded-lg border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-white">
                  <span className="text-xl font-bold leading-none">{date.getDate()}</span>
                  <span className="text-xs uppercase">
                    {date.toLocaleString('en-US', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {event.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {event.location}
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!isLoading && filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">No events found.</p>
        </div>
      )}
    </div>
  );
}

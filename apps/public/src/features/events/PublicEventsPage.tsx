/**
 * @file apps/public/src/features/events/PublicEventsPage.tsx
 * @description Public events page displaying upcoming and past events.
 * Shows events with chronological filtering.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  startTime: string;
  location: string;
}

async function fetchUpcomingEvents(): Promise<Event[]> {
  const response = await fetch('/api/v1/communication/events/upcoming');
  const data = await response.json();
  return data.data;
}

async function fetchPastEvents(): Promise<Event[]> {
  const response = await fetch('/api/v1/communication/events/past');
  const data = await response.json();
  return data.data;
}

function EventCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  );
}

export function PublicEventsPage() {
  const { data: upcomingEvents, isLoading: upcomingLoading } = useQuery({
    queryKey: ['public-upcoming-events'],
    queryFn: fetchUpcomingEvents,
  });

  const { data: pastEvents, isLoading: pastLoading } = useQuery({
    queryKey: ['public-past-events'],
    queryFn: fetchPastEvents,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="text-muted-foreground">
          Workshops, field days, and training sessions at TARC
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {upcomingLoading
            ? Array.from({ length: 2 }).map(() => <EventCardSkeleton key={crypto.randomUUID()} />)
            : upcomingEvents?.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {event.eventType} - {new Date(event.startTime).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{event.description}</p>
                    <p className="text-sm text-muted-foreground mt-2">Location: {event.location}</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {pastLoading
            ? Array.from({ length: 2 }).map(() => <EventCardSkeleton key={crypto.randomUUID()} />)
            : pastEvents?.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {event.eventType} - {new Date(event.startTime).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{event.description}</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </section>
    </div>
  );
}

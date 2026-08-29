import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvents } from '@/hooks/useEvents';
import { useNews } from '@/hooks/useNews';
import { usePublications } from '@/hooks/usePublications';
import { useStaff } from '@/hooks/useStaff';
import { BookOpen, Calendar, FileSearch, Newspaper, Search, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  link: string;
  category: string;
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const { data: news, isLoading: newsLoading } = useNews();
  const { data: publications, isLoading: pubsLoading } = usePublications();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: staff, isLoading: staffLoading } = useStaff();

  const isLoading = newsLoading || pubsLoading || eventsLoading || staffLoading;

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== query) {
      setQuery(q);
    }
  }, [searchParams]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const items: SearchResult[] = [];

    const newsList = Array.isArray(news) ? news : [];
    newsList.forEach((item) => {
      const title = String(item.title || item.name || '');
      const desc = String(item.summary || item.excerpt || item.content || '');
      if (title.toLowerCase().includes(q) || desc.toLowerCase().includes(q)) {
        items.push({
          id: String(item.id),
          title,
          description: desc.substring(0, 120),
          link: '/news',
          category: 'News',
        });
      }
    });

    const pubList = Array.isArray(publications) ? publications : [];
    pubList.forEach((item) => {
      const title = String(item.title || '');
      const desc = String(item.abstract || item.description || item.title || '');
      if (title.toLowerCase().includes(q) || desc.toLowerCase().includes(q)) {
        items.push({
          id: String(item.id),
          title,
          description: desc.substring(0, 120),
          link: '/publications',
          category: 'Publications',
        });
      }
    });

    const eventList = Array.isArray(events) ? events : [];
    eventList.forEach((item) => {
      const title = String(item.title || item.name || '');
      const desc = String(item.description || item.summary || '');
      if (title.toLowerCase().includes(q) || desc.toLowerCase().includes(q)) {
        items.push({
          id: String(item.id),
          title,
          description: desc.substring(0, 120),
          link: '/events',
          category: 'Events',
        });
      }
    });

    const staffList = Array.isArray(staff) ? staff : [];
    staffList.forEach((item) => {
      const name = String(item.name || '');
      const pos = String(item.position || '');
      const bio = String(item.bio || '');
      if (
        name.toLowerCase().includes(q) ||
        pos.toLowerCase().includes(q) ||
        bio.toLowerCase().includes(q)
      ) {
        items.push({
          id: String(item.id),
          title: name,
          description: pos || bio.substring(0, 120),
          link: '/about/people',
          category: 'Staff',
        });
      }
    });

    return items;
  }, [query, news, publications, events, staff]);

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [results]);

  const categoryIcons: Record<string, React.ReactNode> = {
    News: <Newspaper className="h-5 w-5" />,
    Publications: <BookOpen className="h-5 w-5" />,
    Events: <Calendar className="h-5 w-5" />,
    Staff: <Users className="h-5 w-5" />,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground mt-2">
          Search across news, publications, events, and staff.
        </p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          autoFocus
          placeholder="Search for anything..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-12 h-12 text-lg"
        />
      </div>

      {isLoading && query.trim() ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : !query.trim() ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileSearch className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Enter a search term to find results across the site.
            </p>
          </CardContent>
        </Card>
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileSearch className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No results found for "{query}".</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different search term.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </p>
          <div className="space-y-6">
            {Object.entries(groupedResults).map(([category, items]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {categoryIcons[category]}
                    {category}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({items.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium">{item.title}</p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

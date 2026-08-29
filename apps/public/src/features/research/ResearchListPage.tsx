import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDepartments } from '@/hooks/useDepartments';
import { ArrowRight, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function CardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-6 bg-card space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-8 w-28 mt-4" />
    </div>
  );
}

export function ResearchListPage() {
  const { data: departments, isLoading } = useDepartments();
  const [search, setSearch] = useState('');

  const filtered = (departments || []).filter(
    (dept) =>
      dept.name?.toLowerCase().includes(search.toLowerCase()) ||
      dept.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-12 px-6">
      <div className="max-w-[1440px] mx-auto">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Research Programs</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl text-foreground font-heading mb-3">
            Research Programs
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Strategic research initiatives at the Tepi Agricultural Research Center, driving
            innovation in agriculture and food security.
          </p>
        </div>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search research programs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <p className="text-muted-foreground">
                {search ? 'No programs match your search.' : 'No research programs available.'}
              </p>
            </div>
          ) : (
            filtered.map((dept) => (
              <Link
                key={dept.id}
                to={`/research/${dept.slug || dept.id}`}
                className="group border border-border rounded-lg p-6 bg-card hover:shadow-md transition-all hover:border-primary/30"
              >
                <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {dept.name}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {dept.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wide">
                  Learn More
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

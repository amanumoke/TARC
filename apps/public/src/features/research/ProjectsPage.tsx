import { useDepartments } from '@/api/hooks/useDepartments';
import { useProjects } from '@/api/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'ONGOING', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PROPOSED', label: 'Proposed' },
  { value: 'ON_HOLD', label: 'On Hold' },
];

function CardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-5 bg-card space-y-3">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-32 mt-2" />
    </div>
  );
}

export function ProjectsPage() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: departments } = useDepartments();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const deptMap = useMemo(() => {
    const map: Record<string, string> = {};
    (departments || []).forEach((d) => {
      map[d.id] = d.name;
    });
    return map;
  }, [departments]);

  const filtered = (projects || []).filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.summary?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-12 px-6">
      <div className="max-w-[1440px] mx-auto">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Projects</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl text-foreground font-heading mb-3">
            Research Projects
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse all research projects across departments at the Tepi Agricultural Research
            Center.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsLoading ? (
            Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <p className="text-muted-foreground">
                {search || statusFilter
                  ? 'No projects match your filters.'
                  : 'No projects available.'}
              </p>
            </div>
          ) : (
            filtered.map((project) => (
              <div
                key={project.id}
                className="border border-border rounded-lg p-5 bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  {project.status && (
                    <span
                      className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 border rounded ${
                        project.status === 'ONGOING'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : project.status === 'COMPLETED'
                            ? 'bg-secondary/10 text-secondary border-secondary/20'
                            : 'bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      {project.status}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.summary}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-3 border-t border-border">
                  {project.departmentId && deptMap[project.departmentId] && (
                    <span>{deptMap[project.departmentId]}</span>
                  )}
                  {(project.startDate || project.endDate) && (
                    <span>
                      {project.startDate && new Date(project.startDate).getFullYear()}
                      {project.startDate && project.endDate && ' – '}
                      {project.endDate && new Date(project.endDate).getFullYear()}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

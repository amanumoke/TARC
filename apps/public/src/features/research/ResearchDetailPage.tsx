import { useDepartments } from '@/api/hooks/useDepartments';
import { useProjects } from '@/api/hooks/useProjects';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

function DetailSkeleton() {
  return (
    <div className="py-12 px-6">
      <div className="max-w-[1440px] mx-auto">
        <Skeleton className="h-3 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="aspect-video rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ResearchDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: departments, isLoading: deptsLoading } = useDepartments();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const department = (departments || []).find((d) => (d.code || d.id) === slug);

  const relatedProjects = (projects || []).filter((p) => p.departmentId === department?.id);

  if (deptsLoading) return <DetailSkeleton />;

  if (!department) {
    return (
      <div className="py-12 px-6">
        <div className="max-w-[1440px] mx-auto text-center py-20">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Program Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The research program you're looking for doesn't exist.
          </p>
          <Link
            to="/research"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Research Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-6">
      <div className="max-w-[1440px] mx-auto">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/research" className="hover:text-primary transition-colors">
            Research
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{department.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl md:text-4xl text-foreground font-heading">{department.name}</h1>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p className="text-base leading-relaxed">{department.description}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <PlaceholderImage
              label={department.name}
              aspectRatio="video"
              className="w-full sticky top-24"
            />
          </div>
        </div>

        {relatedProjects.length > 0 && (
          <div className="border-t border-border pt-10">
            <h2 className="text-xl font-semibold text-foreground mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectsLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-lg" />
                  ))
                : relatedProjects.map((project) => (
                    <div key={project.id} className="border border-border rounded-lg p-4 bg-card">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-foreground text-sm">{project.title}</h3>
                        {project.status && (
                          <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase border border-border rounded px-2 py-0.5 flex-shrink-0">
                            {project.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {project.summary}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-border">
          <Link
            to="/research"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Research Programs
          </Link>
        </div>
      </div>
    </div>
  );
}

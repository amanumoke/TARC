import { useDepartments } from '@/api/hooks/useDepartments';
import { useProjects } from '@/api/hooks/useProjects';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export function ResearchDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: departments, isLoading: deptsLoading } = useDepartments();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const department = (departments || []).find((d) => (d.code || d.id) === slug);
  const relatedProjects = (projects || []).filter((p) => p.departmentId === department?.id);

  if (deptsLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-20">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!department) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-20 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Program Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The research program you're looking for doesn't exist.
        </p>
        <Link
          to="/research"
          className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Research Programs
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/research" className="hover:text-foreground transition-colors">
              Research
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{department.name}</span>
          </p>
          <h1 className="font-heading text-[48px] lg:text-[80px] xl:text-[100px] font-bold text-foreground leading-[0.95]">
            {department.name}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20">
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {department.description}
              </p>

              {relatedProjects.length > 0 && (
                <div className="mt-16 pt-12 border-t border-border">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    Related Projects
                  </p>
                  <h2 className="font-heading text-[32px] lg:text-[48px] font-bold text-foreground leading-[1.05] mb-12">
                    Our Work
                  </h2>

                  {projectsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-border border-t border-border">
                      {relatedProjects.map((project) => (
                        <div key={project.id} className="py-6">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-[17px] font-semibold text-foreground leading-snug">
                              {project.title}
                            </h3>
                            {project.status && (
                              <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase flex-shrink-0">
                                {project.status}
                              </span>
                            )}
                          </div>
                          {project.summary && (
                            <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                              {project.summary}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-border">
                <Link
                  to="/research"
                  className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to Research Programs
                </Link>
              </div>
            </div>

            <div>
              <PlaceholderImage
                label={department.name}
                aspectRatio="video"
                className="w-full sticky top-24"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

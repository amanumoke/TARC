import { useDepartments } from '@/api/hooks/useDepartments';
import { useProjects } from '@/api/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

// Same rotation used in ResearchPrograms so the image is consistent
const FALLBACK_IMAGES = [
  '/images/red-coffee.jpg',
  '/images/cacao-research.jpg',
  '/images/spices.jpg',
  '/images/plant seeds.jpg',
  '/images/labrat.jpg',
  '/images/livestocks.jpg',
  '/images/seed.jpg',
  '/images/papaye.jpg',
  '/images/red pepper.jpg',
  '/images/agriculture area.jpg',
];

function getDeptImage(
  imageUrl: string | null | undefined,
  name: string,
  index: number,
): string {
  if (imageUrl) return imageUrl;
  const n = name.toLowerCase();
  if (n.includes('coffee')) return '/images/red-coffee.jpg';
  if (n.includes('cacao') || n.includes('cocoa')) return '/images/cacao-research.jpg';
  if (n.includes('lab') || n.includes('bio')) return '/images/labrat.jpg';
  if (n.includes('livestock') || n.includes('animal')) return '/images/livestocks.jpg';
  if (n.includes('soil') || n.includes('water')) return '/images/seed.jpg';
  if (n.includes('crop') || n.includes('plant')) return '/images/plant seeds.jpg';
  if (n.includes('spice') || n.includes('pepper')) return '/images/spices.jpg';
  if (n.includes('food') || n.includes('nutrition')) return '/images/red pepper.jpg';
  if (n.includes('extension') || n.includes('transfer')) return '/images/agriculture area.jpg';
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

export function ResearchDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: departments, isLoading: deptsLoading } = useDepartments();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const deptIndex = (departments || []).findIndex((d) => (d.code || d.id) === slug);
  const department = deptIndex >= 0 ? departments![deptIndex] : undefined;
  const relatedProjects = (projects || []).filter((p) => p.departmentId === department?.id);

  if (deptsLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-20 space-y-8">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-full max-w-xl" />
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

  const heroImg = getDeptImage(department.imageUrl, department.name, deptIndex);

  return (
    <div>
      {/* Full-bleed hero with the department's own image */}
      <section className="relative overflow-hidden min-h-[340px] lg:min-h-[420px] flex items-end">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt={department.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f14]/92 via-[#0a1f14]/70 to-[#0a1f14]/30" />
        </div>

        <div className="relative w-full max-w-[1440px] mx-auto px-6 lg:px-16 pb-12 pt-24 lg:pb-16">
          {/* Breadcrumb */}
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/research" className="hover:text-white transition-colors">Research</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{department.name}</span>
          </p>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight max-w-3xl">
            {department.name}
          </h1>
          {department.description && (
            <p className="mt-4 text-base text-white/70 max-w-2xl leading-relaxed line-clamp-2">
              {department.description}
            </p>
          )}
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-20">

            {/* Left column */}
            <div>
              {department.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {department.description}
                </p>
              )}

              {/* Related projects */}
              {(projectsLoading || relatedProjects.length > 0) && (
                <div className="mt-16 pt-12 border-t border-border">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    Active Research
                  </p>
                  <h2 className="font-heading text-[28px] lg:text-[36px] font-bold text-foreground leading-tight mb-10">
                    Our Work in{' '}
                    <span className="text-primary">{department.name}</span>
                  </h2>

                  {projectsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-border border-t border-border">
                      {relatedProjects.map((project) => (
                        <div key={project.id} className="py-6 group">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-[17px] font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                              {project.title}
                            </h3>
                            {project.status && (
                              <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase flex-shrink-0 mt-1">
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

              <div className="mt-12 pt-8 border-t border-border flex items-center gap-6">
                <Link
                  to="/research"
                  className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" />
                  All Programs
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Collaborate with us
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Right column — sticky department image + metadata */}
            <div className="space-y-6">
              <div className="sticky top-24 space-y-6">
                <div className="overflow-hidden aspect-[4/3]">
                  <img
                    src={heroImg}
                    alt={department.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Department metadata card */}
                <div className="bg-muted/40 p-6 space-y-4">
                  {department.headName && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
                        Department Head
                      </p>
                      <p className="text-sm font-semibold text-foreground">{department.headName}</p>
                    </div>
                  )}
                  {department.establishedYear && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
                        Established
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {department.establishedYear}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
                      Active Projects
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {projectsLoading ? '—' : relatedProjects.length}
                    </p>
                  </div>
                  <Link
                    to="/contact"
                    className="mt-2 flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 text-[11px] font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors w-full"
                  >
                    Get Involved <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

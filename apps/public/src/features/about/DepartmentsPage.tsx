import { useDepartments } from '@/api/hooks/useDepartments';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();

  const deptList = Array.isArray(departments) ? departments : [];

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-20 space-y-16">
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
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
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Departments</span>
          </p>
          <h1 className="font-heading text-[48px] lg:text-[80px] xl:text-[100px] font-bold text-foreground leading-[0.95]">
            Our Departments
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Explore the research divisions and teams driving innovation at TARC.
          </p>
        </div>
      </section>

      {/* Departments List */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          {deptList.length === 0 ? (
            <p className="text-muted-foreground py-12">No departments available at this time.</p>
          ) : (
            <div className="divide-y divide-border border-t border-border">
              {deptList.map((dept) => (
                <div
                  key={dept.id}
                  className="group flex flex-col sm:flex-row sm:items-start gap-6 py-8"
                >
                  <div className="sm:w-48 flex-shrink-0">
                    {dept.establishedYear && (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        Est. {dept.establishedYear}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[22px] font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                      {dept.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      {dept.description || 'No description available.'}
                    </p>
                    <Link
                      to={`/research/${dept.code}`}
                      className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                    >
                      View Research
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

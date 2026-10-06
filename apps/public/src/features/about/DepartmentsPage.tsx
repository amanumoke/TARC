import { useDepartments } from '@/api/hooks/useDepartments';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const DEPT_IMAGES = [
  '/images/red-coffee.jpg',    // 0 — coffee
  '/images/cacao-research.jpg',// 1 — cacao
  '/images/spices.jpg',        // 2 — spices/general crop
  '/images/plant seeds.jpg',   // 3 — planting/seeds
  '/images/labrat.jpg',        // 4 — lab/biotech
  '/images/livestocks.jpg',    // 5 — livestock
  '/images/seed.jpg',          // 6 — seeds/field
  '/images/papaye.jpg',        // 7 — horticulture
  '/images/red pepper.jpg',    // 8 — spice crop
  '/images/agriculture area.jpg', // 9 — general agri
];

function getDeptImage(imageUrl: string | null | undefined, index: number): string {
  if (imageUrl) return imageUrl;
  const n = index % DEPT_IMAGES.length;
  return DEPT_IMAGES[n];
}

export function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();
  const deptList = Array.isArray(departments) ? departments : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-20 space-y-6">
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[280px] lg:min-h-[340px] flex items-end">
        <div className="absolute inset-0">
          <img
            src="/images/agriculture area.jpg"
            alt="TARC departments"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f14]/92 via-[#0a1f14]/70 to-[#0a1f14]/30" />
        </div>
        <div className="relative w-full max-w-[1440px] mx-auto px-6 lg:px-16 pb-12 pt-24 lg:pb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">Departments</span>
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Our Departments
          </h1>
          <p className="mt-3 text-base text-white/65 max-w-xl leading-relaxed">
            Research divisions and specialist teams advancing agricultural science at TARC.
          </p>
        </div>
      </section>

      {/* ── Department card grid ── */}
      <section className="py-16 lg:py-24 pb-24 lg:pb-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          {deptList.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">No departments available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deptList.map((dept, index) => (
                <Link
                  key={dept.id}
                  to={`/research/${dept.code}`}
                  className="group flex flex-col overflow-hidden border border-border hover:border-primary/50 transition-colors bg-white"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-44 flex-shrink-0 bg-muted">
                    <img
                      src={getDeptImage(dept.imageUrl, index)}
                      alt={dept.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {dept.establishedYear && (
                      <span className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5">
                        Est. {dept.establishedYear}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-heading text-[17px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {dept.name}
                    </h3>
                    {dept.headName && (
                      <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                        {dept.headName}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                      {dept.description || 'Research and innovation for agricultural development.'}
                    </p>
                    <div className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary">
                      View Research
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

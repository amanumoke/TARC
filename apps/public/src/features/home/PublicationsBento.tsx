import { usePublications } from '@/api/hooks/usePublications';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, BookOpen, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const TYPE_COLORS: Record<string, string> = {
  JOURNAL_ARTICLE: 'bg-emerald-100 text-emerald-800',
  CONFERENCE_PAPER: 'bg-blue-100 text-blue-800',
  BOOK: 'bg-amber-100 text-amber-800',
  BOOK_CHAPTER: 'bg-amber-100 text-amber-800',
  TECHNICAL_REPORT: 'bg-slate-100 text-slate-700',
  THESIS: 'bg-purple-100 text-purple-800',
  OTHER: 'bg-muted text-muted-foreground',
};

export function PublicationsBento() {
  const { data: publications, isLoading } = usePublications();
  const items = (publications || []).slice(0, 4);

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Our Contributions
            </p>
            <h2 className="font-heading text-[26px] lg:text-[34px] font-bold text-foreground leading-tight">
              Latest Publications
            </h2>
          </div>
          <Link
            to="/publications"
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#F5F5F0] p-6 space-y-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Rich empty state instead of just text */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: FileText, label: 'Journal Articles', color: 'bg-emerald-50 text-emerald-700' },
              { icon: BookOpen, label: 'Technical Reports', color: 'bg-blue-50 text-blue-700' },
              { icon: FileText, label: 'Conference Papers', color: 'bg-amber-50 text-amber-700' },
              { icon: BookOpen, label: 'Research Books', color: 'bg-purple-50 text-purple-700' },
            ].map(({ icon: Icon, label, color }) => (
              <Link
                key={label}
                to="/publications"
                className={`group flex flex-col items-center justify-center gap-3 p-8 border border-border hover:border-primary/40 transition-colors text-center ${color.split(' ')[0]} bg-opacity-40`}
              >
                <Icon className={`h-8 w-8 ${color.split(' ')[1]}`} />
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary group-hover:gap-2 flex items-center gap-1">
                  Browse <ArrowRight className="h-2.5 w-2.5" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((pub, index) => (
              <div
                key={pub.id}
                className={`group bg-[#F5F5F0] border border-transparent hover:border-primary/30 hover:bg-white transition-all duration-200 p-6 lg:p-7 ${
                  index === 0 ? 'md:row-span-2 flex flex-col' : ''
                }`}
              >
                {/* Type badge */}
                {pub.publicationType && (
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 mb-3 ${TYPE_COLORS[pub.publicationType] ?? TYPE_COLORS.OTHER}`}>
                    {pub.publicationType.replace(/_/g, ' ')}
                  </span>
                )}
                {/* Year */}
                {pub.publicationYear && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                    {pub.publicationYear}
                  </p>
                )}
                {/* Title */}
                <h3 className={`font-heading font-bold text-foreground leading-snug group-hover:text-primary transition-colors ${
                  index === 0 ? 'text-[20px] lg:text-[24px] flex-1' : 'text-[15px] lg:text-[17px]'
                }`}>
                  {pub.title}
                </h3>
                {/* Authors + type */}
                {pub.authors && (
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {Array.isArray(pub.authors) ? pub.authors.slice(0, 3).join(', ') : pub.authors}
                  </p>
                )}
                {/* Abstract for featured */}
                {index === 0 && pub.abstract && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {pub.abstract}
                  </p>
                )}
                {/* DOI link */}
                {pub.doiUrl && (
                  <a
                    href={pub.doiUrl.startsWith('http') ? pub.doiUrl : `https://doi.org/${pub.doiUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
                  >
                    View DOI <ArrowRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Mobile "All" link */}
        <div className="mt-6 sm:hidden text-center">
          <Link
            to="/publications"
            className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-primary"
          >
            All Publications <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}

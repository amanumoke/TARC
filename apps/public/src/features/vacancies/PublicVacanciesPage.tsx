import { useVacancies } from '@/api/hooks/useVacancies';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  MapPin,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function formatDeadline(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function isUrgent(dateStr: string): boolean {
  try {
    const diff = new Date(dateStr).getTime() - Date.now();
    return diff > 0 && diff < 1000 * 60 * 60 * 24 * 7; // within 7 days
  } catch {
    return false;
  }
}

function employmentBadgeColor(type: string): string {
  const t = type?.toLowerCase();
  if (t?.includes('full')) return 'bg-emerald-100 text-emerald-800';
  if (t?.includes('part')) return 'bg-blue-100 text-blue-800';
  if (t?.includes('contract')) return 'bg-amber-100 text-amber-800';
  if (t?.includes('intern')) return 'bg-purple-100 text-purple-800';
  return 'bg-muted text-muted-foreground';
}

export function PublicVacanciesPage() {
  const { data: vacancies = [], isLoading } = useVacancies();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[300px] lg:min-h-[360px] flex items-end">
        <div className="absolute inset-0">
          <img
            src="/images/vacancy.jpg"
            alt="Working at TARC"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f14]/92 via-[#0a1f14]/72 to-[#0a1f14]/30" />
        </div>
        <div className="relative w-full max-w-[1440px] mx-auto px-6 lg:px-16 pb-12 pt-24 lg:pb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">Vacancies</span>
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Careers at TARC
          </h1>
          <p className="mt-3 text-base text-white/65 max-w-xl leading-relaxed">
            Join us in advancing sustainable agriculture and food security across Southwest Ethiopia.
          </p>
        </div>
      </section>

      {/* ── Why join us — 3 visual pillars ── */}
      <section className="border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {[
              {
                icon: '🌿',
                title: 'Meaningful Work',
                desc: 'Research that directly shapes farming practices and livelihoods across the region.',
              },
              {
                icon: '🔬',
                title: 'World-Class Facilities',
                desc: 'Modern labs, field trial stations, and collaborative research infrastructure.',
              },
              {
                icon: '🤝',
                title: 'Inclusive Community',
                desc: 'A diverse team of researchers, technicians, and field specialists united by science.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 py-8 px-6 lg:px-8">
                <span className="text-2xl mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16">

            {/* Vacancies list */}
            <div>
              {/* Count header */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary text-white">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Open Positions
                  </p>
                  <h2 className="font-heading text-xl font-bold">
                    {isLoading
                      ? 'Loading…'
                      : vacancies.length
                      ? `${vacancies.length} position${vacancies.length === 1 ? '' : 's'} available`
                      : 'No vacancies at this time'}
                  </h2>
                </div>
              </div>

              {!isLoading && vacancies.length === 0 && (
                <div className="bg-muted/40 border border-border p-8 text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="font-semibold text-foreground mb-2">No open positions right now</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    New opportunities are published here after official approval. Check back soon or
                    contact us to express your interest.
                  </p>
                  <Link
                    to="/contact"
                    className="mt-5 inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors"
                  >
                    Send a spontaneous application
                  </Link>
                </div>
              )}

              {/* Accordion-style vacancy cards */}
              <div className="space-y-3">
                {vacancies.map((vacancy) => {
                  const open = expandedId === vacancy.id;
                  const urgent = isUrgent(vacancy.closingDate);
                  return (
                    <article
                      key={vacancy.id}
                      className={`overflow-hidden transition-all duration-200 ${
                        open
                          ? 'border-2 border-primary shadow-[0_0_0_4px_rgba(10,80,45,0.06)]'
                          : 'border border-border hover:border-primary/60 hover:shadow-sm'
                      } bg-white`}
                    >
                      {/* Card header — always visible */}
                      <button
                        type="button"
                        className="w-full text-left p-6 lg:p-7"
                        onClick={() => toggle(vacancy.id)}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Badges row */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm ${employmentBadgeColor(vacancy.employmentType)}`}>
                                {vacancy.employmentType.replace(/_/g, ' ')}
                              </span>
                              {urgent && (
                                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm bg-red-600 text-white animate-pulse">
                                  ⚡ Closing soon
                                </span>
                              )}
                            </div>
                            {/* Title — large and bold */}
                            <h3 className="font-heading text-[19px] lg:text-[21px] font-bold text-foreground leading-snug">
                              {vacancy.title}
                            </h3>
                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-4 mt-2.5 text-[12px] font-medium text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-primary/70" />
                                {vacancy.departmentName
                                  ? `${vacancy.departmentName} · ${vacancy.location}`
                                  : vacancy.location}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-primary/70" />
                                <span>Deadline: <strong className={urgent ? 'text-red-600' : 'text-foreground'}>{formatDeadline(vacancy.closingDate)}</strong></span>
                              </span>
                            </div>
                          </div>
                          {/* Expand/collapse icon */}
                          <div className={`flex-shrink-0 mt-1 flex items-center justify-center h-8 w-8 transition-colors ${open ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </div>
                      </button>

                      {/* Expanded detail */}
                      {open && (
                        <div className="border-t-2 border-primary/20 bg-[#f9fdf9] px-6 lg:px-7 pb-8 pt-6 space-y-6">
                          {vacancy.description && (
                            <div>
                              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
                                <span className="inline-block w-4 h-0.5 bg-primary" />
                                About the Role
                              </h4>
                              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                                {vacancy.description}
                              </p>
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {vacancy.qualifications && (
                              <div className="bg-white border border-border p-5">
                                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
                                  <span className="inline-block w-4 h-0.5 bg-primary" />
                                  Qualifications
                                </h4>
                                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                                  {vacancy.qualifications}
                                </p>
                              </div>
                            )}
                            {vacancy.applicationInstructions && (
                              <div className="bg-white border border-border p-5">
                                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
                                  <span className="inline-block w-4 h-0.5 bg-primary" />
                                  How to Apply
                                </h4>
                                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                                  {vacancy.applicationInstructions}
                                </p>
                              </div>
                            )}
                          </div>
                          {/* Deadline callout */}
                          <div className={`flex items-center gap-3 px-4 py-3 ${urgent ? 'bg-red-50 border border-red-200' : 'bg-muted/50 border border-border'}`}>
                            <Clock className={`h-4 w-4 flex-shrink-0 ${urgent ? 'text-red-600' : 'text-muted-foreground'}`} />
                            <p className={`text-sm font-medium ${urgent ? 'text-red-700' : 'text-muted-foreground'}`}>
                              Application deadline: <strong>{formatDeadline(vacancy.closingDate)}</strong>
                              {urgent && ' — This position closes very soon!'}
                            </p>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              {/* What we look for */}
              {!isLoading && (
                <div className="mt-14 pt-10 border-t border-border">
                  <h2 className="font-heading text-2xl font-bold mb-6">What we look for</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Researchers and technical specialists in agriculture and natural resources',
                      'Professionals supporting laboratories, field trials, and technology transfer',
                      'Administrative and operational colleagues who strengthen public research',
                      'Motivated graduates eager to contribute to evidence-based agricultural development',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 p-4 bg-muted/30 border border-border">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Contact card */}
                <div className="bg-[#0f2519] text-white p-6 space-y-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-2">
                      Recruitment contact
                    </p>
                    <p className="text-sm font-semibold leading-snug">
                      Questions about a position?
                    </p>
                  </div>
                  <div className="space-y-3 text-sm text-white/60">
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                      <span>Contact us through the official contact page for verified recruitment information.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                      <span>Tepi, Yeki Woreda, Sheka Zone, Southwest Ethiopia</span>
                    </div>
                  </div>
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 bg-white text-[#0f2519] px-5 py-3 text-[11px] font-semibold uppercase tracking-widest hover:bg-white/90 transition-colors w-full"
                  >
                    Contact the Center
                  </Link>
                </div>

                {/* Tips card */}
                <div className="border border-border p-6 space-y-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Application tips
                  </p>
                  {[
                    'Read the requirements carefully before applying',
                    'Attach all requested documents in the correct format',
                    'Submit before the closing date — late applications are not accepted',
                  ].map((tip) => (
                    <div key={tip} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <span className="mt-0.5 text-primary font-bold">→</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useVacancies } from '@/api/hooks/useVacancies';
import { BriefcaseBusiness, CheckCircle2, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PublicVacanciesPage() {
  const { data: vacancies = [], isLoading } = useVacancies();

  return (
    <div>
      <section className="border-b border-border bg-muted/30 py-14 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Vacancies</span>
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Careers at TARC
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Find current opportunities to contribute to agricultural research, technology transfer,
            and the sustainable development of Southwest Ethiopia.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1100px] gap-12 px-6 lg:grid-cols-[1fr_320px] lg:px-16">
          <div>
            <div className="flex items-start gap-4 border-b border-border pb-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-white">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Current openings
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold">
                  {isLoading ? 'Loading vacancies...' : vacancies.length ? `${vacancies.length} current opening${vacancies.length === 1 ? '' : 's'}` : 'No vacancies published'}
                </h2>
                {!isLoading && vacancies.length === 0 && (
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    There are no verified vacancies available at this time. New opportunities will be
                    published here after official approval and announcement by the Center.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-10 space-y-6">
              {vacancies.map((vacancy) => (
                <article key={vacancy.id} className="border border-border p-6 lg:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        {vacancy.employmentType.replace('_', ' ')}
                      </p>
                      <h3 className="mt-2 font-heading text-2xl font-bold">{vacancy.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {vacancy.departmentName || 'TARC'} · {vacancy.location}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-primary">
                      Apply by {new Date(vacancy.closingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {vacancy.description}
                  </p>
                  <div className="mt-6 grid gap-6 border-t border-border pt-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold">Qualifications</h4>
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{vacancy.qualifications}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">How to apply</h4>
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{vacancy.applicationInstructions}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 space-y-5">
              <h2 className="font-heading text-2xl font-bold">What we look for</h2>
              {[
                'Researchers and technical specialists in agriculture and natural resources',
                'Professionals supporting laboratories, field trials, and technology transfer',
                'Administrative and operational colleagues who strengthen public research service',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit border-l border-border pl-6 lg:pl-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Recruitment contact
            </p>
            <div className="mt-5 space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Contact the Center through the official contact page for verified recruitment information.</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Tepi, Yeki Woreda, Sheka Zone, Southwest Ethiopia</span>
              </div>
            </div>
            <Link
              to="/contact"
              className="mt-7 inline-flex bg-primary px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-white hover:bg-primary/90"
            >
              Contact the Center
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}

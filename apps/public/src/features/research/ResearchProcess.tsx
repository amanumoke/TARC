import { CheckCircle, FileText, Lightbulb, Microscope, Search, TrendingUp } from 'lucide-react';

const STEPS = [
  { icon: Search, label: 'Field', word: 'Observe' },
  { icon: Microscope, label: 'Research', word: 'Study' },
  { icon: Lightbulb, label: 'Develop', word: 'Innovate' },
  { icon: CheckCircle, label: 'Test', word: 'Validate' },
  { icon: FileText, label: 'Output', word: 'Share' },
  { icon: TrendingUp, label: 'Impact', word: 'Improve' },
];

export function ResearchProcess() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=80"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[var(--r-dark)]/85" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-4">
            Our Process
          </p>
          <h2 className="font-editorial text-[32px] lg:text-[56px] font-bold uppercase tracking-tight text-white leading-[0.95]">
            From Field
            <br />
            To Knowledge.
          </h2>
        </div>

        <div className="hidden lg:flex items-start justify-between gap-4">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center text-center flex-1">
                <step.icon className="h-6 w-6 text-[var(--r-accent)] mb-3" />
                <span className="text-[13px] font-semibold uppercase tracking-widest text-white/90">
                  {step.label}
                </span>
                <span className="text-[11px] text-white/40 mt-1">{step.word}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-full h-px bg-white/15 flex-shrink-0 mx-2 mt-[-20px]" />
              )}
            </div>
          ))}
        </div>

        <div className="lg:hidden flex flex-col gap-8">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <step.icon className="h-5 w-5 text-[var(--r-accent)]" />
                {i < STEPS.length - 1 && <div className="w-px h-12 bg-white/15 mt-2" />}
              </div>
              <div>
                <span className="text-[13px] font-semibold uppercase tracking-widest text-white/90">
                  {step.label}
                </span>
                <span className="text-[11px] text-white/40 ml-3">{step.word}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

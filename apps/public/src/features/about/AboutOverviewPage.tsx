import { useSettings } from '@/api/hooks/useSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800): number {
  const [count, setCount] = useState(0);
  const ref = useRef<boolean>(false);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !ref.current) {
          ref.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - (1 - p) ** 3;
            setCount(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return count;
  // elRef is attached via StatNumber component below
}

function StatNumber({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const elRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / 1600, 1);
            const eased = 1 - (1 - p) ** 3;
            setCount(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={elRef} className="text-center px-6 py-8 flex flex-col items-center">
      <div className="font-heading text-4xl lg:text-5xl font-bold text-white leading-none">
        {count}
        <span className="text-[#9ed8b2]">{suffix}</span>
      </div>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">{label}</p>
    </div>
  );
}

// ── Nav cards data ────────────────────────────────────────────────────────────
const ABOUT_NAV = [
  {
    to: '/about/director',
    label: "Director's Message",
    desc: 'Welcome from our Center leadership',
    img: '/images/director-dereje.jpg',
  },
  {
    to: '/about/departments',
    label: 'Our Departments',
    desc: 'Research divisions and specialist teams',
    img: '/images/seed.jpg',
  },
  {
    to: '/about/people',
    label: 'Top Management & Staff',
    desc: 'Leadership team and researchers',
    img: '/images/agriculture area.jpg',
  },
  {
    to: '/about/structure',
    label: 'Organizational Structure',
    desc: 'EIAR & TARC institutional architecture',
    img: '/images/spices.jpg',
  },
  {
    to: '/vacancies',
    label: 'Work With Us',
    desc: 'Open positions and career opportunities',
    img: '/images/vacancy.jpg',
  },
];

// ── History milestones ────────────────────────────────────────────────────────
const HISTORY = [
  {
    year: '1966',
    title: 'National Research Foundation',
    body: 'The Ethiopian Institute of Agricultural Research (EIAR) was established as the first nationally coordinated agricultural research institution, creating the foundation for organised research across Ethiopia.',
  },
  {
    year: '1974',
    title: 'Tepi Research Station Established',
    body: 'A research station was set up in Tepi, Sheka Zone, to harness the unique agro-ecological potential of Southwest Ethiopia — focusing initially on coffee, spices, and perennial crops native to the area.',
  },
  {
    year: '1997',
    title: 'Elevated to Research Center',
    body: 'The Tepi station was upgraded to the Tepi Agricultural Research Center (TARC) under the reorganised Ethiopian Agricultural Research Organization, expanding its mandate and scientific capacity.',
  },
  {
    year: '2005',
    title: 'EIAR Reorganisation',
    body: 'EIAR adopted its present identity and TARC was strengthened as a key regional center within the national network, deepening research in coffee, cacao, spices, livestock, and natural resources.',
  },
  {
    year: 'TODAY',
    title: 'Research for Ethiopia\'s Future',
    body: 'TARC continues to advance agricultural research, technology development, and knowledge dissemination — serving farmers, communities, and the agricultural sector of Southwest Ethiopia and beyond.',
  },
];

// ── Mandate items ─────────────────────────────────────────────────────────────
const MANDATE_ITEMS = [
  {
    icon: '🌾',
    title: 'Crop & Spice Research',
    desc: 'Develop improved varieties and production systems for coffee, cacao, spices, and other high-value crops of Southwest Ethiopia.',
  },
  {
    icon: '🐄',
    title: 'Livestock Research',
    desc: 'Conduct research in animal production, health, and nutrition systems suited to the agro-ecology of the region.',
  },
  {
    icon: '🌱',
    title: 'Natural Resource Management',
    desc: 'Research sustainable soil, water, and forest management practices to protect the environment and support livelihoods.',
  },
  {
    icon: '🔬',
    title: 'Biotechnology & Lab Science',
    desc: 'Apply biotechnology, plant tissue culture, and laboratory science to accelerate crop improvement and disease resistance.',
  },
  {
    icon: '📡',
    title: 'Technology Transfer',
    desc: 'Ensure research outputs reach farmers, extension workers, and communities through practical technology dissemination.',
  },
  {
    icon: '🤝',
    title: 'Partnership & Capacity',
    desc: 'Collaborate with EIAR, universities, NGOs, government bodies, and international research organisations to strengthen capacity.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export function AboutOverviewPage() {
  const { data: settings, isLoading } = useSettings();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-20 space-y-12">
        <Skeleton className="h-80 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div>

      {/* ══════════════════════════════════════════════════════
          HERO — News/update-style: large image left, text right
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#F5F5F0]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">

            {/* Left — large image (news-article style) */}
            <div className="relative overflow-hidden min-h-[320px] lg:min-h-[560px]">
              <img
                src="/images/agriculture area.jpg"
                alt="TARC research field"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f14]/70 via-transparent to-transparent" />
              {/* Caption tag */}
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 mb-3">
                  Tepi Agricultural Research Center
                </span>
              </div>
            </div>

            {/* Right — editorial text block */}
            <div className="flex flex-col justify-center px-8 py-12 lg:px-14 lg:py-16 bg-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">About TARC</span>
              </p>

              {/* Big editorial headline */}
              <h1 className="font-heading text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-foreground tracking-tight leading-[1.05] mb-2">
                About TARC
              </h1>
              <p className="font-heading text-[20px] sm:text-[24px] text-primary font-semibold leading-snug mb-6">
                Researching Today.
                <br />
                <span className="text-foreground">Transforming Tomorrow.</span>
              </p>

              <div className="w-12 h-1 bg-primary mb-6" />

              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                {settings?.aboutText ||
                  'The Tepi Agricultural Research Center (TARC) is at the heart of Southwest Ethiopia\'s agricultural transformation. Located in Tepi, Sheka Zone, TARC is a federal research center under the Ethiopian Institute of Agricultural Research (EIAR).'}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                Through science, innovation, technology and partnership, TARC generates knowledge and solutions that help farmers, communities and the nation build a more productive, resilient and food-secure future in the unique agro-ecology of Southwest Ethiopia.
              </p>

              {/* Slim horizontal nav strip — one line, unobtrusive */}
              <div className="flex flex-wrap items-center gap-x-0 border border-border divide-x divide-border overflow-hidden">
                {ABOUT_NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors whitespace-nowrap"
                  >
                    <ArrowRight className="h-2.5 w-2.5 opacity-50" />
                    {n.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHO WE ARE — two-col text + side image
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-3">Who We Are</p>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-6">
                Advancing Ethiopian Agriculture Through Science
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  TARC is a federal agricultural research center under the Ethiopian Institute of Agricultural Research (EIAR), strategically located in Tepi to serve the agro-ecological zone of Southwest Ethiopia. The center conducts research across crops, livestock, natural resources, biotechnology, and agricultural engineering.
                </p>
                <p>
                  Southwest Ethiopia is one of the most biodiversity-rich regions in Africa — the origin of Arabica coffee, home to dozens of spice crops, and a critical zone for cacao, enset, and horticultural production. TARC's research is uniquely positioned to unlock the potential of this environment.
                </p>
                <p>
                  Our work goes beyond laboratories and research stations. We connect scientific discovery with farmers, researchers, universities, policymakers, development partners, and communities so that knowledge becomes practical agricultural solutions.
                </p>
              </div>
            </div>

            {/* Side image + EIAR identity card */}
            <div className="space-y-4">
              <div className="relative overflow-hidden aspect-[4/3] bg-[#0a1f14]">
                <img
                  src="/images/cacao-research.jpg"
                  alt="Cacao research at TARC"
                  className="w-full h-full object-cover opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f14]/80 to-transparent" />
                <p className="absolute bottom-5 left-5 right-5 text-xs text-white/75 leading-relaxed">
                  Cacao research — one of TARC's flagship programs in Southwest Ethiopia.
                </p>
              </div>

              {/* EIAR identity card */}
              <div className="border border-border p-5 bg-[#F5F5F0] flex items-center gap-4">
                <div className="h-12 w-12 bg-white border border-border rounded p-1 shrink-0 overflow-hidden">
                  <img src="/images/eiar-logo.jpg" alt="EIAR Logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Part of</p>
                  <p className="text-sm font-semibold text-foreground leading-snug">Ethiopian Institute of Agricultural Research</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Science • Innovation • Agriculture • National Development</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          VISION / MISSION / MANDATE
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#F5F5F0] py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {[
              {
                label: 'Our Vision',
                text: settings?.visionText ||
                  'To be a center of excellence in agricultural research in Southwest Ethiopia, contributing to national food security and transformation through innovative technologies and strategic partnerships.',
              },
              {
                label: 'Our Mission',
                text: settings?.missionText ||
                  'To conduct innovative agricultural research in coffee, spices, cacao, horticulture, livestock, and natural resources — providing improved technologies for food security and economic growth.',
              },
              {
                label: 'Our Mandate',
                text: 'TARC is mandated to conduct research in spice crops, coffee, horticultural crops, cacao, livestock, natural resources, plant genetic resource conservation, and farmer extension and technology dissemination.',
              },
            ].map(({ label, text }) => (
              <div key={label} className="bg-[#F5F5F0] p-8 lg:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-5">{label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HISTORY TIMELINE
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">

            {/* Image */}
            <div className="relative overflow-hidden aspect-[4/3] bg-[#0a1f14]">
              <img
                src="/images/red-coffee.jpg"
                alt="Coffee research at TARC"
                className="h-full w-full object-cover opacity-85"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f14]/85 to-transparent" />
              <p className="absolute bottom-6 left-6 right-6 text-sm text-white/80 leading-relaxed">
                Coffee research — a cornerstone of TARC's scientific legacy since its founding in the heart of Arabica's origin.
              </p>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-3">Our Journey</p>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-10">
                A Legacy of Agricultural Innovation
              </h2>

              <div className="relative border-l-2 border-primary/25 pl-7 space-y-8">
                {HISTORY.map(({ year, title, body }, i) => (
                  <div key={year} className="relative group">
                    {/* Timeline dot */}
                    <span className="absolute -left-[35px] top-1 flex items-center justify-center h-4 w-4 bg-primary rounded-full ring-4 ring-white" />
                    {/* Year badge */}
                    <p className={`text-[11px] font-bold uppercase tracking-[0.18em] mb-1.5 ${year === 'TODAY' ? 'text-primary' : 'text-muted-foreground'}`}>
                      {year}
                    </p>
                    <h3 className="font-heading text-[17px] font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                    {i < HISTORY.length - 1 && (
                      <div className="absolute -left-[34px] top-6 bottom-[-32px] w-px bg-primary/15" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          NATIONAL MANDATE — 6-card grid
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#F5F5F0] py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-3">What We Do</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-12">
            Our Research Mandate
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MANDATE_ITEMS.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white border border-border p-6 lg:p-7 group hover:border-primary/50 transition-colors">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-heading text-[16px] font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PURPOSE / IMPACT — dark section
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#0f2519] py-20 lg:py-24 text-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-3">Our Purpose</p>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
                Turning Scientific Knowledge Into Agricultural Impact
              </h2>
              <div className="space-y-4 text-sm text-white/65 leading-relaxed">
                <p>
                  Agricultural research matters when scientific knowledge reaches people and creates meaningful change. TARC works to bridge the gap between research and application.
                </p>
                <p>
                  Our researchers develop technologies and knowledge that increase productivity, strengthen food and nutrition security, improve natural resource management, respond to climate change, and improve rural livelihoods across Southwest Ethiopia.
                </p>
                <p className="text-white/80 font-medium">
                  We invite researchers, farmers, development partners, universities, policymakers, and citizens to explore our research, technologies, and publications.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/research"
                  className="inline-flex items-center gap-2 bg-white text-[#0f2519] px-6 py-3 text-[12px] font-bold uppercase tracking-widest hover:bg-white/90 transition-colors"
                >
                  Explore Research <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 text-[12px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  Partner With Us <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Animated stats */}
            <div className="grid grid-cols-2 gap-px bg-white/10">
              <StatNumber value={1974} suffix="" label="Est. Year" />
              <StatNumber value={50} suffix="+" label="Years of Research" />
              <StatNumber value={8} suffix="+" label="Departments" />
              <StatNumber value={100} suffix="+" label="Staff Members" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRINCIPLES
      ══════════════════════════════════════════════════════ */}
      <section className="border-y border-border bg-[#17231b] py-16 lg:py-20 text-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-8">Our Principles</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {[
              ['Scientific Integrity', 'Evidence-led research, careful experimentation, and honest reporting that upholds the highest standards of scientific practice.'],
              ['Service to Farmers', 'Technologies and knowledge designed around the real needs of local farming communities in Southwest Ethiopia.'],
              ['Partnership', 'Shared learning across researchers, communities, institutions, government, and international development partners.'],
            ].map(([title, desc]) => (
              <div key={title} className="bg-[#17231b] p-8 lg:p-10">
                <h3 className="font-heading text-lg font-bold mb-3">{title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EXPLORE — bento image card tree (with Org Structure visible)
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">Explore</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-10">
            Learn More About TARC
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ABOUT_NAV.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className={`group relative overflow-hidden flex flex-col justify-end ${
                  i === 0 ? 'sm:col-span-2 lg:col-span-2 min-h-[280px]' : 'min-h-[210px]'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src={link.img}
                    alt={link.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                </div>
                <div className="relative p-6 lg:p-7">
                  <h3 className="font-heading text-[17px] lg:text-[19px] font-bold text-white leading-snug">
                    {link.label}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">{link.desc}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                    Explore
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

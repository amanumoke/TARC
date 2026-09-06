import {
  Building2,
  FlaskConical,
  GitBranch,
  Landmark,
  Settings2,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const wings = [
  {
    title: 'Operations',
    description: 'Coordinates the people, finance, procurement, services, and systems that keep the institution working.',
    icon: Settings2,
    units: ['Human Resources and Competency', 'Finance and Procurement', 'Institutional Reform', 'Basic Services', 'Information and Communication Technology'],
  },
  {
    title: 'Research',
    description: 'Leads agricultural research programs and coordinates scientific directorates and research capacity.',
    icon: FlaskConical,
    units: ['Crops Research', 'Livestock Research', 'Soil and Water Management', 'Agricultural Engineering', 'Agricultural Economics', 'Biotechnology', 'Food Science and Nutrition', 'Plant Protection'],
  },
  {
    title: 'Technology Commercialization',
    description: 'Connects research outputs with users, enterprises, and pathways for practical adoption.',
    icon: Building2,
    units: ['Agricultural Extension', 'Seed and Technology Multiplication', 'Farming Technology Transfer', 'Strategic Partnerships'],
  },
  {
    title: 'Research System Coordination',
    description: 'Strengthens coordination across research centers and supports national research collaboration.',
    icon: GitBranch,
    units: ['Research Centers Coordination', 'Research Capacity Building', 'Knowledge Management and Resource Protection'],
  },
  {
    title: 'Executive and Institutional Support',
    description: 'Provides leadership, accountability, communication, legal, ethics, audit, and strategic support.',
    icon: Landmark,
    units: ['Office of the Director General', 'Strategic Affairs', 'Public Relations and Communication', 'Legal Services', 'Ethics and Anti-Corruption', 'Internal Audit', 'Gender and Social Affairs'],
  },
];

export function OrganizationalStructurePage() {
  return (
    <div>
      <section className="border-b border-border bg-muted/30 py-14 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/about" className="hover:text-foreground">About</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Structure</span>
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Organizational Structure
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A clear view of the leadership, research, operations, and technology-transfer functions
            that support agricultural research and public service.
          </p>
        </div>
      </section>

      <section className="bg-[#f5f5f0] py-16 lg:py-24">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-16">
          <div className="mx-auto max-w-md border border-primary/30 bg-primary p-7 text-center text-white shadow-[0_12px_30px_rgba(1,45,29,0.12)]">
            <UsersRound className="mx-auto h-6 w-6" />
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Institutional leadership</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">Director General</h2>
            <p className="mt-2 text-sm text-white/75">Provides strategic direction, accountability, and coordination across the institution.</p>
          </div>
          <div className="mx-auto h-12 w-px bg-border" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wings.map((wing) => {
              const Icon = wing.icon;
              return (
                <article key={wing.title} className="border border-border bg-background p-7 transition-colors hover:border-primary/50 lg:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Function {String(wings.indexOf(wing) + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold">{wing.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{wing.description}</p>
                  <ul className="mt-6 space-y-2 border-t border-border pt-5">
                    {wing.units.map((unit) => (
                      <li key={unit} className="text-sm text-foreground/80">{unit}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-16">
          <p>This overview is adapted from the official institutional structure published by EIAR and presented here for public orientation.</p>
          <Link to="/about/departments" className="shrink-0 font-semibold text-primary hover:text-primary/80">View TARC departments</Link>
        </div>
      </section>
    </div>
  );
}

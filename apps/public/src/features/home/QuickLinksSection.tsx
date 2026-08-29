import { FlaskConical, Mail, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const LINKS = [
  {
    icon: FlaskConical,
    title: 'Research Programs',
    description:
      'Explore our ongoing research initiatives in agriculture, horticulture, and plant pathology.',
    href: '/research',
  },
  {
    icon: Users,
    title: 'Our Team',
    description: 'Meet the dedicated scientists and staff driving innovation at TARC.',
    href: '/about',
  },
  {
    icon: Mail,
    title: 'Get in Touch',
    description: 'Have questions or want to collaborate? Reach out to our team.',
    href: '/contact',
  },
];

export function QuickLinksSection() {
  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-muted-foreground tracking-[0.2em] uppercase mb-2">
            ── Navigate
          </p>
          <h2 className="text-3xl md:text-4xl text-foreground font-heading">How Can We Help?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="group border border-border rounded-lg p-6 bg-card hover:shadow-md transition-all hover:border-primary/30"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <link.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

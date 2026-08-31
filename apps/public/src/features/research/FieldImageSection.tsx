import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FieldImageSection() {
  return (
    <section className="relative h-[60vh] lg:h-[80vh] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80"
        alt="Agricultural research field in Ethiopian highlands"
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[var(--r-dark)]/60" />

      <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-16 mx-auto max-w-[1440px]">
        <h2 className="font-editorial text-[40px] lg:text-[72px] xl:text-[96px] font-bold uppercase tracking-tight text-white leading-[0.9]">
          Research
          <br />
          Happens
          <br />
          In The Field.
        </h2>

        <Link
          to="/gallery"
          className="mt-8 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-white/80 hover:text-white transition-colors self-start"
        >
          Explore Gallery
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

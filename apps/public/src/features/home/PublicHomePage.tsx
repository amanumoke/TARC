/**
 * @file apps/public/src/features/home/PublicHomePage.tsx
 * @description Public home page matching the TARCMS design screenshot exactly.
 * Hero, Stats, About, Featured Research, Director's Message, Footer.
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ExternalLink, Quote } from 'lucide-react';
import { FeaturedResearchSection } from './FeaturedResearchSection';
import { HeroBanner } from './HeroBanner';
import { StatsCounter } from './StatsCounter';

/* ─── About Section ────────────────────────────────────────────── */

function AboutSection() {
  return (
    <section className="py-16 px-6 border-t border-[#e2e3e0]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-[#e8e8e5] rounded overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs font-semibold text-[#717973] tracking-widest uppercase mb-1">
                  FACILITY OVERVIEW
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-[#1B4332] text-white p-4 flex items-center justify-between">
              <span className="font-medium text-sm">The Sheka Highlands Facility</span>
              <ExternalLink className="h-4 w-4 opacity-70" />
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-6 lg:pt-4">
            <div>
              <p className="text-[10px] font-semibold text-[#717973] tracking-[0.2em] uppercase mb-3">
                ── About TARC
              </p>
              <h2
                className="text-3xl md:text-4xl leading-tight text-[#1a1c1a]"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Cultivating the Future of Ethiopian Agriculture
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm text-[#414844] leading-relaxed">
              <p>
                Nestled in the biodiverse southwest, the Tepi Agricultural Research Center serves as
                a vital hub for advancing coffee, spice, and horticultural research. Our mission is
                to transform traditional farming methodologies through rigorous research, ensuring
                food security and economic prosperity for the region.
              </p>
              <p>
                We specialize in highland crops, focusing on disease resistance, climate
                adaptability, and maximizing yield potential while respecting the delicate
                ecological balance of our surroundings.
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 text-xs font-semibold text-[#1a1c1a] tracking-widest uppercase hover:text-[#1B4332] transition-colors"
            >
              LEARN MORE ABOUT OUR HISTORY
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Director's Message Section ────────────────────────────────── */

function DirectorMessageSection() {
  return (
    <section className="py-20 px-6 border-t border-[#e2e3e0] bg-[#f9faf6]">
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-3xl mx-auto">
          <Quote className="h-9 w-9 text-[#1B4332] mb-8" />

          <blockquote
            className="text-lg text-[#414844] leading-relaxed mb-10"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            "Our commitment at TARC goes beyond the laboratory; it is rooted in the soil of the
            Sheka highlands and the livelihoods of the farmers who depend on it. We strive for
            excellence not just in publication, but in practical, sustainable implementation that
            elevates our entire agricultural ecosystem."
          </blockquote>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-full bg-[#e8e8e5]" />
            <div>
              <p className="font-semibold text-sm text-[#1a1c1a]">Dr. Alemayehu Tadesse</p>
              <p className="text-[10px] font-semibold text-[#717973] tracking-widest uppercase">
                CENTER DIRECTOR, TARC
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="border-[#c1c8c2] text-[#1a1c1a] text-xs font-semibold tracking-wide uppercase rounded"
          >
            READ FULL MESSAGE
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ─── Home Page ────────────────────────────────────────────────── */

export function PublicHomePage() {
  return (
    <div>
      <HeroBanner />
      <StatsCounter />
      <AboutSection />
      <FeaturedResearchSection />
      <DirectorMessageSection />
    </div>
  );
}

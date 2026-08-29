/**
 * @file apps/public/src/features/home/HeroBanner.tsx
 * @description Hero banner matching the TARCMS design screenshot.
 * Two-column layout: text left, image placeholder right.
 */

import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#414844] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#1B4332]" />
              AGRICULTURAL EXCELLENCE HUB
            </div>

            <h1
              className="text-5xl md:text-6xl leading-[1.1] text-[#1a1c1a]"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Pioneering Agricultural Excellence in the{' '}
              <span className="text-[#1B4332]">Southwest Highlands</span>
            </h1>

            <p className="text-base text-[#414844] max-w-xl leading-relaxed">
              Advancing sustainable farming practices, discovering high-yield cultivars, and
              empowering local communities through data-driven research at the Tepi Agricultural
              Research Center.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Button className="bg-[#1B4332] hover:bg-[#1B4332]/90 text-white text-xs font-semibold tracking-wide uppercase rounded">
                <Eye className="mr-2 h-3.5 w-3.5" />
                EXPLORE RESEARCH DATA
              </Button>
              <Button
                variant="outline"
                className="border-[#c1c8c2] text-[#1a1c1a] text-xs font-semibold tracking-wide uppercase rounded"
              >
                LATEST PUBLICATIONS
              </Button>
            </div>
          </div>

          {/* Right - Image placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] border border-dashed border-[#c1c8c2] rounded bg-[#f9faf6] flex items-end justify-end p-3">
              <span className="text-[10px] text-[#717973] tracking-wider">SYS_CN_LINE_01</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

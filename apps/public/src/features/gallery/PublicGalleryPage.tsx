import { useGallery } from '@/api/hooks/useGallery';
import type { GalleryMediaDTO } from '@/api/types';
import { Skeleton } from '@/components/ui/skeleton';
import { X, ZoomIn } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'FIELD_TRIALS', label: 'Field Trials' },
  { value: 'LABORATORY', label: 'Laboratory' },
  { value: 'SPICE_VARIETIES', label: 'Spice Varieties' },
  { value: 'COFFEE_RESEARCH', label: 'Coffee Research' },
  { value: 'COMMUNITY_OUTREACH', label: 'Community Outreach' },
  { value: 'FACILITIES', label: 'Facilities' },
];

export function PublicGalleryPage() {
  const [activeCategory, setActiveCategory] = useState('');
  const [lightboxItem, setLightboxItem] = useState<GalleryMediaDTO | null>(null);

  const { data: galleryData, isLoading } = useGallery({
    category: activeCategory || undefined,
  });

  const items: GalleryMediaDTO[] = useMemo(
    () => (Array.isArray(galleryData) ? galleryData : []),
    [galleryData]
  );

  // Trap scroll when lightbox is open
  useEffect(() => {
    if (lightboxItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxItem]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div>
      {/* ── Full-bleed hero ── */}
      <section className="relative overflow-hidden min-h-[300px] lg:min-h-[360px] flex items-end">
        <div className="absolute inset-0">
          <img
            src="/images/field-3.jpg"
            alt="TARC research fields"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Multi-directional overlay so text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f14]/93 via-[#0a1f14]/70 to-[#0a1f14]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f14]/60 to-transparent" />
        </div>

        <div className="relative w-full max-w-[1440px] mx-auto px-6 lg:px-16 pb-12 pt-24 lg:pb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">Gallery</span>
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Media Gallery
          </h1>
          <p className="mt-3 text-base text-white/65 max-w-xl leading-relaxed">
            Photos from research activities, field stations, and laboratories at Tepi Agricultural Research Center.
          </p>
        </div>
      </section>

      {/* ── Sticky category filter tabs ── */}
      <div className="border-b border-border bg-white sticky top-[65px] z-30">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="flex flex-wrap gap-0 -mb-px overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest transition-colors whitespace-nowrap border-b-2 ${
                  activeCategory === cat.value
                    ? 'text-primary border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Gallery grid ── */}
      <section className="py-10 pb-24 lg:pb-32 bg-[#F5F5F0]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          {isLoading ? (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={`sk-${i}`} className="aspect-square w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">📷</div>
              <h3 className="font-semibold text-foreground mb-2">No images in this category</h3>
              <p className="text-sm text-muted-foreground">Try selecting a different category above.</p>
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item, index) => {
                // Give every 9th item a 2×2 featured slot for visual rhythm
                const isFeatured = index % 9 === 0;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setLightboxItem(item)}
                    className={`group relative overflow-hidden bg-muted cursor-zoom-in ${
                      isFeatured ? 'sm:col-span-2 sm:row-span-2 aspect-square' : 'aspect-square'
                    }`}
                  >
                    <img
                      src={item.thumbnailUrl || item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-center gap-2">
                      <ZoomIn className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100" />
                      {item.title && (
                        <span className="text-[12px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 text-center leading-snug line-clamp-2">
                          {item.title}
                        </span>
                      )}
                    </div>
                    {/* Category badge */}
                    {item.category && (
                      <span className="absolute top-2 left-2 bg-black/50 text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.category.replace(/_/g, ' ')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
          onKeyDown={(e) => e.key === 'Escape' && setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          tabIndex={-1}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxItem(null)}
            className="absolute top-5 right-5 z-10 flex items-center justify-center h-10 w-10 bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Image + caption */}
          <div
            className="max-w-5xl w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxItem.imageUrl}
              alt={lightboxItem.title}
              className="max-h-[78vh] w-auto object-contain"
            />
            {(lightboxItem.title || lightboxItem.caption) && (
              <div className="text-center space-y-1 max-w-2xl px-4">
                {lightboxItem.title && (
                  <h3 className="text-base font-semibold text-white">{lightboxItem.title}</h3>
                )}
                {lightboxItem.caption && (
                  <p className="text-sm text-white/60 leading-relaxed">{lightboxItem.caption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

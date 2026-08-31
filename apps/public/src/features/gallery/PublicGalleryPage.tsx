import { useGallery } from '@/api/hooks/useGallery';
import type { GalleryMediaDTO } from '@/api/types';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { Skeleton } from '@/components/ui/skeleton';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
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

  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Gallery</span>
          </p>
          <h1 className="font-heading text-[48px] lg:text-[80px] xl:text-[100px] font-bold text-foreground leading-[0.95]">
            Gallery
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Photos from research activities and facilities at TARC.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-widest transition-colors ${
                  activeCategory === cat.value
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          {isLoading ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={`skeleton-${i}`} className="aspect-square w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground py-12">No images found in this category.</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setLightboxItem(item)}
                  className="group relative aspect-square overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <PlaceholderImage
                    label={item.title}
                    aspectRatio="square"
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4">
                    <span className="text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxItem && (
        <dialog
          open
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop:bg-black/90"
          onClose={() => setLightboxItem(null)}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxItem(null);
          }}
          onKeyDown={(e) => e.key === 'Escape' && setLightboxItem(null)}
          aria-label="Image lightbox"
        >
          <button
            type="button"
            onClick={() => setLightboxItem(null)}
            className="absolute top-6 right-6 text-white hover:text-white/80 transition-colors"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>
          <div
            className="max-w-4xl w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <PlaceholderImage label={lightboxItem.title} aspectRatio="video" className="w-full" />
            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold text-white">{lightboxItem.title}</h3>
              {lightboxItem.caption && (
                <p className="text-sm text-white/70">{lightboxItem.caption}</p>
              )}
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

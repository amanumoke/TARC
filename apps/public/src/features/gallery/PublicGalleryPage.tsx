import { useGallery } from '@/api/hooks/useGallery';
import type { GalleryMediaDTO } from '@/api/types';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, ImageIcon, X } from 'lucide-react';
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
    <div className="space-y-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Gallery</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold">Gallery</h1>
        <p className="text-muted-foreground mt-2">
          Photos from research activities and facilities at TARC.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={`skeleton-${i}`} className="aspect-square w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No images found in this category.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border hover:ring-2 hover:ring-primary transition-all"
            >
              <PlaceholderImage label={item.title} aspectRatio="square" className="w-full h-full" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
                <span className="text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
          onKeyDown={(e) => e.key === 'Escape' && setLightboxItem(null)}
          tabIndex={-1}
        >
          <button
            type="button"
            onClick={() => setLightboxItem(null)}
            className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          <div
            className="max-w-3xl w-full space-y-4"
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
        </div>
      )}
    </div>
  );
}

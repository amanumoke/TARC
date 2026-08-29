interface PlaceholderImageProps {
  label?: string;
  className?: string;
  aspectRatio?: 'video' | 'square';
}

export function PlaceholderImage({
  label = 'Image',
  className = '',
  aspectRatio = 'video',
}: PlaceholderImageProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 ${
        aspectRatio === 'video' ? 'aspect-video' : 'aspect-square'
      } ${className}`}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

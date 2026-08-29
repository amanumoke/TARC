import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Fixed-count skeleton placeholders
        <div key={`row-${i}`} className="flex items-center gap-4">
          {Array.from({ length: columns }, (_, j) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Fixed-count skeleton placeholders
            <Skeleton key={`cell-${i}-${j}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 3 }: CardSkeletonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Fixed-count skeleton placeholders
        <div key={`card-${i}`} className="space-y-3 rounded-lg border bg-card p-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

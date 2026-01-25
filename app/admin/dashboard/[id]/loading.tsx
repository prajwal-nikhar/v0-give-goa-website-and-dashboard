import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
      <div className="mb-6">
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

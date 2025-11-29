"use client";

import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/shadcn-ui";

interface SkeletonProps {
  count?: number;
  className?: string;
}

export const SkeletonProductCategories = ({
  count = 3,
  className,
}: SkeletonProps) => {
  return (
    <div
      className={cn(
        "px-5 my-4 inline-flex gap-7 overflow-x-auto whitespace-nowrap mx-auto w-full top-0 z-40 h-12 snap-x snap-mandatory flex-nowrap scroll-px-4 justify-start md:justify-center md:ml-0",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-8 w-28 flex-shrink-0 snap-center rounded-md"
        />
      ))}
    </div>
  );
};

export const SkeletonProductCard = () => {
  return (
    <div className="group block shadow-md rounded-md">
      {/* Image */}
      <Skeleton className="relative rounded-t-lg aspect-[3/4]" />

      {/* Info block */}
      <div className="p-2 bg-slate-50">
        <div className="mb-2">
          <Skeleton className="h-4 w-3/4 mb-1 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>

        <div className="flex items-end gap-2 mb-2">
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-3 w-10 rounded" />
          <Skeleton className="h-3 w-6 rounded" />
        </div>
      </div>

      {/* Add to cart button */}
      <div className="px-2 pb-2 bg-slate-50 rounded-b-lg">
        <Skeleton className="h-8 w-full rounded" />
      </div>
    </div>
  );
};

// Skeleton для списка продуктов
interface SkeletonProductGroupListProps {
  count?: number;
}

export const SkeletonProductGroupList: React.FC<
  SkeletonProductGroupListProps
> = ({ count = 6 }) => {
  return (
    <div className="my-0 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[10px] md:gap-[30px] px-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonProductCard key={index} />
      ))}
    </div>
  );
};

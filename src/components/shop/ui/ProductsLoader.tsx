import { Skeleton } from "@/components/shadcn-ui/skeleton";

export function ProductsLoader() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="w-[240px] h-[300px] rounded-lg" />
          <Skeleton className="w-[200px] h-6 rounded" />
          <Skeleton className="w-[100px] h-6 rounded" />
        </div>
      ))}
    </div>
  );
}

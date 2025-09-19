import React from "react";
import { Skeleton } from "@/shared/shadcn-ui";

interface Props {
  className?: string;
}

export const TotalAmountLoader: React.FC<Props> = ({ className }) => {
  return (
    <div className={`border border-gray-300 p-4 rounded-lg ${className}`}>
      {/* Стоимость товаров */}
      <Skeleton className="h-6 w-3/5 mb-3" />
      {/* Скидка */}
      <Skeleton className="h-6 w-2/5 mb-3" />
      {/* Стоимость доставки */}
      <Skeleton className="h-6 w-3/5 mb-3" />
      {/* Итог */}
      <div className="flex justify-between border-t pt-3 mt-3">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </div>
  );
};

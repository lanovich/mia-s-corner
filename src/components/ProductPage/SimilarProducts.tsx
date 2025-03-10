import { getSimilarProducts } from "@/lib/cache";
import React from "react";
import { HorizontalProductCard } from "./HorizontalProductCard";

interface Props {
  className?: string;
  historyId: number;
}

export const SimilarProducts: React.FC<Props> = async ({
  className,
  historyId,
}) => {
  const similarProducts = await getSimilarProducts(historyId);

  if (!similarProducts.length) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="text-3xl font-semibold mb-4 pb-2 border-b-2">
        Товары из той же истории
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {similarProducts.map((product) => (
          <div key={product.id} className="w-full mb-5">
            <HorizontalProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

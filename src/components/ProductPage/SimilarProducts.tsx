import { getSimilarProducts } from "@/lib/cache";
import React from "react";
import { ProductCard } from "../shop";

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
      <h2 className="text-3xl font-semibold mb-4">Товары из той же истории</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        {similarProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

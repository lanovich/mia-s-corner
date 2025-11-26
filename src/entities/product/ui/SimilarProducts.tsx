import React from "react";
import { HorizontalProductCard } from "./HorizontalProductCard";
import { Product, ShortProduct } from "@/entities/product/model";
import { productsApi } from "@/entities/product/api";
import { CATEGORY_SLUG_MAP } from "@/entities/category/model";

interface Props {
  className?: string;
  historyId: number | null;
  productId: number;
}

export const SimilarProducts: React.FC<Props> = async ({
  className,
  historyId,
  productId,
}) => {
  let similarProducts = null;
  if (historyId) {
    similarProducts = await productsApi.fetchSimilarProducts(
      historyId,
      productId
    );
  }

  if (!similarProducts || similarProducts.length === 0) {
    return null;
  }

  const groupedProducts = similarProducts.reduce<
    Record<string, ShortProduct[]>
  >((acc, product) => {
    const category = product.categorySlug;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className={className}>
      <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2">
        Товары из той же истории
      </h2>

      {Object.entries(groupedProducts).map(([category, products]) => (
        <div key={category} className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 capitalize">
            {CATEGORY_SLUG_MAP[category] || category}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {products.map((shortProduct) => (
              <div key={shortProduct.id} className="w-full mb-5">
                <HorizontalProductCard shortProduct={shortProduct} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

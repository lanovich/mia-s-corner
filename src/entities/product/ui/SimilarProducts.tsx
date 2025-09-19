import React from "react";
import { HorizontalProductCard } from "./HorizontalProductCard";
import { Product } from "@/entities/product/model";
import { productsApi } from "@/entities/product/api";
import { CATEGORY_SLUG_MAP } from "@/entities/category/model";

interface Props {
  className?: string;
  historyId: number;
  productId: number;
}

export const SimilarProducts: React.FC<Props> = async ({
  className,
  historyId,
  productId,
}) => {
  const similarProducts = await productsApi.fetchSimilarProducts(
    historyId,
    productId
  );

  if (!similarProducts.length) {
    return null;
  }

  // Группируем товары по категориям
  const groupedProducts = similarProducts.reduce((acc, product) => {
    const category = product.category_slug;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof similarProducts>);

  return (
    <div className={className}>
      <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2">
        Товары из той же истории
      </h2>

      {/* Отображаем товары по категориям */}
      {Object.entries(groupedProducts).map(([category, products]) => (
        <div key={category} className="mb-8">
          {/* Заголовок категории */}
          <h3 className="text-2xl font-semibold mb-4 capitalize">
            {CATEGORY_SLUG_MAP[category] || category}
          </h3>

          {/* Список товаров */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {(products as Product[]).map((product) => (
              <div key={product.id} className="w-full mb-5">
                <HorizontalProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

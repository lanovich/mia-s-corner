import { CATEGORY_SLUG_MAP, CategoryProduct } from "@/entities/category/model";
import { ProductsByCategory } from "@/entities/product/model";

export interface CurrentProductResult {
  categorySlug: string;
  categoryName: string;
  product: CategoryProduct;
}

export const findCurrentProduct = (
  categorizedProducts: ProductsByCategory,
  productTitle: string | undefined | null
): CurrentProductResult[] => {
  if (!productTitle) return [];

  const searchTerm = productTitle.toLowerCase();

  return Object.entries(categorizedProducts).flatMap(
    ([categorySlug, products]) =>
      ы
        .filter((p) => p.product.title.toLowerCase() === searchTerm)
        .map((p) => ({
          categorySlug,
          categoryName: CATEGORY_SLUG_MAP[categorySlug] || categorySlug,
          product: p,
        }))
  );
};

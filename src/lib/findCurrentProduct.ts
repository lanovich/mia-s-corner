import { CATEGORY_SLUG_MAP } from "@/constants/categorySlugMap";
import {
  CategoryProduct,
  ProductsByCategory,
} from "./getProductsGroupedByCategory";

interface CurrentProductResult {
  categorySlug: string;
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
      products
        .filter((p) => p.product.title.toLowerCase() === searchTerm)
        .map((product) => ({ categorySlug, categoryName: CATEGORY_SLUG_MAP[categorySlug] || categorySlug, product }))
  );
};
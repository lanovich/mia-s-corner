import {
  Product,
  ProductWithHistory,
  ProductsByCategory,
} from "@/entities/product/model";
import { apiFetch, API_ROUTES } from "@/shared/api";

export const productsApi = {
  fetchAllProducts: () =>
    apiFetch<Product[]>(API_ROUTES.allProducts, { revalidate: 60 }),

  fetchAllGroupedProducts: () =>
    apiFetch<ProductsByCategory>(API_ROUTES.allGroupedProducts, {
      revalidate: 60,
    }),

  fetchProductsByCategory: (categoryId: number) =>
    apiFetch<Product[]>(API_ROUTES.productsByCategory(categoryId), {
      revalidate: 60,
    }),

  fetchProductsByHistory: (historyId: string) =>
    apiFetch<Product[]>(API_ROUTES.productsByHistory(historyId), {
      revalidate: 60,
    }),

  fetchProduct: (categorySlug: string, productSlug: string) =>
    apiFetch<ProductWithHistory | null>(
      API_ROUTES.product(categorySlug, productSlug),
      { revalidate: 60 }
    ),

  fetchSimilarProducts: (
    historyId: number,
    productId: number
  ) =>
    apiFetch<Product[]>(
      API_ROUTES.similarProducts(
        historyId,
        productId
      ),
      { revalidate: 60 }
    ),
};

import {
  Product,
  ProductWithHistory,
  ProductsByCategory,
} from "@/entities/product/model";
import { apiFetch, API } from "@/shared/api";

export const productsApi = {
  fetchAllProducts: () =>
    apiFetch<Product[]>(API.products.getProducts, { revalidate: 60 }),

  fetchAllGroupedProducts: () =>
    apiFetch<ProductsByCategory>(API.products.getGroupedProducts, {
      revalidate: 60,
    }),

  fetchProductsByCategory: (categoryId: number) =>
    apiFetch<Product[]>(API.products.getProductsByCategory(categoryId), {
      revalidate: 60,
    }),

  fetchProductsByHistory: (historyId: string) =>
    apiFetch<Product[]>(API.products.getProductsByHistory(historyId), {
      revalidate: 60,
    }),

  fetchProduct: (categorySlug: string, productSlug: string) =>
    apiFetch<ProductWithHistory | null>(
      API.products.getProduct(categorySlug, productSlug),
      { revalidate: 60 }
    ),

  fetchSimilarProducts: (historyId: number, productId: number) =>
    apiFetch<Product[]>(API.products.getSimilarProducts(historyId, productId), {
      revalidate: 60,
    }),
};

import {
  GroupedShortProducts,
  Product,
  ShortProduct,
} from "@/entities/product/model";
import { apiFetch, API } from "@/shared/api";

export const productsApi = {
  fetchAllProducts: () =>
    apiFetch<ShortProduct[]>(API.products.getProducts, { revalidate: 60 }),

  fetchAllGroupedProducts: () =>
    apiFetch<GroupedShortProducts[]>(API.products.getGroupedProducts, {
      revalidate: 60,
    }),

  fetchProductsByCategory: (categoryId: number) =>
    apiFetch<ShortProduct[]>(API.products.getProductsByCategory(categoryId), {
      revalidate: 60,
    }),

  fetchProductsByHistory: (historyId: string) =>
    apiFetch<ShortProduct[]>(API.products.getProductsByHistory(historyId), {
      revalidate: 0,
    }),

  fetchProduct: (categorySlug: string, productSlug: string) =>
    apiFetch<Product>(API.products.getProduct(categorySlug, productSlug), {
      revalidate: 60,
    }),

  fetchSimilarProducts: (historyId: number, productId: number) =>
    apiFetch<ShortProduct[]>(
      API.products.getSimilarProducts(historyId, productId),
      {
        revalidate: 60,
      }
    ),

  searchProduct: (query: string, category?: string) =>
    apiFetch<ShortProduct[]>(API.products.searchProduct(query, category), {
      revalidate: 60,
    }),
};

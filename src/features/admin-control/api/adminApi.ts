import { API_ROUTES, apiFetch } from "@/shared/api";
import { FinalResult } from "../model";
import { Size, SizeDetails } from "@/entities/product/model";

export const adminApi = {
  fetchSummary: () => apiFetch<FinalResult>(API_ROUTES.adminProductsSummary),

  fetchSizes: () => apiFetch<Size[]>(API_ROUTES.sizes),

  fetchSizesByCategoryName: (categorySlug: string) =>
    apiFetch<Size[]>(API_ROUTES.sizesByCategory(categorySlug)),

  updateProductSize: (payload: SizeDetails) =>
    apiFetch(API_ROUTES.adminProductSizes, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  updateProductDescription: (payload: {
    productId: number;
    description: string;
  }) =>
    apiFetch(API_ROUTES.adminProductUpdateDescription, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  addProductSize: (payload: { productId: number; sizeId: number | string }) =>
    apiFetch(API_ROUTES.adminProductSizeAdd, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};

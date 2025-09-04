import { API, apiFetch } from "@/shared/api";
import { FinalResult } from "../model";
import { Size, SizeDetails } from "@/entities/product/model";

export const adminApi = {
  fetchSummary: () => apiFetch<FinalResult>(API.admin.getProductSummary),

  fetchSizes: () => apiFetch<Size[]>(API.sizes.getSizes),

  fetchSizesByCategoryName: (categoryName: string) =>
    apiFetch<Size[]>(API.sizes.getSizesByCategory(categoryName)),

  updateProductSize: (payload: SizeDetails) =>
    apiFetch(API.admin.updateProductSize, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  updateProductDescription: (payload: {
    productId: number;
    description: string;
  }) =>
    apiFetch(API.admin.updateDescription, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  addProductSize: (payload: { productId: number; sizeId: number | string }) =>
    apiFetch(API.admin.addProductSize, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};

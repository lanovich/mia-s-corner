import { GroupedFullProducts, Product, Size } from "@/entities/product/model";
import { API, apiFetch } from "@/shared/api";
import { TotalsResponse } from "../model";
import { ProductOption } from "../ui/SelectProductField";
export interface SizeDetails {
  productSizeId: number;
  price?: number;
  oldPrice?: number;
  quantity?: number;
  isDefault?: boolean;
  size?: number;
  timeOfExploitation?: string;
  dimensions?: string;
}

export interface AddProductSizePayload {
  productId: number;
  sizeId: number;
}

export interface UpdateDescriptionPayload {
  productId: number;
  description: string;
}

export const adminApi = {
  fetchTotals: () => apiFetch<TotalsResponse>(API.admin.totals),

  fetchProductOptions: () => apiFetch<ProductOption[]>(API.admin.options),

  fetchFullProductById: (id: number) =>
    apiFetch<Product>(API.admin.productById(id)),

  fetchGroupedProducts: () =>
    apiFetch<GroupedFullProducts[]>(API.admin.groupedFullProducts),

  fetchSizes: () => apiFetch<Size[]>(API.sizes.getSizes),

  fetchSizesByCategoryName: (categoryName: string) =>
    apiFetch<Size[]>(API.sizes.getSizesByCategory(categoryName)),

  updateProductSize: (payload: SizeDetails) =>
    apiFetch(API.admin.updateProductSize, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  updateProductDescription: (payload: UpdateDescriptionPayload) =>
    apiFetch(API.admin.updateDescription, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  addProductSize: (payload: AddProductSizePayload) =>
    apiFetch(API.admin.addProductSize, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};

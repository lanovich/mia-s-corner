import { SizeDetails } from "@/lib/getProductsGroupedByCategory";
import { ProductOption, CategoryOption } from "@/types";
import { create } from "zustand";

interface AdminStore {
  selectedProduct: ProductOption | null;
  selectedCategory: CategoryOption | null;
  selectedSize: SizeDetails | null;
  setSelectedProduct: (product: ProductOption | null) => void;
  setSelectedCategory: (category: CategoryOption | null) => void;
  setSelectedSize: (size: SizeDetails | null) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  selectedProduct: null,
  selectedCategory: null,
  selectedSize: null,
  setSelectedProduct: (selectedProduct) =>
    set({
      selectedProduct,
      selectedSize: null,
    }),
  setSelectedCategory: (selectedCategory) =>
    set({
      selectedCategory,
      selectedSize: null,
    }),
  setSelectedSize: (selectedSize) => set({ selectedSize }),
}));

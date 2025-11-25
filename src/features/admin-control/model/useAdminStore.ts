import { create } from "zustand";
import { ProductOption } from "../ui/SelectProductField";
import { CategoryOption } from "@/entities/category/model";
import { ProductSize } from "@/entities/product/model";

interface AdminStore {
  selectedProductOption: ProductOption | null;
  selectedCategory: CategoryOption | null;
  selectedSize: ProductSize | null;
  setSelectedProductOption: (product: ProductOption | null) => void;
  setSelectedCategory: (category: CategoryOption | null) => void;
  setSelectedSize: (size: ProductSize | null) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  selectedProductOption: null,
  selectedCategory: null,
  selectedSize: null,
  setSelectedProductOption: (selectedProductOption) =>
    set({
      selectedProductOption,
      selectedSize: null,
    }),
  setSelectedCategory: (selectedCategory) =>
    set({
      selectedCategory,
      selectedSize: null,
    }),
  setSelectedSize: (selectedSize) => set({ selectedSize }),
}));

import { create } from "zustand";
import { CategoryWithProducts } from "@/entities/category/model";
import { getCategoriesWithProducts } from "../api";

interface CategoriesWithProductsStore {
  categoriesWithProducts: CategoryWithProducts[] | null;
  fetchCategories: () => Promise<void>;
}

export const useCategories = create<CategoriesWithProductsStore>()((set) => ({
  categoriesWithProducts: null,
  fetchCategories: async () => {
    try {
      const data = await getCategoriesWithProducts();
      set({ categoriesWithProducts: data });
    } catch (error) {
      console.error("Ошибка при загрузке категорий:", error);
    }
  },
}));

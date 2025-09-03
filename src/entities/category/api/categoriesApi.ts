import { Category, CategoryWithProducts } from "@/entities/category/model";
import { apiFetch, API } from "@/shared/api";

export const categoriesApi = {
  fetchCategories: () =>
    apiFetch<Category[]>(API.categories.getCategories, { revalidate: 60 }),

  fetchCategoriesWithProducts: () =>
    apiFetch<CategoryWithProducts[]>(API.categories.getCategoriesWithProducts, {
      revalidate: 60,
    }),

  fetchCategoryBySlug: (slug?: string) => {
    if (!slug || isNaN(Number(slug))) return null;

    return apiFetch<string | null>(API.categories.getCategoryBySlug(slug), {
      revalidate: 60,
    });
  },
};

import { Category, CategoryWithProducts } from "@/entities/category/model";
import { apiFetch, API_ROUTES } from "@/shared/api";

export const categoriesApi = {
  fetchCategories: () =>
    apiFetch<Category[]>(API_ROUTES.categories, { revalidate: 60 }),

  fetchCategoriesWithProducts: () =>
    apiFetch<CategoryWithProducts[]>(API_ROUTES.categoriesWithProducts, {
      revalidate: 60,
    }),
    
  fetchCategoryBySlug: (slug?: string) => {
    if (!slug || isNaN(Number(slug))) return null;

    return apiFetch<string | null>(API_ROUTES.categoryBySlug(slug), {
      revalidate: 60,
    });
  },
};

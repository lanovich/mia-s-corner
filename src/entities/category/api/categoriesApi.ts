import { Category } from "@/entities/category/model";
import { apiFetch, API } from "@/shared/api";

export const categoriesApi = {
  fetchCategories: () =>
    apiFetch<Category[]>(API.categories.getCategories, { revalidate: 60 }),
};

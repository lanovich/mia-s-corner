import { cache } from "react";
import { supabase } from "@/lib/supabase";
import { CategoryWithProducts } from "@/types";

export const getCategoriesWithProducts = cache(async (limit?: number): Promise<CategoryWithProducts[]> => {
  console.log("Запрос на категории")
  let query = supabase.from("categories").select("id, name");

  if (limit) {
    query = query.limit(limit);
  }

  const { data: categories, error } = await query;

  if (error) {
    console.error("Ошибка при загрузке категорий:", error);
    return [];
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*");

  if (productsError) {
    console.error("Ошибка при загрузке продуктов:", productsError);
    return [];
  }

  return categories.map((category) => ({
    ...category,
    products: products.filter((product) => product.category_id === category.id),
  }));
});

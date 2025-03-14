import { supabase } from "@/lib/supabase";
import { CategoryWithProducts } from "@/types";

export const getCategoriesWithProducts = async (): Promise<
  CategoryWithProducts[]
> => {
  console.log("🔄 Запрос категорий с товарами...");

  const { data, error } = await supabase
    .from("categories")
    .select("*, products:products!category_id(*, sizes:sizes!product_id(*))")
    .order("order");

  if (error) {
    console.error("❌ Ошибка загрузки категорий с товарами:", error);
    return [];
  }

  console.log("Загрузка категорий с продуктами");

  return data.map((category: CategoryWithProducts) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    order: category.order,
    products: category.products.slice(0, 10),
  }));
};

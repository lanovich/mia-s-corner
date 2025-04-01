import { supabase } from "./supabase";

export const getAllProductsWithCategories = async (): Promise<
  Array<Product>
> => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories!category_id(slug)
    `
    )
    .not("category.slug", "is", null);

  if (error) {
    console.error("❌ Ошибка загрузки товаров:", error);
    return [];
  }

  return data.map((product) => ({
    ...product,
    category_slug: product.category.slug,
  }));
};

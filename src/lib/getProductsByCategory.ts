import { supabase } from "@/lib/supabase";

export const getProductsByCategory = async (
  categoryId: number
): Promise<Product[]> => {
  console.log(`🔄 Запрос продуктов для категории ${categoryId}...`);

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_sizes:product_sizes!product_id(
        *,
        size:size_id(id, size, time_of_exploitation, dimensions)
      )
    `
    )
    .eq("category_id", categoryId);

  if (error) {
    console.error(`❌ Ошибка загрузки товаров категории ${categoryId}:`, error);
    return [];
  }

  const formattedData = data.sort((a, b) => a.episode_number - b.episode_number).map((product: Product) => ({
    ...product,
    product_sizes: product.product_sizes.map((productSize) => ({
      ...productSize,
      size: productSize.size,
    })),
  }));

  return formattedData;
};

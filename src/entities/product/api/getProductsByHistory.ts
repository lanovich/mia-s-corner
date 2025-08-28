import { Product } from "@/entities/product/model";
import { supabase } from "@/shared/api/supabase/client";

export const getProductsByHistory = async (
  historyId: number
): Promise<Product[]> => {
  console.log(`🔄 Запрос продуктов для истории ${historyId}...`);

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
    .eq("history_id", historyId)
    .order("episode_number");

  if (error) {
    console.error(`❌ Ошибка загрузки товаров истории ${historyId}:`, error);
    return [];
  }

  const formattedData = data.map((product: Product) => ({
    ...product,
    product_sizes: product.product_sizes.map((productSize) => ({
      ...productSize,
      size: productSize.size,
    })),
  }));

  return formattedData;
};

import { Product } from "@/entities/product/model";
import { supabase } from "@/shared/api/supabase/client";

export const getSimilarProducts = async (
  historyId: number,
  productId: number
): Promise<Product[]> => {
  console.log(
    `🔄 Запрос товаров из той же истории, исключая productId: ${productId}`
  );

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_sizes:product_sizes!product_id(
        *, size:size_id(id, size, time_of_exploitation, dimensions)),
      history:histories(id, title, description)
    `
    )
    .eq("history_id", historyId)
    .neq("id", productId)
    .order("category_id")
    .order("episode_number");

  if (error) {
    console.error(`❌ Ошибка загрузки товаров из той же истории:`, error);
    return [];
  }

  return data;
};

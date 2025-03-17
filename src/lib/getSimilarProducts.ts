import { supabase } from "./supabase";

export const getSimilarProducts = async (historyId: number) => {
  console.log(`🔄 Запрос товаров из той же истории:`);

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
    .eq("history_id", historyId);

  if (error) {
    console.error(`❌ Ошибка загрузки товаров из той же истории:`, error);
    return [];
  }

  return data;
};

import { supabase } from "@/lib/supabase";

export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  console.log(`🔄 Запрос продуктов для категории ${categoryId}...`);
  
  const { data, error } = await supabase
    .from("products")
    .select("*, sizes:sizes!product_id(*)")
    .eq("category_id", categoryId);

  if (error) {
    console.error(`❌ Ошибка загрузки товаров категории ${categoryId}:`, error);
    return [];
  }

  return data;
};

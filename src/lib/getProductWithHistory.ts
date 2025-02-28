import { ProductWithHistory } from "@/types";
import { supabase } from "./supabase";

export const getProductWithHistory = async (
  categorySlug: string,
  productSlug: string
): Promise<ProductWithHistory | null> => {
  console.log(`🔄 Запрос товара с историей:`);
  const { data, error } = await supabase
    .from("products")
    .select("*, history:histories!inner(id, title, description)")
    .eq("slug", productSlug)
    .eq("category_slug", categorySlug)
    .maybeSingle();

  if (error) {
    console.error(`❌ Ошибка загрузки товара с историей:`, error);
    return null;
  }

  return data;
};

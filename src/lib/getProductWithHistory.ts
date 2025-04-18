import { ProductWithHistory } from "@/types";
import { supabase } from "./supabase";

export const getProductWithHistory = async (
  categorySlug: string,
  productSlug: string
): Promise<ProductWithHistory | null> => {
  console.log(`🔄 Запрос товара с историей и деталями:`);

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_sizes:product_sizes!product_id(
        *, size:size_id(id, size, time_of_exploitation, dimensions)
      ),
      history:histories(id, title, description, imageUrl),
      product_detail_links:product_detail_links(
        details:product_details(details)
      )
    `
    )
    .eq("slug", productSlug)
    .eq("category_slug", categorySlug)
    .maybeSingle();

  if (error) {
    console.error(`❌ Ошибка загрузки товара с историей и деталями:`, error);
    return null;
  }

  if (data) {
    return {
      ...data,
      details: data?.product_detail_links[0]?.details?.details || null,
    };
  }

  return null;
};

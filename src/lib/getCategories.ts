import { cache } from "react";
import { supabase } from "@/lib/supabase";

export const getCategories = cache(async (): Promise<Category[]> => {
  console.log("🔄 Запрос категорий в Supabase...");
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image, order");

  if (error) {
    console.error("❌ Ошибка загрузки категорий:", error);
    return [];
  }

  return data.sort((a, b) => a["order"] - b["order"]);
});

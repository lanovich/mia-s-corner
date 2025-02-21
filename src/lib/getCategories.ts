import { cache } from "react";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types";

export const getCategories = cache(async (): Promise<Category[]> => {
  console.log("🔄 Запрос категорий в Supabase...");
  const { data, error } = await supabase.from("categories").select("id, name");

  if (error) {
    console.error("❌ Ошибка загрузки категорий:", error);
    return [];
  }

  return data;
});

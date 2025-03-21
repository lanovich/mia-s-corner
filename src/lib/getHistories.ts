import { cache } from "react";
import { supabase } from "@/lib/supabase";

export const getHistories = cache(async (): Promise<HistoryData[]> => {
  console.log("🔄 Запрос категорий в Supabase...");
  const { data, error } = await supabase.from("histories").select("*");

  if (error) {
    console.error("❌ Ошибка загрузки категорий:", error);
    return [];
  }

  return data.sort((a, b) => a["order"] - b["order"]);
});

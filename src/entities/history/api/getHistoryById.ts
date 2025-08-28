import { HistoryData } from "@/entities/history/model";
import { supabase } from "@/shared/api/supabase/client";

export const getHistoryById = async (
  id: number
): Promise<HistoryData | null> => {
  const { data, error } = await supabase
    .from("histories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`❌ Ошибка загрузки истории с ID ${id}:`, error);
    return null;
  }

  return data;
};

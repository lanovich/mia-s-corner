import { HistoryData } from "@/entities/history/model";
import { supabase } from "@/shared/api/supabase/server";

export async function getHistories(): Promise<HistoryData[]> {
  const { data, error } = await supabase.from("histories").select("*");

  if (error) throw new Error(error.message);

  return (data ?? []).sort((a, b) => a.order - b.order);
}

import { supabase } from "@/shared/api/supabase/client";

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Ошибка получения категории:", error);
    return null;
  }

  return data ? data.name : null;
}

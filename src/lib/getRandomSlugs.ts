import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export interface SlugType {
  category_slug: string;
  slug: string;
}

export const getRandomSlugs = async (): Promise<SlugType[] | null> => {
  console.log("Загрузка всех slugs");
  const {
    data: slugs,
    error,
  }: { data: SlugType[] | null; error: PostgrestError | null } = await supabase
    .from("products")
    .select("slug, category_slug");

  if (error) {
    console.log("Ошибка получения slugs", error);
  }

  return slugs;
};

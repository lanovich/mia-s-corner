import { supabase } from "@/lib/supabase";
import { CategoryWithProducts } from "@/types";

export async function getCategoriesWithProducts(): Promise<
  CategoryWithProducts[]
> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, products(*)")
    .limit(10, { foreignTable: "products" });
    
    if (error) {
      console.error("Ошибка при загрузке категорий:", error);
      return [];
    }
    
    console.log(data)
  return data;
}

import { supabase } from "./supabase";

export const getSizesByCategory = async (
  categoryName: string
): Promise<Size[]> => {
  const { data, error } = await supabase
    .from("sizes")
    .select("*")
    .eq("category_name", categoryName);

  if (error) {
    console.error("Error fetching sizes:", error.message);
    return [];
  }

  return data as Size[];
};

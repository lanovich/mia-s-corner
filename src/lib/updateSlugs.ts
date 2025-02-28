import slugify from "slugify";
import { supabase } from "./supabase";

export async function updateSlugs() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, title");

  if (error) {
    console.error("Ошибка загрузки продуктов:", error);
    return;
  }

  for (const product of products) {
    const slug = slugify(product.title, {
      lower: true,
      strict: true,
      locale: "ru",
    });

    await supabase.from("products").update({ slug }).eq("id", product.id);
    console.log(`Обновлен slug для ${product.title}: ${slug}`);
  }
}
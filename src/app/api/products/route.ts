import { NextRequest } from "next/server";
import { supabase } from "@/shared/api/supabase/server";
import { Product } from "@/entities/product/model";

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories!category_id(slug)
      `
      )
      .not("category.slug", "is", null);

    if (error) {
      console.error("❌ Ошибка загрузки продуктов:", error);
      return new Response(
        JSON.stringify({ error: "Ошибка загрузки продуктов" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const products: Product[] = data.map((product) => ({
      ...product,
      category_slug: product.category.slug,
    }));

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Ошибка в API /products:", err);
    return new Response(JSON.stringify({ error: "Серверная ошибка" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

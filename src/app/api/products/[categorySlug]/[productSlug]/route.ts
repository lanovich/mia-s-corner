import { NextRequest } from "next/server";
import { supabase } from "@/shared/api/supabase/server";
import { ProductWithHistory } from "@/entities/product/model";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ categorySlug: string; productSlug: string }> }
) {
  const { categorySlug, productSlug } = await context.params;

  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories!category_slug(
          id,
          name,
          slug
        ),
        product_sizes:product_sizes!product_id(
          *, size:size_id(id, size, time_of_exploitation, dimensions)
        ),
        history:histories(id, title, description, imageUrl),
        product_detail_links:product_detail_links(
          details:product_details(details)
        )
      `
      )
      .eq("slug", productSlug)
      .eq("category_slug", categorySlug)
      .maybeSingle();

    if (error) {
      console.error(`❌ Ошибка загрузки товара с историей и деталями:`, error);
      return new Response(
        JSON.stringify({ error: "Ошибка загрузки продукта" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!data) {
      return new Response(JSON.stringify(null), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const product: ProductWithHistory = {
      ...data,
      details: data.product_detail_links?.[0]?.details?.details || null,
      category_name: data.category?.name || null,
    };

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Серверная ошибка при загрузке продукта:", err);
    return new Response(JSON.stringify({ error: "Серверная ошибка" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

import { NextRequest } from "next/server";
import { supabase } from "@/shared/api/supabase/server";
import { Product } from "@/entities/product/model";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string }> }
) {
  const categoryId = Number((await context.params).categoryId);

  if (isNaN(categoryId)) {
    return new Response(JSON.stringify({ error: "Неверный categoryId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_sizes:product_sizes!product_id(
          *, size:size_id(id, size, time_of_exploitation, dimensions)
        )
      `
      )
      .eq("category_id", categoryId);

    if (error) {
      console.error(
        `❌ Ошибка загрузки продуктов категории ${categoryId}:`,
        error
      );
      return new Response(
        JSON.stringify({
          error: `Ошибка загрузки продуктов категории ${categoryId}`,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const formattedData = (data ?? [])
      .sort((a, b) => (a.episode_number || 0) - (b.episode_number || 0))
      .map((product: Product) => ({
        ...product,
        product_sizes: product.product_sizes.map((productSize) => ({
          ...productSize,
          size: productSize.size,
        })),
      }));

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(
      `❌ Серверная ошибка при загрузке продуктов категории ${categoryId}:`,
      err
    );
    return new Response(JSON.stringify({ error: "Серверная ошибка" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

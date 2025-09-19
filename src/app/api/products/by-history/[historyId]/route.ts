import { NextRequest } from "next/server";
import { supabase } from "@/shared/api/supabase/server";
import { Product } from "@/entities/product/model";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ historyId: string }> }
) {
  const { historyId } = await context.params;

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
      .eq("history_id", historyId)
      .order("episode_number");

    if (error) {
      console.error(
        `❌ Ошибка загрузки продуктов истории ${historyId}:`,
        error
      );
      return new Response(
        JSON.stringify({
          error: `Ошибка загрузки продуктов истории ${historyId}`,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const formattedData = (data ?? []).map((product: Product) => ({
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
      `❌ Серверная ошибка при загрузке продуктов истории ${historyId}:`,
      err
    );
    return new Response(JSON.stringify({ error: "Серверная ошибка" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

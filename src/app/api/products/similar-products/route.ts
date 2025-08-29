import { NextRequest } from "next/server";
import { supabase } from "@/shared/api/supabase/server";
import { Product } from "@/entities/product/model";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const historyId = Number(url.searchParams.get("historyId"));
    const productId = Number(url.searchParams.get("productId"));

    if (!historyId || !productId) {
      return new Response(
        JSON.stringify({ error: "Не переданы historyId или productId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_sizes:product_sizes!product_id(
          *, size:size_id(id, size, time_of_exploitation, dimensions)
        ),
        history:histories(id, title, description)
      `
      )
      .eq("history_id", historyId)
      .neq("id", productId)
      .order("category_id")
      .order("episode_number");

    if (error) {
      console.error(`❌ Ошибка загрузки похожих продуктов:`, error);
      return new Response(
        JSON.stringify({ error: "Ошибка загрузки похожих продуктов" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data ?? []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Серверная ошибка при загрузке похожих продуктов:", err);
    return new Response(JSON.stringify({ error: "Серверная ошибка" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

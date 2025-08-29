import { NextRequest } from "next/server";
import { supabase } from "@/shared/api/supabase/server";
import { Size } from "@/entities/product/model";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ categoryName: string }> }
) {
  const { categoryName } = await context.params;

  try {
    const { data, error } = await supabase
      .from("sizes")
      .select("*")
      .eq("category_name", categoryName);

    if (error) {
      console.error(
        `❌ Ошибка загрузки размеров для категории "${categoryName}":`,
        error.message
      );
      return new Response(
        JSON.stringify({ error: "Ошибка загрузки размеров" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data ?? []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`❌ Ошибка в API /sizes/by-category/${categoryName}:`, err);
    return new Response(JSON.stringify({ error: "Серверная ошибка" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

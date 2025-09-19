import { NextRequest } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, sizeId } = body;

    if (!productId || !sizeId) {
      return new Response(
        JSON.stringify({ error: "Missing productId or sizeId" }),
        { status: 400 }
      );
    }

    const { error } = await supabase.from("product_sizes").insert({
      product_id: productId,
      size_id: Number(sizeId),
      is_default: false,
      price: 0,
      quantity_in_stock: 0,
    });

    if (error) {
      console.error("Ошибка при добавлении размера:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

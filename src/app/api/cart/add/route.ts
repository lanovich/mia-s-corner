import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  const { productId, sizeId } = await req.json();

  const { error } = await supabase.rpc("add_to_cart", {
    p_token: token,
    p_product_id: productId,
    p_size_id: sizeId,
  });

  if (error) {
    console.error("Ошибка при добавлении в корзину:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

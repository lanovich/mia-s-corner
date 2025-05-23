import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  const { data: cart, error: cartError } = await supabase
    .from("cart")
    .select("id")
    .eq("token", token)
    .maybeSingle();

  if (cartError || !cart) {
    return NextResponse.json({ error: "Корзина не найдена" }, { status: 404 });
  }

  const { error } = await supabase
    .from("cartItem")
    .delete()
    .eq("cart_id", cart.id);

  if (error) {
    console.error("Ошибка при очистке корзины:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

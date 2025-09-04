import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Token not found" }, { status: 401 });
  }

  const { productId, sizeId } = await req.json();

  const { data: cart, error: cartError } = await supabase
    .from("cart")
    .select("id")
    .eq("token", token)
    .maybeSingle();

  if (cartError || !cart) {
    return NextResponse.json({ error: "Корзина не найдена" }, { status: 404 });
  }

  const cartId = cart.id;

  const { data: cartItem, error: itemError } = await supabase
    .from("cartItem")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .eq("size_id", sizeId)
    .maybeSingle();

  if (itemError || !cartItem) {
    return NextResponse.json(
      { error: "Товар не найден в корзине" },
      { status: 404 }
    );
  }

  if (cartItem.quantity <= 1) {
    const { error: deleteError } = await supabase
      .from("cartItem")
      .delete()
      .eq("id", cartItem.id);

    if (deleteError) {
      console.error("Ошибка при удалении товара:", deleteError.message);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Товар удалён" });
  } else {
    const { error: updateError } = await supabase
      .from("cartItem")
      .update({ quantity: cartItem.quantity - 1 })
      .eq("id", cartItem.id);

    if (updateError) {
      console.error("Ошибка при обновлении количества:", updateError.message);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Количество уменьшено" });
  }
}

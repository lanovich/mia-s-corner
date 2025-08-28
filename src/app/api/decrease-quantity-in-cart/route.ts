import { supabase } from "@/shared/api/supabase/client/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, productId, sizeId } = await req.json();

  if (!token || !productId || !sizeId) {
    return NextResponse.json({ error: "Недостаточно данных" });
  }

  try {
    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("id")
      .eq("token", token)
      .maybeSingle();

    if (cartError || !cart) {
      return NextResponse.json({ error: "Корзина не найдена" });
    }

    const cartId = cart.id;

    const { data: existingItem, error: itemError } = await supabase
      .from("cartItem")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .eq("size_id", sizeId)
      .maybeSingle();

    if (itemError || !existingItem) {
      return NextResponse.json({ error: "Товар не найден в корзине" });
    }

    if (existingItem.quantity > 1) {
      const { error: updateError } = await supabase
        .from("cartItem")
        .update({ quantity: existingItem.quantity - 1 })
        .eq("id", existingItem.id);

      if (updateError) {
        return NextResponse.json({ error: "Ошибка при обновлении количества" });
      }
    } else {
      const { error: deleteError } = await supabase
        .from("cartItem")
        .delete()
        .eq("id", existingItem.id);

      if (deleteError) {
        return NextResponse.json({ error: "Ошибка при удалении товара" });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при уменьшении количества товара:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" });
  }
}

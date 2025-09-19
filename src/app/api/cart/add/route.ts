import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  const { productId, sizeId, delta } = await req.json();

  try {
    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("id")
      .eq("token", token)
      .maybeSingle();

    if (cartError || !cart) {
      console.error("Cart not found:", cartError?.message);
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const cartId = cart.id;

    const { data: cartItem, error: itemError } = await supabase
      .from("cartItem")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .eq("size_id", sizeId)
      .maybeSingle();

    if (itemError) {
      console.error("Ошибка при получении товара:", itemError.message);
      return NextResponse.json({ error: itemError.message }, { status: 500 });
    }

    let newQuantity = delta;

    if (cartItem) {
      newQuantity = cartItem.quantity + delta;
    }

    if (newQuantity > 0) {
      if (cartItem) {
        const { error: updateError } = await supabase
          .from("cartItem")
          .update({ quantity: newQuantity })
          .eq("id", cartItem.id);

        if (updateError) {
          console.error(
            "Ошибка при обновлении количества:",
            updateError.message
          );
          return NextResponse.json(
            { error: updateError.message },
            { status: 500 }
          );
        }
      } else {
        const { error: insertError } = await supabase.from("cartItem").insert({
          cart_id: cartId,
          product_id: productId,
          size_id: sizeId,
          quantity: newQuantity,
        });

        if (insertError) {
          console.error("Ошибка при добавлении товара:", insertError.message);
          return NextResponse.json(
            { error: insertError.message },
            { status: 500 }
          );
        }
      }
    } else if (cartItem) {
      const { error: deleteError } = await supabase
        .from("cartItem")
        .delete()
        .eq("id", cartItem.id);

      if (deleteError) {
        console.error("Ошибка при удалении товара:", deleteError.message);
        return NextResponse.json(
          { error: deleteError.message },
          { status: 500 }
        );
      }

      newQuantity = 0;
    }

    const { data, error } = await supabase
      .from("products")
      .select(`*, product_sizes:product_sizes!product_id(*, size:size_id(*))`)
      .eq("id", productId)
      .single();

    if (error || !data) {
      console.error("Ошибка при получении товара:", error?.message);
      return NextResponse.json({ error: error?.message }, { status: 500 });
    }

    const product = {
      ...data,
      sizes: data.product_sizes.map((ps: any) => ({
        ...ps.size,
        price: ps.price,
        oldPrice: ps.oldPrice,
        is_default: ps.is_default,
      })),
    };

    return NextResponse.json({
      newItem: {
        product,
        size_id: sizeId,
        quantity: newQuantity,
      },
    });
  } catch (err: any) {
    console.error("Unexpected error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

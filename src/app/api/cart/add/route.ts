import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  const { productId, sizeId } = await req.json();

  const { error: rpcError } = await supabase.rpc("add_to_cart", {
    p_token: token,
    p_product_id: productId,
    p_size_id: sizeId,
  });

  if (rpcError) {
    console.error("Ошибка при добавлении в корзину:", rpcError.message);
    return NextResponse.json({ error: rpcError.message }, { status: 500 });
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

  const { data: cart, error: cartError } = await supabase
    .from("cart")
    .select("id")
    .eq("token", token)
    .single();

  if (cartError || !cart) {
    console.error("Ошибка при получении cart_id:", cartError?.message);
    return NextResponse.json(
      { error: cartError?.message || "Cart not found" },
      { status: 500 }
    );
  }

  const { data: cartItem, error: itemError } = await supabase
    .from("cartItem")
    .select("quantity")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .eq("size_id", sizeId)
    .single();

  if (itemError) {
    console.error("Ошибка при получении количества:", itemError.message);
    return NextResponse.json({ error: itemError.message }, { status: 500 });
  }

  const product = {
    ...data,
    sizes: data.product_sizes.map((ps: any) => ({
      ...ps.size,
      price: ps.price,
      oldPrice: ps.oldPrice,
      quantity_in_stock: ps.quantity_in_stock,
      is_default: ps.is_default,
    })),
  };

  return NextResponse.json({
    newItem: {
      product: product,
      size_id: sizeId,
      quantity: cartItem.quantity ?? 1,
    },
  });
}

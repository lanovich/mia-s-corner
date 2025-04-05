import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) return NextResponse.json([]);

  const { data, error } = await supabase
    .from("cart")
    .select(
      `
      id,
      cartItems:cartItem(
        id, quantity, size_id,
        product:products(
          id, title, history_id, category_id, compound, slug, category_slug,
          scent_pyramid, description, images, measure, episode,
          product_sizes:product_sizes!product_id(
            *, size:size_id(*)
          )
        )
      )
    `
    )
    .eq("token", token)
    .single();

  if (error || !data) {
    console.error("Ошибка при загрузке корзины:", error?.message);
    return NextResponse.json([], { status: 500 });
  }

  const items =
    data.cartItems?.map((item: any) => {
      const product = Array.isArray(item.product)
        ? item.product[0]
        : item.product;
      return {
        size_id: item.size_id,
        quantity: item.quantity,
        product: product
          ? {
              ...product,
              product_sizes: product.product_sizes.map((productSize: any) => ({
                ...productSize.size,
                price: productSize.price,
                oldPrice: productSize.oldPrice,
                quantity_in_stock: productSize.quantity_in_stock,
                is_default: productSize.is_default,
              })),
            }
          : {
              id: null,
              title: "",
              history_id: null,
              category_id: null,
              compound: "",
              slug: "",
              category_slug: "",
              scent_pyramid: "",
              description: "",
              images: [],
              episode_number: null,
              product_sizes: [],
              episode: "",
              measure: "мл",
            },
      };
    }) || [];

  return NextResponse.json(items);
}

import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const { data, error } = await supabase.rpc("get_random_product");
  const product = data?.[0];

  if (error) {
    console.error("Ошибка получения случайного продукта:", error);
  }

  const redirectUrl = product
    ? `${baseUrl}/catalog/${product.category_slug}/product/${product.slug}`
    : `${baseUrl}/catalog/candles/product/mgnovenie-pod-dozhdyom-iz-lepestkov-cvetushej-sakury`;

  return NextResponse.redirect(redirectUrl);
}

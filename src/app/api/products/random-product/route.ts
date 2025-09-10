import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  const res = await supabase.rpc("get_random_product");
  const product = res.data?.[0];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const redirectUrl = product
    ? `${baseUrl}/catalog/${product.category_slug}/product/${product.slug}`
    : `${baseUrl}/catalog/candles/product/mgnovenie-pod-dozhdyom-iz-lepestkov-cvetushej-sakury`;

  return NextResponse.redirect(redirectUrl, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
    },
  });
}

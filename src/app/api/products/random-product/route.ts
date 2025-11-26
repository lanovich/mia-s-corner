import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const products: { slug: string; category_slug: string }[] =
      await prisma.$queryRaw`
      SELECT 
        p.slug AS slug,
        c.slug AS category_slug
      FROM "Product" p
      JOIN "Category" c ON c.id = p."categoryId"
      ORDER BY RANDOM()
      LIMIT 1
    `;

    const product = products[0] ?? null;

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
  } catch (error) {
    console.error("❌ Ошибка получения случайного продукта:", error);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/candles/product/mgnovenie-pod-dozhdyom-iz-lepestkov-cvetushej-sakury`
    );
  }
}

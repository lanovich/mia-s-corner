import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";
import { baseProductWithDetailsQuery, ProductRaw } from "@/shared/api/queries";
import { normalizeProduct } from "@/entities/product/model/transformers";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ categorySlug: string; productSlug: string }> }
) {
  const { categorySlug, productSlug } = await context.params;

  try {
    const raw: ProductRaw | null = await prisma.product.findFirst({
      where: {
        slug: productSlug,
        category: { slug: categorySlug },
      },
      ...baseProductWithDetailsQuery,
    });

    if (!raw) {
      return NextResponse.json(null, { status: 404 });
    }

    const normalizedProduct = normalizeProduct(raw);

    return NextResponse.json(normalizedProduct, { status: 200 });
  } catch (err) {
    console.error("❌ Ошибка при получении продукта:", err);
    return NextResponse.json({ error: "Серверная ошибка" }, { status: 500 });
  }
}

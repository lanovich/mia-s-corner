import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";
import { baseProductWithDetailsQuery } from "@/shared/api/queries";
import { mapRawToShortProduct } from "@/entities/product/model";
import type { ShortProduct } from "@/entities/product/model";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const historyId = Number(url.searchParams.get("historyId"));
    const productId = Number(url.searchParams.get("productId"));

    if (!historyId || !productId) {
      return NextResponse.json(
        { error: "Не переданы historyId или productId" },
        { status: 400 }
      );
    }

    const rawProducts = await prisma.product.findMany({
      where: {
        historyId,
        id: { not: productId },
      },
      ...baseProductWithDetailsQuery,
      orderBy: [{ category: { order: "asc" } }, { episode: { number: "asc" } }],
    });

    const shortProducts: ShortProduct[] = rawProducts.map((p) =>
      mapRawToShortProduct(p)
    );

    return NextResponse.json(shortProducts, { status: 200 });
  } catch (err) {
    console.error("❌ Серверная ошибка при загрузке похожих продуктов:", err);
    return NextResponse.json({ error: "Серверная ошибка" }, { status: 500 });
  }
}

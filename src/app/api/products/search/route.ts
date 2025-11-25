import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";
import { baseShortProductsQuery, ShortProductRaw } from "@/shared/api/queries";
import {
  mapRawToShortProduct,
  normalizeProduct,
} from "@/entities/product/model";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("query") || "";
    const category = req.nextUrl.searchParams.get("category");

    const where: any = {
      title: { contains: query, mode: "insensitive" },
      ...(category ? { category: { slug: category } } : {}),
    };

    const raw: ShortProductRaw[] = await prisma.product.findMany({
      ...baseShortProductsQuery,
      where,
      take: 5,
    });

    const products = raw.map((p) => mapRawToShortProduct(p));

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Ошибка поиска продуктов:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ошибка сервера" },
      { status: 500 }
    );
  }
}

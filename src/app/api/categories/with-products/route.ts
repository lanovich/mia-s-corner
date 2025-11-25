import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          include: {
            sizes: {
              include: {
                size: true,
              },
            },
          },
        },
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error: any) {
    console.error("Ошибка при загрузке категорий с продуктами:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

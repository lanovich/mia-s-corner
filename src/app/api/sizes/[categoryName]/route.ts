import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";
import { Size } from "@/entities/product/model";

interface Params {
  categoryName: string;
}

export async function GET(_request: Request, { params }: { params: Params }) {
  const { categoryName } = params;

  if (!categoryName) {
    return NextResponse.json(
      { error: "Не указано имя категории" },
      { status: 400 }
    );
  }

  try {
    const sizes = await prisma.size.findMany({
      where: {
        category: {
          name: categoryName,
        },
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        productSizes: true,
      },
    });

    const formatted: Size[] = sizes.map((s) => {
      const result: Size = {
        id: s.id,
        categoryId: s.categoryId,
        volume: {
          amount: s.amount !== null ? Number(s.amount) : null,
          unit: s.unit,
        },
        unit: s.unit,
      };

      return result;
    });

    return NextResponse.json(formatted, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Ошибка в API /sizes/by-category/${categoryName}:`, error);
    return NextResponse.json(
      { error: "Ошибка загрузки размеров" },
      { status: 500 }
    );
  }
}

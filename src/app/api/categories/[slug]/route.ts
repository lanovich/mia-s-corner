import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";

interface Params {
  slug: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Не указан slug категории" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { slug },
      select: { name: true },
    });

    if (!category) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(category.name, { status: 200 });
  } catch (error) {
    console.error("Ошибка в /api/categories/[slug]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ошибка сервера" },
      { status: 500 }
    );
  }
}

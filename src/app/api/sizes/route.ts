import { Size } from "@/entities/product/model";
import { prisma } from "@/shared/api/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sizes = await prisma.size.findMany();

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
    console.error("Ошибка загрузки размеров:", error);
    return NextResponse.json([], { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { productId, description } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Необходимо указать ID продукта" },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { description },
    });

    return NextResponse.json(
      { success: true, product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при обновлении описания:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении описания" },
      { status: 500 }
    );
  }
}

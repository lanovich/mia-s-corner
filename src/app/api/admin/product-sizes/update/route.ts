import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      productSizeId,
      price,
      oldPrice,
      quantity,
      isDefault,
      size,
      timeOfExploitation,
      dimensions,
    } = body;

    if (!productSizeId) {
      return NextResponse.json(
        { error: "Необходимо указать ID размера продукта (productSizeId)" },
        { status: 400 }
      );
    }

    const updatedProductSize = await prisma.productSize.update({
      where: { id: productSizeId },
      data: {
        price,
        oldPrice,
        stock: quantity,
        isDefault,
      },
    });

    if (!updatedProductSize) {
      return NextResponse.json(
        { error: "Размер продукта не найден" },
        { status: 404 }
      );
    }

    if (size || timeOfExploitation || dimensions) {
      await prisma.size.update({
        where: { id: updatedProductSize.sizeId },
        data: {
          amount: size ?? undefined,
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обновлении размера:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении размера" },
      { status: 500 }
    );
  }
}

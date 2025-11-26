import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 401 });
    }

    const { productSizeId, delta } = await req.json();
    const productSizeIdNum = Number(productSizeId);
    const deltaNum = Number(delta);

    if (isNaN(productSizeIdNum) || isNaN(deltaNum)) {
      return NextResponse.json(
        { error: "Некорректные данные" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { token },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Корзина не найдена" },
        { status: 404 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productSizeId: {
          cartId: cart.id,
          productSizeId: productSizeIdNum,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Товар не найден в корзине" },
        { status: 404 }
      );
    }

    const newQty = cartItem.quantity + deltaNum;

    if (newQty > 0) {
      const updated = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: newQty },
      });

      return NextResponse.json({
        message: "Количество обновлено",
        quantity: updated.quantity,
      });
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return NextResponse.json({ message: "Товар удалён", quantity: 0 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

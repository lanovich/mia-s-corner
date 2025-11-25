import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 401 });
    }

    const { productSizeId } = await req.json();
    const productSizeIdNum = Number(productSizeId);

    if (isNaN(productSizeIdNum)) {
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

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productSizeId: productSizeIdNum,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Ошибка при удалении из корзины:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

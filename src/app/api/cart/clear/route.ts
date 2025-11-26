import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
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
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Ошибка при очистке корзины:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const { fullPrice } = await req.json();

    if (typeof fullPrice !== "number" || isNaN(fullPrice)) {
      return NextResponse.json({ error: "Некорректная цена" }, { status: 400 });
    }

    const updatedCart = await prisma.cart.updateMany({
      where: { token },
      data: { fullPrice },
    });

    if (updatedCart.count === 0) {
      return NextResponse.json(
        { error: "Корзина не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Ошибка при обновлении fullPrice:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

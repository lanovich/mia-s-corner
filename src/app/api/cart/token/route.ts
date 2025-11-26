import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/shared/api/prisma";

export async function GET(req: NextRequest) {
  const tokenCookie = req.cookies.get("user_token")?.value;

  let token = tokenCookie;

  if (!token) {
    token = uuidv4();

    try {
      await prisma.cart.create({
        data: { token },
      });
    } catch (err: any) {
      console.error("Ошибка создания корзины:", err);
      return NextResponse.json(
        { error: "Ошибка создания корзины" },
        { status: 500 }
      );
    }
  }

  const res = NextResponse.json({ token });

  res.cookies.set({
    name: "user_token",
    value: token,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return res;
}

import { NextRequest } from "next/server";
import { prisma } from "@/shared/api/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productSizeId } = body;

    if (!productSizeId) {
      return new Response(JSON.stringify({ error: "Missing productSizeId" }), {
        status: 400,
      });
    }

    const existingProductSize = await prisma.productSize.findUnique({
      where: { id: Number(productSizeId) },
    });

    if (!existingProductSize) {
      return new Response(JSON.stringify({ error: "ProductSize not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Ошибка:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

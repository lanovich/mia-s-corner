import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { normalizeProduct } from "@/entities/product/model";
import { baseProductWithDetailsQuery } from "@/shared/api/queries";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = Number(params.id);

  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const rawProduct = await prisma.product.findUnique({
      where: { id: productId },
      ...baseProductWithDetailsQuery,
    });

    if (!rawProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(normalizeProduct(rawProduct));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";
import { productsByFilterQuery } from "@/shared/api/queries";
import { mapRawToShortProduct } from "@/entities/product/model";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await context.params;
    const id = Number(categoryId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid categoryId" },
        { status: 400 }
      );
    }

    const raw = await prisma.product.findMany(
      productsByFilterQuery({ categoryId: id })
    );

    const shortProducts = raw.map((p) => mapRawToShortProduct(p));

    return NextResponse.json(shortProducts, { status: 200 });
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

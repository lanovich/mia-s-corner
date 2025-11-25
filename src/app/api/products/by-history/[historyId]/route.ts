import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";
import { mapRawToShortProduct } from "@/entities/product/model";
import { normalizeProduct } from "@/entities/product/model/transformers";
import { productsByFilterQuery } from "@/shared/api/queries";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ historyId: string }> }
) {
  try {
    const { historyId } = await context.params;
    const id = Number(historyId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid historyId" }, { status: 400 });
    }

    const raw = await prisma.product.findMany(
      productsByFilterQuery({ historyId: id })
    );

    const shortProducts = raw.map((p) => mapRawToShortProduct(p));

    return NextResponse.json(shortProducts, { status: 200 });
  } catch (err) {
    console.error(
      `Error fetching products for historyId ${context.params}:`,
      err
    );
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

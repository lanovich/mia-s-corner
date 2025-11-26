import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";
import {
  mapCategoryToGroupedShortProducts,
  mapRawToShortProduct,
} from "@/entities/product/model";
import { baseShortProductsQuery } from "@/shared/api/queries";

export async function GET() {
  try {
    const raw = await prisma.product.findMany(baseShortProductsQuery);

    const products = raw.map((product) => mapRawToShortProduct(product));

    return NextResponse.json(products);
  } catch (err) {
    console.error("Error fetching grouped products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

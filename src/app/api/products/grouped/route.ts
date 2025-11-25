import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";
import { mapCategoryToGroupedShortProducts } from "@/entities/product/model";
import { categoryWithShortProductsQuery } from "@/shared/api/queries";

export async function GET() {
  try {
    const raw = await prisma.category.findMany(categoryWithShortProductsQuery);

    console.log(raw);

    const grouped = raw.map(mapCategoryToGroupedShortProducts);
    return NextResponse.json(grouped);
  } catch (err) {
    console.error("Error fetching grouped products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

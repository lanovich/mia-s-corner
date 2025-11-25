import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";
import { categoryWithFullProductsQuery } from "@/shared/api/queries";
import { mapCategoryToGroupedFullProducts } from "@/entities/product/model";

export async function GET() {
  try {
    const raw = await prisma.category.findMany(categoryWithFullProductsQuery);

    const grouped = raw.map(mapCategoryToGroupedFullProducts);

    return NextResponse.json(grouped);
  } catch (err) {
    console.error("Error fetching grouped products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

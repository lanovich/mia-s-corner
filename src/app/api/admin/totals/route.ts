import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CategoryTotals, TotalsResponse } from "@/features/admin-control/model";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sizes = await prisma.productSize.findMany({
      include: {
        product: {
          include: { category: true },
        },
      },
    });

    const categoryMap = new Map<string, CategoryTotals>();

    let totalStockQuantity = 0;
    let totalAllProductsPrice = 0;

    for (const size of sizes) {
      const categoryName = size.product.category.name;
      const stock = size.stock;
      const price = Number(size.price);

      totalStockQuantity += stock;
      totalAllProductsPrice += price * stock;

      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          categoryName,
          totalQuantity: 0,
          totalPrice: 0,
        });
      }

      const category = categoryMap.get(categoryName)!;

      category.totalQuantity += stock;
      category.totalPrice += price * stock;
    }

    const data: TotalsResponse = {
      totalStockQuantity,
      totalAllProductsPrice,
      categories: Array.from(categoryMap.values()),
    };

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

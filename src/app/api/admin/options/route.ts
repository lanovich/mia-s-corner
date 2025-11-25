import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        sizes: {
          select: {
            stock: true,
          },
        },
        scent: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    const options = products.map((product) => {
      const totalStock = product.sizes.reduce(
        (sum, size) => sum + size.stock,
        0
      );

      return {
        id: product.id,
        title: product.title,
        scentName: product.scent?.name || null,
        quantity: totalStock,
        categoryInfo: product.category,
      };
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

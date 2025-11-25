import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        sizes: {
          include: {
            size: {
              select: {
                id: true,
                amount: true,
                unit: true,
              },
            },
          },
        },
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Ошибка GET /products:", error);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      categoryId,
      episodeId,
      slug,
      sizeIds = [],
      description,
      isLimited = false,
      oldPrice = 0,
      price = 0,
      isDefaultIndex = 0,
    } = body;

    if (!title || !categoryId) {
      return NextResponse.json(
        { error: "Необходимо указать название и категорию" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title,
        categoryId,
        episodeId: episodeId ?? null,
        slug,
        description: description ?? "",
        isLimited,
      },
    });

    const sizePromises = sizeIds.map((sizeId: number, index: number) => {
      return prisma.productSize.create({
        data: {
          productId: product.id,
          sizeId,
          price,
          oldPrice,
          stock: 0,
          isDefault: index === isDefaultIndex,
          images: [],
        },
      });
    });

    await Promise.all(sizePromises);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании товара:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Ошибка при создании товара",
      },
      { status: 500 }
    );
  }
}

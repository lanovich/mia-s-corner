import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";
import { ShortProduct } from "@/entities/product/model";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const { productSizeId, delta } = await req.json();
    const productSizeIdNum = Number(productSizeId);
    const deltaNum = Number(delta);

    if (isNaN(productSizeIdNum) || isNaN(deltaNum)) {
      return NextResponse.json(
        { error: "Некорректные данные" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.upsert({
      where: { token },
      update: {},
      create: { token },
    });

    const sizeData = await prisma.productSize.findUnique({
      where: { id: productSizeIdNum },
      include: {
        size: true,
        product: {
          include: {
            category: true,
            scent: true,
            episode: true,
          },
        },
      },
    });

    if (!sizeData) {
      return NextResponse.json({ newItem: null });
    }

    let cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productSizeId: {
          cartId: cart.id,
          productSizeId: productSizeIdNum,
        },
      },
    });

    if (cartItem) {
      const newQty = cartItem.quantity + deltaNum;
      if (newQty <= 0) {
        await prisma.cartItem.delete({ where: { id: cartItem.id } });
        return NextResponse.json({ newItem: null });
      }
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: newQty },
      });
    } else if (deltaNum > 0) {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productSizeId: productSizeIdNum,
          quantity: deltaNum,
        },
      });
    } else {
      return NextResponse.json({ newItem: null });
    }

    const shortSize = {
      id: sizeData.id,
      price: Number(sizeData.price),
      oldPrice: sizeData.oldPrice !== null ? Number(sizeData.oldPrice) : null,
      image: sizeData.images?.[0] || undefined,
      volume: {
        amount:
          sizeData.size.amount !== null ? Number(sizeData.size.amount) : null,
        unit: sizeData.size.unit || null,
      },
      stock: sizeData.stock,
    };

    const shortProduct: ShortProduct = {
      id: sizeData.product.id,
      title: sizeData.product.title,
      slug: sizeData.product.slug || undefined,
      isLimited: sizeData.product.isLimited,
      categorySlug: sizeData.product.category?.slug || "unknown",
      size: shortSize,
      scent: sizeData.product.scent
        ? { name: sizeData.product.scent.name }
        : undefined,
      episode: sizeData.product.episode
        ? {
            number: sizeData.product.episode.number
              ? Number(sizeData.product.episode.number)
              : undefined,
            title: sizeData.product.episode.title || undefined,
          }
        : undefined,
    };

    const newItem = {
      id: cartItem.id,
      productSizeId: productSizeIdNum,
      quantity: cartItem.quantity,
      shortProduct,
    };

    return NextResponse.json({ newItem });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

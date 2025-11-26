import { NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";
import { mapRawToShortProduct, ShortProduct } from "@/entities/product/model";
import {
  baseShortProductsQuery,
  makeShortProductsQueryBySizeId,
} from "@/shared/api/queries";

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

    const shortProduct = await prisma.product.findFirst({
      where: {
        sizes: {
          some: {
            id: productSizeIdNum,
          },
        },
      },
      ...makeShortProductsQueryBySizeId(productSizeIdNum),
    });

    if (!shortProduct) {
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

    const newItem = {
      id: cartItem.id,
      productSizeId: productSizeIdNum,
      quantity: cartItem.quantity,
      shortProduct: mapRawToShortProduct(shortProduct),
    };

    return NextResponse.json({ newItem });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

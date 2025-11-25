import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/shared/api/prisma";
import { CheckoutFormValues } from "@/entities/order/model/checkoutFormSchema";
import { createPayment } from "@/entities/order/api";
import { sendEmail } from "@/entities/mail/api";
import { OrderReceiptEmail } from "@/entities/mail/ui";
import { OrderItem } from "@/entities/order/model";

export async function POST(req: Request) {
  try {
    const { checkoutFormValues, deliveryPrice } = (await req.json()) as {
      checkoutFormValues: CheckoutFormValues;
      deliveryPrice: number;
    };

    const cookieStore = cookies();
    const cartToken = (await cookieStore).get("user_token")?.value;

    if (!cartToken) {
      return NextResponse.json(
        { success: false, error: "Токен корзины не найден" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { token: cartToken },
      include: {
        items: {
          include: {
            productSize: {
              include: {
                product: true,
                size: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Корзина пуста" },
        { status: 400 }
      );
    }

    const items: OrderItem[] = cart.items.map((item) => ({
      id: item.id,
      productSizeId: item.productSizeId,
      product: {
        id: item.productSize.product.id,
        title: item.productSize.product.title,
        slug: item.productSize.product.slug ?? undefined,
        isLimited: item.productSize.product.isLimited,
        storyText: item.productSize.product.storyText ?? undefined,
        description: item.productSize.product.description ?? undefined,
      },
      quantity: item.quantity,
      price: Number(item.productSize.price),
      images: item.productSize.images,
    }));

    const productTotalAmount = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const fullPrice = productTotalAmount + deliveryPrice;

    const d = checkoutFormValues;
    let delivery: any = null;

    if (d.deliveryMethod === "selfPickup") {
      delivery = { method: "selfPickup" };
    } else if (d.deliveryMethod === "fastDelivery") {
      delivery = {
        method: "fastDelivery",
        city: d.city,
        street: d.street,
        building: d.building,
        porch: d.porch,
        sfloor: d.sfloor,
        sflat: d.sflat,
        comment: "comment" in d ? d.comment ?? null : null,
      };
    } else {
      delivery = {
        method: "delivery",
        city: d.city,
        street: d.street,
        building: d.building,
      };
    }

    const order = await prisma.order.create({
      data: {
        name: d.name,
        phone: d.phone,
        email: d.email,
        wishes: d.wishes ?? null,
        token: cartToken,
        items: JSON.stringify(items),
        fullPrice,
        delivery,
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    const paymentData = await createPayment({
      amount: fullPrice,
      orderId: order.id,
      description: `Оплата заказа #${order.id}`,
      customerEmail: order.email,
      items,
      deliveryPrice,
    });

    if (!paymentData?.id) {
      return NextResponse.json(
        { success: false, error: "Не удалось создать платеж" },
        { status: 500 }
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: paymentData.id },
    });

    const paymentUrl = paymentData.confirmation.confirmation_url;

    await sendEmail(
      order.email,
      `Mia's Corner / Оплата заказа #${order.id}`,
      OrderReceiptEmail,
      {
        orderId: order.id,
        fullPrice,
        deliveryPrice,
        items: JSON.stringify(items),
        paymentUrl,
      }
    );

    return NextResponse.json({ success: true, paymentUrl });
  } catch (e) {
    console.error("Ошибка createOrder:", e);
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Неизвестная ошибка",
      },
      { status: 500 }
    );
  }
}

import { sendEmail } from "@/entities/mail/api";
import { NewOrderAlertEmail, SuccessEmail } from "@/entities/mail/ui";
import { Delivery, OrderItem, OrderStatus } from "@/entities/order/model";
import { YookassaOrderStatus } from "@/entities/yookassa/model";
import { LINKS } from "@/shared/model";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/api/prisma";

export async function POST(req: NextRequest) {
  try {
    const body: YookassaOrderStatus = await req.json();
    const orderId = body.object.metadata.order_id;

    const orderFromDb = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!orderFromDb) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = {
      ...orderFromDb,
      items: orderFromDb.items as unknown as OrderItem[],
      delivery: orderFromDb.delivery as unknown as Delivery,
    };

    const isSucceeded = body.object.status === "succeeded";

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
      },
    });

    if (isSucceeded) {
      await sendEmail(
        order.email,
        `Mia's Corner / Спасибо за оплату заказа #${order.id}`,
        SuccessEmail,
        {
          orderId: order.id,
          fullPrice: order.fullPrice,
          deliveryPrice: order.delivery?.deliveryPrice ?? 0,
          items: JSON.stringify(order.items),
        }
      );

      await sendEmail(
        LINKS.GMAIL,
        `Новый заказ на ${order.fullPrice}`,
        NewOrderAlertEmail,
        {
          orderId: order.id,
          fullPrice: order.fullPrice,
          deliveryPrice: order.delivery?.deliveryPrice ?? 0,
          items: JSON.stringify(order.items),
          deliveryMethod: order.delivery?.method ?? "unknown",
          customerName: order.name,
          customerPhone: order.phone,
          customerEmail: order.email,
          deliveryComment: order.delivery?.comment ?? null,
          wishes: order.wishes ?? null,
          deliveryAddress: {
            city: order.delivery?.city ?? null,
            street: order.delivery?.street ?? null,
            building: order.delivery?.building ?? null,
            porch: order.delivery?.porch ?? null,
            floor: order.delivery?.sfloor ?? null,
            flat: order.delivery?.sflat ?? null,
          },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Checkout Callback Error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

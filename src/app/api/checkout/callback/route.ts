import { sendEmail } from "@/entities/mail/api";
import { NewOrderAlertEmail, SuccessEmail } from "@/entities/mail/ui";
import { Order, OrderStatus } from "@/entities/order/model";
import { YookassaOrderStatus } from "@/entities/yookassa/model";
import { supabase } from "@/shared/api/supabase/server";
import { LINKS } from "@/shared/model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Request received:", req);
    const body: YookassaOrderStatus = await req.json();
    console.log("Body received:", body);

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", body.object.metadata.order_id)
      .single<Order>();

    if (error || !order) {
      console.error("Order not found:", error);
      return NextResponse.json({ error: "Order not found" });
    }

    console.log("Order found:", order);

    const isSucceeded = body.object.status === "succeeded";
    console.log("Order status:", isSucceeded ? "SUCCEEDED" : "CANCELLED");

    const { data, error: updateError } = await supabase
      .from("orders")
      .update({
        status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Error updating order status:", updateError);
    } else {
      console.log("Order status updated successfully:", data);
    }

    if (isSucceeded) {
      await sendEmail(
        order.email,
        `Mia's Corner / Спасибо за оплату заказа #${order.id}`,
        SuccessEmail,
        {
          orderId: order.id,
          deliveryPrice: order.delivery_price,
          fullPrice: order.fullPrice,
          items: JSON.stringify(order.items),
        }
      );

      await sendEmail(
        LINKS.GMAIL,
        `Новый заказ на ${order.fullPrice}; ${order.delivery_method}`,
        NewOrderAlertEmail,
        {
          orderId: order.id,
          deliveryPrice: order.delivery_price,
          fullPrice: order.fullPrice,
          items: JSON.stringify(order.items),
          deliveryMethod: order.delivery_method,
          customerName: order.name,
          customerPhone: order.phone,
          customerEmail: order.email,
          deliveryComment: order.comment,
          wishes: order.wishes,
          deliveryAddress: {
            city: order.city,
            street: order.street,
            building: order.building,
            porch: order.porch,
            floor: order.sfloor,
            flat: order.sflat,
          },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log("Checkout Callback Error:", e);
    return NextResponse.json({ error: "Server error" });
  }
}

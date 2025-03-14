import { SuccessEmail } from "@/components/shared/emails";
import { sendEmail } from "@/lib";
import { supabase } from "@/lib/supabase";
import { OrderStatus } from "@/types/OrderStatus";
import { YookassaOrderStatus } from "@/types/YookassaOrderStatus";
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
      .single();

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
          fullPrice: order.fullPrice,
          items: JSON.stringify(order.items),
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log("Checkout Callback Error:", e);
    return NextResponse.json({ error: "Server error" });
  }
}

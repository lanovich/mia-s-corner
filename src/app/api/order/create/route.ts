import { NextResponse } from "next/server";
import { CheckoutFormValues } from "@/entities/order/model/checkoutFormSchema";
import { supabase } from "@/shared/api/supabase/server";
import { cookies } from "next/headers";
import { createPayment } from "@/entities/order/api";
import { sendEmail } from "@/entities/mail/api";
import { OrderReceiptEmail } from "@/entities/mail/ui";

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

    const { data: userCart, error: cartError } = await supabase
      .from("cart")
      .select(
        `
        id,
        token,
        fullPrice,
        cartItem:cartItem (
          id,
          product_id,
          size_id,
          quantity,
          product:products (*)
        )
      `
      )
      .eq("token", cartToken)
      .single();

    if (cartError || !userCart) {
      return NextResponse.json(
        { success: false, error: cartError?.message || "Корзина не найдена" },
        { status: 400 }
      );
    }

    if (userCart.fullPrice === 0 || userCart.cartItem.length === 0) {
      return NextResponse.json(
        { success: false, error: "Корзина пуста" },
        { status: 400 }
      );
    }

    for (const item of userCart.cartItem) {
      const { data: productSize } = await supabase
        .from("product_sizes")
        .select("price")
        .eq("product_id", item.product_id)
        .eq("size_id", item.size_id)
        .single();

      (item as any).price = productSize?.price ?? 0;

      const { data: size } = await supabase
        .from("sizes")
        .select("size")
        .eq("id", item.size_id)
        .single();

      (item as any).size = size?.size ?? null;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          delivery_method: checkoutFormValues.deliveryMethod,
          name: checkoutFormValues.name,
          phone: checkoutFormValues.phone,
          email: checkoutFormValues.email,
          city:
            checkoutFormValues.deliveryMethod === "selfPickup"
              ? null
              : checkoutFormValues.city,
          street:
            checkoutFormValues.deliveryMethod === "selfPickup"
              ? null
              : checkoutFormValues.street,
          building:
            checkoutFormValues.deliveryMethod === "selfPickup"
              ? null
              : checkoutFormValues.building,
          porch:
            checkoutFormValues.deliveryMethod === "fastDelivery"
              ? checkoutFormValues.porch
              : null,
          sfloor:
            checkoutFormValues.deliveryMethod === "fastDelivery"
              ? checkoutFormValues.sfloor
              : null,
          sflat:
            checkoutFormValues.deliveryMethod === "fastDelivery"
              ? checkoutFormValues.sflat
              : null,
          comment:
            checkoutFormValues.deliveryMethod === "fastDelivery"
              ? checkoutFormValues.comment
              : null,
          fullPrice: userCart.fullPrice + deliveryPrice,
          delivery_price: deliveryPrice,
          items: userCart.cartItem,
          token: cartToken,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          success: false,
          error: orderError?.message || "Ошибка при создании заказа",
        },
        { status: 500 }
      );
    }

    const { error: clearCartError } = await supabase
      .from("cartItem")
      .delete()
      .eq("cart_id", userCart.id);

    if (clearCartError) {
      console.error("Ошибка при очистке корзины:", clearCartError.message);
    }

    const paymentData = await createPayment({
      amount: order.fullPrice,
      orderId: order.id,
      description: `Оплата заказа #${order.id}`,
      customerEmail: order.email,
      items: order.items,
      deliveryPrice: order.delivery_price,
    });

    if (!paymentData?.id) {
      return NextResponse.json(
        { success: false, error: "Не удалось создать платеж" },
        { status: 500 }
      );
    }

    await supabase
      .from("orders")
      .update({ paymentId: paymentData.id })
      .eq("id", order.id);

    const paymentUrl = paymentData.confirmation.confirmation_url;

    await sendEmail(
      order.email,
      `Mia's Corner / Оплата заказа #${order.id}`,
      OrderReceiptEmail,
      {
        orderId: order.id,
        fullPrice: order.fullPrice,
        deliveryPrice: order.delivery_price,
        items: JSON.stringify(order.items),
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

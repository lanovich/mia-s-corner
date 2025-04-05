"use server";

import {
  ContactEmailTemplate,
  OrderReceiptEmail,
} from "@/components/shared/emails";
import { LINKS } from "@/constants";
import { CheckoutFormValues } from "@/constants/checkoutFormSchema";
import { ContactFormValues } from "@/constants/contactFormSchema";
import { createPayment, sendEmail } from "@/lib";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function createOrder(
  data: CheckoutFormValues,
  deliveryPrice: number = 0
) {
  try {
    const cookieStore = cookies();
    const cartToken = (await cookieStore).get("user_token")?.value;

    if (!cartToken) {
      throw new Error("Токен корзины не найден");
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

    if (cartError) {
      console.error("Ошибка при получении корзины:", cartError);
      return;
    }

    for (const item of userCart.cartItem) {
      const { data: productSize, error: productSizeError } = await supabase
        .from("product_sizes")
        .select("price")
        .eq("product_id", item.product_id)
        .eq("size_id", item.size_id)
        .single();

      if (productSizeError) {
        console.error("Ошибка при получении product_sizes:", productSizeError);
        continue;
      }

      (item as any).price = productSize.price;

      const { data: size, error: sizeError } = await supabase
        .from("sizes")
        .select("size")
        .eq("id", item.size_id)
        .single();

      if (sizeError) {
        console.error("Ошибка при получении sizes:", sizeError);
        continue;
      }

      (item as any).size = size.size;
    }

    if (cartError) {
      throw new Error("Ошибка при получении корзины: " + cartError);
    }

    if (!userCart) {
      throw new Error("Корзина не найдена");
    }

    if (userCart.fullPrice === 0 || userCart.cartItem.length === 0) {
      throw new Error("Корзина пустая");
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          delivery_method: data.deliveryMethod,
          name: data.name,
          phone: data.phone,
          email: data.email,

          city: data.deliveryMethod === "selfPickup" ? null : data.city,
          street: data.deliveryMethod === "selfPickup" ? null : data.street,
          building: data.deliveryMethod === "selfPickup" ? null : data.building,
          porch: data.deliveryMethod === "fastDelivery" ? data.porch : null,
          sfloor: data.deliveryMethod === "fastDelivery" ? data.sfloor : null,
          sflat: data.deliveryMethod === "fastDelivery" ? data.sflat : null,
          comment: data.deliveryMethod === "fastDelivery" ? data.comment : null,

          fullPrice: userCart.fullPrice + deliveryPrice,
          delivery_price: deliveryPrice,
          items: userCart.cartItem,
          token: cartToken,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (orderError) {
      throw new Error("Ошибка при создании заказа: " + orderError.message);
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
      deliveryPrice: order.delivery_price
    });

    if (!paymentData?.id) {
      throw new Error("Payment ID not found");
    }

    await supabase
      .from("orders")
      .update({ paymentId: paymentData.id })
      .eq("id", order.id);

    const paymentUrl = paymentData.confirmation.confirmation_url;

    await sendEmail(
      data.email,
      `Mia's Corner / Оплата заказа #${order.id}`,
      OrderReceiptEmail,
      {
        orderId: order.id,
        fullPrice: order.fullPrice,
        deliveryPrice: order.delivery_price,
        items: JSON.stringify(order.items),
        paymentUrl: paymentUrl,
      }
    );

    return paymentUrl;
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Неизвестная ошибка",
    };
  }
}

export async function sendContactMessage(data: ContactFormValues) {
  try {
    await sendEmail(
      LINKS.GMAIL,
      `Новое сообщение с сайта Mia's Corner от пользователя ${data.email}`,
      ContactEmailTemplate,
      data
    );

    return { success: true };
  } catch (error) {
    console.error("Ошибка при отправке сообщения", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
}
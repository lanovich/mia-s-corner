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

export async function createOrder(data: CheckoutFormValues) {
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
      throw new Error("Ошибка при получении корзины: " + cartError.message);
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
          name: data.name,
          phone: data.phone,
          email: data.email,
          delivery_address: data.deliveryAddress,
          floor: data.floor,
          wishes: data.wishes,
          comment: data.comment,
          fullPrice: userCart.fullPrice,
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

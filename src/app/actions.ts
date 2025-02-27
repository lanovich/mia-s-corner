"use server";

import { CheckoutFormValues } from "@/constants/checkoutFormSchema";
import { supabase } from "@/lib/supabase";

export async function createOrder(data: CheckoutFormValues) {
  const { error } = await supabase.from("orders").insert({
    name: data.name,
    phone: data.phone,
    email: data.email,
    delivery_address: data.deliveryAddress,
    wishes: data.wishes || null,
    floor: data.floor,
    comment: data.comment || null,
    token: "some-generated-token",
  });

  if (error) {
    console.error("Ошибка при создании заказа:", error);
    throw new Error("Не удалось создать заказ");
  }

  return "https://ui.shadcn.com/docs/components/skeleton";
}

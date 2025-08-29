import { apiFetch } from "@/shared/api";
import { CheckoutFormValues } from "../model";

export const orderApi = {
  createOrder: (formValues: CheckoutFormValues, deliveryPrice: number) =>
    apiFetch<{ success: boolean; paymentUrl?: string; error?: string }>(
      "/api/order/create",
      {
        method: "POST",
        body: JSON.stringify({
          checkoutFormValues: formValues,
          deliveryPrice,
        }),
      }
    ),
};

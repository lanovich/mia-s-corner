import { OrderItem } from "@/types/OrderItem";
import axios from "axios";
import { randomUUID } from "crypto";

interface PaymentParams {
  amount: number;
  description: string;
  orderId: string;
  customerEmail: string;
  items: OrderItem[];
}

export async function createPayment(details: PaymentParams) {
  try {
    if (!process.env.YOOKASSA_STORE_ID || !process.env.YOOKASSA_API_KEY) {
      throw new Error("Yookassa credentials are missing");
    }

    if (!details.customerEmail) {
      throw new Error("Customer email is required for fiscal receipt");
    }

    const receiptItems = details.items.map((item) => ({
      description: item.product.title,
      quantity: item.quantity.toString(),
      amount: {
        value: item.price.toFixed(2),
        currency: "RUB",
      },
      vat_code: 3,
      payment_mode: "full_payment",
      payment_subject: "commodity",
    }));

    const payload = {
      amount: {
        value: details.amount.toFixed(2),
        currency: "RUB",
      },
      capture: true,
      description: details.description.substring(0, 128),
      metadata: {
        order_id: details.orderId,
      },
      confirmation: {
        type: "redirect",
        return_url:
          process.env.YOOKASSA_CALLBACK_URL ||
          "https://www.mias-corner.ru",
      },
      receipt: {
        customer: {
          email: details.customerEmail,
        },
        items: receiptItems,
      },
    };

    const { data } = await axios.post(
      "https://api.yookassa.ru/v3/payments",
      payload,
      {
        auth: {
          username: process.env.YOOKASSA_STORE_ID,
          password: process.env.YOOKASSA_API_KEY,
        },
        headers: {
          "Idempotence-Key": randomUUID(),
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Payment creation failed:", error);
    throw error;
  }
}
import axios from "axios";
import { randomUUID } from "crypto";

interface PaymentParams {
  amount: number;
  description: string;
  orderId: string;
}

export async function createPayment(details: PaymentParams) {
  try {
    if (
      !process.env.YOOKASSA_STORE_ID ||
      !process.env.YOOKASSA_API_KEY ||
      !process.env.YOOKASSA_CALLBACK_URL
    ) {
      throw new Error("Yookassa credentials are missing");
    }

    // Проверяем amount
    if (typeof details.amount !== "number" || isNaN(details.amount)) {
      throw new Error("Amount must be a valid number");
    }

    // Проверяем orderId
    if (!details.orderId) {
      throw new Error("Order ID is required");
    }

    const payload = {
      amount: {
        value: Number(details.amount).toFixed(2),
        currency: "RUB",
      },
      capture: true,
      description: details.description,
      metadata: {
        order_id: String(details.orderId),
      },
      confirmation: {
        type: "redirect",
        return_url: process.env.YOOKASSA_CALLBACK_URL,
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
    console.error("Payment error details:", error);
    throw error;
  }
}

import { OrderItem } from "@/entities/order/model";
import axios from "axios";
import { randomUUID } from "crypto";

interface PaymentParams {
  amount: number;
  description: string;
  orderId: string;
  customerEmail: string;
  deliveryPrice?: number;
  items: OrderItem[];
}

interface YooKassaReceiptItem {
  description: string;
  quantity: string;
  amount: {
    value: string;
    currency: string;
  };
  vat_code: number;
  payment_mode: string;
  payment_subject: string;
}

export async function createPayment(details: PaymentParams) {
  try {
    if (!process.env.YOOKASSA_STORE_ID || !process.env.YOOKASSA_API_KEY) {
      throw new Error(
        "Yookassa credentials are missing in environment variables"
      );
    }

    if (!details.customerEmail) {
      throw new Error("Customer email is required for fiscal receipt");
    }

    if (!details.items || details.items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    if (details.amount <= 0) {
      throw new Error("Order amount must be greater than zero");
    }

    const receiptItems: YooKassaReceiptItem[] = details.items.map((item) => {
      if (!item.product) {
        throw new Error(`Product data missing for item ${item.id}`);
      }

      return {
        description: `${item.product.title} (${item.size})`.substring(0, 128),
        quantity: Math.max(1, item.quantity).toFixed(0),
        amount: {
          value: Math.max(0, item.price).toFixed(2),
          currency: "RUB",
        },
        vat_code: 1,
        payment_mode: "full_payment",
        payment_subject: "commodity",
      };
    });

    if (details.deliveryPrice && details.deliveryPrice > 0) {
      receiptItems.push({
        description: "Доставка",
        quantity: "1",
        amount: {
          value: details.deliveryPrice.toFixed(2),
          currency: "RUB",
        },
        vat_code: 1,
        payment_mode: "full_payment",
        payment_subject: "service",
      });
    }

    const payload = {
      amount: {
        value: details.amount.toFixed(2),
        currency: "RUB",
      },
      capture: true,
      description: details.description.substring(0, 128),
      metadata: {
        order_id: details.orderId,
        customer_email: details.customerEmail,
      },
      confirmation: {
        type: "redirect",
        return_url:
          process.env.YOOKASSA_CALLBACK_URL || "https://www.mias-corner.ru",
      },
      receipt: {
        customer: {
          email: details.customerEmail,
        },
        items: receiptItems,
      },
    };

    console.log("Sending to YooKassa:", payload);

    const response = await axios.post(
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
        timeout: 30000,
      }
    );

    if (!response.data?.id) {
      throw new Error("Invalid response from YooKassa API");
    }

    return response.data;
  } catch (error) {
    console.error("Payment creation failed:", error);

    if (axios.isAxiosError(error)) {
      console.error("YooKassa API error details:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(
        `YooKassa API error: ${
          error.response?.data?.description || error.message
        }`
      );
    }

    throw error;
  }
}

import axios from "axios";

interface params {
  amount: number,
  description: string;
  orderId: string;
}

export async function createPayment(details: params) {
  const { data } = await axios.post(
    "https://api.yookassa.ru/v3/payments",
    {
      amount: {
        value: details.amount,
        currency: "RUB",
      },
      capture: true,
      description: details.description,
      metadata: {
        order_id: details.orderId,
      },
      confirmation: {
        type: "redirect",
        return_url: process.env.YOOKASSA_CALLBACK_URL as string,
      },
    },
    {
      auth: {
        username: process.env.YOOKASSA_STORE_ID as string,
        password: process.env.YOOKASSA_API_KEY as string,
      },
      headers: {
        "Idempotence-Key": crypto.randomUUID(),
      },
    }
  );
  return data;
}

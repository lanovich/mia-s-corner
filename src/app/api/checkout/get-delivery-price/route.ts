import { YandexDeliveryBodyType } from "@/types/YandexDeliveryBodyType";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const requestData: YandexDeliveryBodyType = await req.json();

    const yandexResponse = await fetch(
      "https://b2b.taxi.yandex.net/b2b/cargo/integration/v2/offers/calculate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.YANDEX_DELIVERY_API_KEY}`,
        },
        body: JSON.stringify(requestData),
      }
    );

    console.log(
      "Ответ от API Яндекс:",
      yandexResponse.status,
      yandexResponse.statusText
    );

    if (!yandexResponse.ok) {
      const errorData = await yandexResponse.json();
      console.error("Ошибка от API Яндекс:", errorData);
      throw new Error("Ошибка при запросе к API Яндекс");
    }

    const yandexData = await yandexResponse.json();
    console.log("Данные от API Яндекс:", yandexData);

    const cheapestOffer = yandexData.offers.reduce(
      (
        prev: { price: { total_price: string } },
        curr: { price: { total_price: string } }
      ) => {
        return parseFloat(curr.price.total_price) <
          parseFloat(prev.price.total_price)
          ? curr
          : prev;
      }
    );

    console.log("Самый дешевый оффер:", cheapestOffer);

    return NextResponse.json(cheapestOffer, { status: 200 });
  } catch (error) {
    console.error("Ошибка в роуте:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при обработке запроса" },
      { status: 500 }
    );
  }
}

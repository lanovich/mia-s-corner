import {
  YandexPostalDeliveryBodyType,
  YandexPostalDeliveryResponse,
} from "@/entities/yandexDelivery/model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const requestData: YandexPostalDeliveryBodyType = await req.json();

    const yandexResponse = await fetch(
      "https://b2b-authproxy.taxi.yandex.net/api/b2b/platform/pricing-calculator",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.YANDEX_DELIVERY_API_KEY}`,
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!yandexResponse.ok) {
      const errorData = await yandexResponse.json();
      console.error("Ошибка от API Яндекс:", errorData);
      return NextResponse.json(
        { error: "Ошибка при запросе к API Яндекс", errorData },
        { status: 500 }
      );
    }

    const yandexData = await yandexResponse.json();
    const { delivery_days, pricing_total }: YandexPostalDeliveryResponse =
      yandexData;

    return NextResponse.json(
      {
        delivery_days: delivery_days || 0,
        pricing_total: pricing_total || "0",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка в роуте:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при обработке запроса" },
      { status: 500 }
    );
  }
}

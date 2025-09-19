import {
  YandexPostalDeliveryBodyType,
  YandexPostalDeliveryResponse,
} from "@/entities/yandexDelivery/model";
import axios from "axios";

interface params {
  city: string;
  street: string;
  building: string;
  destinationId: number;
}

export const getPostalDeliveryPrice = async ({
  city,
  street,
  building,
  destinationId,
}: params): Promise<YandexPostalDeliveryResponse | null> => {
  try {
    const body: YandexPostalDeliveryBodyType = {
      source: { platform_station_id: "10025990377" },
      destination: { platform_station_id: "10029835856" },
      tariff: "self_pickup",
      total_weight: 1100,
      payment_method: "already_paid",
      places: [
        { physical_dims: { weight_gross: 1000, dx: 20, dy: 20, dz: 20 } },
      ],
    };

    const { data }: { data: YandexPostalDeliveryResponse } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/get-delivery-price/pickup-point`,
      body
    );
    return data;
  } catch (error) {
    console.log("Ошибка при отправке запроса в get-delivery-price: ", error);
    return null;
  }
};

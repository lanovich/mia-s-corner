import { YandexDeliveryResponseType } from "@/entities/yandexDelivery/model";
import axios from "axios";


interface params {
  city: string;
  street: string;
  building: string;
  porch: string;
  sfloor: string;
  sflat: string;
}

export const getDeliveryPrice = async (
  details: params
): Promise<YandexDeliveryResponseType | null> => {
  try {
    const { data }: { data: YandexDeliveryResponseType } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/get-delivery-price`,
      {
        route_points: [
          {
            fullname: "Кудрово, Пражская, 12",
            country: "Россия",
            city: "Кудрово",
            street: "Пражская",
            building: "12",
            porch: "1",
            sflat: "6",
            sfloor: "64",
          },
          {
            country: "Россия",
            fullname: `${details.city}, ${details.street}, ${details.building}`,
            city: details.city,
            street: details.street,
            building: details.building,
            porch: details.porch,
            sflat: details.sflat,
            sfloor: details.sfloor,
          },
        ],
        items: [
          {
            quantity: 1,
            size: {
              height: 0.1,
              length: 0.1,
              width: 0.1,
            },
            weight: 0.5,
          },
        ],
      }
    );
    return data;
  } catch (error) {
    console.log("Ошибка при отправке запроса в get-delivery-price: ", error);
    return null;
  }
};

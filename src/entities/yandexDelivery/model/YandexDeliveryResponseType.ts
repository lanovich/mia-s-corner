export type YandexDeliveryResponseType = {
  price: YandexPrice;
  taxi_class: string;
  pickup_interval: PickupInterval;
  delivery_interval: DeliveryInterval;
  description: string;
  payload: string;
  offer_ttl: string;
};

export type YandexPrice = {
  total_price: string;
  total_price_with_vat: string;
  surge_ratio: number;
  currency: string;
};

export type PickupInterval = {
  from: string;
  to: string;
};

export type DeliveryInterval = {
  from: string;
  to: string;
};

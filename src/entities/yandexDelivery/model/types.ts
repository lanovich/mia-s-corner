export interface PickupPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: Address;
}

interface Address {
  geoId: number;
  country: string;
  region: string;
  subRegion: string;
  locality: string;
  street: string;
  house: string;
  housing: string;
  apartment: string;
  building: string;
  comment: string;
  full_address: string;
  postal_code: string;
}

export interface YandexPostalDeliveryBodyType {
  source: {
    platform_station_id: string;
  };
  destination: {
    address?: string;
    platform_station_id: string;
  };
  tariff: "time_interval" | "self_pickup";
  total_weight: number;
  total_assessed_price?: number;
  client_price?: number;
  payment_method: "already_paid" | "card_on_receipt";
  places: PlacePhysicalDimensions[];
}

interface PlacePhysicalDimensions {
  physical_dims: {
    weight_gross: number;
    dx: number;
    dy: number;
    dz: number;
    predefined_volume?: number;
  };
}

export interface YandexPostalDeliveryResponse {
  pricing_total: string;
  delivery_days: number;
}

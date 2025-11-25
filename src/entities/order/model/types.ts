export interface Delivery {
  deliveryPrice: number;
  method: string;
  city?: string;
  street?: string;
  building?: string;
  porch?: string;
  sfloor?: string;
  sflat?: string;
  comment?: string;
}

export interface OrderItem {
  productSizeId: number;
  quantity: number;
  price: number;
  images: string[];
  product: {
    id: number;
    title: string;
    slug?: string;
    isLimited: boolean;
  };
}

export interface Order {
  id: string;
  email: string;
  fullPrice: number;
  deliveryPrice: number;
  items: OrderItem[];
  delivery: Delivery;
}

export enum OrderStatus {
  SUCCEEDED = "SUCCEEDED",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
}

import {
  Product,
  ShortProduct,
  ShortProductSize,
} from "@/entities/product/model";

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
  id: number;
  productInfo: {
    productId: number;
    title: string;
    scentName?: string;
  };
  productSizeInfo: {
    productSizeId: number;
    price: number;
    oldPrice?: number;
    images: string[];
    volume: {
      amount: number;
      unit: string;
    };
  };
  quantityInOrder: number;
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

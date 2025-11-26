import { ShortProduct } from "@/entities/product/model";

export interface CartItem {
  id: number;
  cartId: number;
  productSizeId: number;
  quantity: number;
  unitPrice: number;
  createdAt: string;

  shortProduct: ShortProduct;
}

export interface Cart {
  id: number;
  token: string;
  createdAt: string;
  fullPrice: number;
  items: CartItem[];
}

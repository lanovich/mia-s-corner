import { Product } from "@/entities/product/model";

export interface OrderItem {
  id: number;
  size: number;
  price: number;
  product: Product;
  size_id: number;
  quantity: number;
  product_id: number;
}

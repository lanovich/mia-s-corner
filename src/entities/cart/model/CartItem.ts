import { Product } from "@/entities/product/model";

export type CartItem = {
  size_id: number;
  product: Partial<Product>;
  quantity: number;
};

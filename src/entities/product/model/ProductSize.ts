import { Size } from "./Size";

export type ProductSize = {
  is_default: boolean;
  oldPrice?: number | null;
  size: Size;
  price: number;
  product_id: number;
  quantity_in_stock: number;
  size_id: number;
};

import { CartItem } from "@/entities/cart/model";
import { ProductSize } from "@/entities/product/model";

export const findCartItem = (cart: CartItem[], size: ProductSize | null) => {
  if (!size) return undefined;
  return cart.find(
    (ci) => ci.product.id === size.product_id && ci.size_id === size.size_id
  );
};

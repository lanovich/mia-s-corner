import { CartItem } from "@/entities/cart/model";

export const findCartItem = (cart: CartItem[], productSizeId: number) => {
  console.log(cart);
  if (!productSizeId) return undefined;
  return cart.find((ci) => ci?.shortProduct?.size.id === productSizeId);
};

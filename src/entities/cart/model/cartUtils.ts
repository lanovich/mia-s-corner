import { CartItem } from "./CartItem";
import { findSelectedSize } from "@/shared/lib";
import { calcFullPrice } from "@/shared/lib/calcFullPrice";
import { cartService } from "./cartService";

export const calculateTotals = (cart: CartItem[]) => {
  const productTotalAmount = cart.reduce(
    (acc, item) =>
      acc +
      (findSelectedSize(item.product, item.size_id)?.price || 0) *
        item.quantity,
    0
  );
  const fullPrice = calcFullPrice(productTotalAmount).finalAmount;
  return { productTotalAmount, fullPrice };
};

export const findCartItemIndex = (
  cart: CartItem[],
  productId: number,
  sizeId: number
) =>
  cart.findIndex(
    (item) => item.product.id === productId && item.size_id === sizeId
  );

export const updateCartQuantity = (
  cart: CartItem[],
  productId: number,
  sizeId: number,
  delta: number,
  newItem?: CartItem
) => {
  const newCart = [...cart];
  const index = findCartItemIndex(newCart, productId, sizeId);

  if (delta > 0) {
    if (index !== -1) {
      newCart[index].quantity += delta;
    } else if (newItem) {
      newCart.push(newItem);
    }
  } else {
    if (index !== -1) {
      newCart[index].quantity += delta;
      if (newCart[index].quantity <= 0) newCart.splice(index, 1);
    }
  }

  return newCart;
};

export const modifyQuantityAPI = async (
  productId: number,
  sizeId: number,
  delta: number
): Promise<CartItem | undefined> => {
  if (delta > 0) {
    const { newItem } = await cartService.addToCart(productId, sizeId);
    return newItem;
  } else {
    await cartService.decreaseQuantity(productId, sizeId);
    return undefined;
  }
};

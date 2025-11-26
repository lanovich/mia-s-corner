import { findSelectedSize } from "@/shared/lib";
import { calcFullPrice } from "@/shared/lib/calcFullPrice";
import { cartService } from "./cartService";
import { CartItem } from ".";

export const calculateTotals = (cart: CartItem[] | []) => {
  if (!cart) return { productTotalAmount: 0, fullPrice: 0, itemsCount: 0 };

  const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const productTotalAmount = cart.reduce((acc, item) => {
    const price = item.shortProduct.size.price;
    return acc + price * item.quantity;
  }, 0);

  const fullPrice = calcFullPrice(productTotalAmount).finalAmount;

  return { productTotalAmount, fullPrice, itemsCount };
};

export const findCartItemIndex = (cart: CartItem[], productSizeId: number) =>
  cart.findIndex((item) => item.productSizeId === productSizeId);

export const updateCartQuantity = (
  cart: CartItem[],
  productSizeId: number,
  delta: number,
  newItem?: CartItem
) => {
  const newCart = [...cart];
  const index = findCartItemIndex(newCart, productSizeId);

  if (delta > 0) {
    if (index !== -1) {
      newCart[index].quantity += delta;
    } else if (newItem) {
      newCart.push(newItem);
    }
    return newCart;
  }

  if (index !== -1) {
    newCart[index].quantity += delta;

    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
  }

  return newCart;
};

export const modifyQuantityAPI = async (
  productSizeId: number,
  delta: number
): Promise<CartItem | undefined> => {
  if (delta > 0) {
    return await cartService.addToCart(productSizeId, delta);
  } else {
    await cartService.decreaseQuantity(productSizeId, delta);
    return undefined;
  }
};

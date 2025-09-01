import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "@/entities/cart/model/cartService";
import { calcFullPrice } from "@/shared/lib/calcFullPrice";
import { CartItem } from "@/entities/cart/model";
import { findSelectedSize } from "@/shared/lib";

interface CartStore {
  cart: CartItem[];
  productTotalAmount: number;
  fullPrice: number;
  error: string | null;
  isLoading: boolean;
  updateCart: (cart: CartItem[]) => void;
  modifyItemQuantity: (
    productId: number,
    sizeId: number,
    delta: number
  ) => Promise<void>;
  removeFromCart: (productId: number, sizeId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const calculateTotals = (cart: CartItem[]) => {
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

const findCartItemIndex = (
  cart: CartItem[],
  productId: number,
  sizeId: number
) =>
  cart.findIndex(
    (item) => item.product.id === productId && item.size_id === sizeId
  );

let debounceTimer: NodeJS.Timeout;
const debouncedUpdateCartFullPrice = (fullPrice: number) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    cartService.updateCartFullPrice(fullPrice);
  }, 500);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      productTotalAmount: 0,
      fullPrice: 0,
      isLoading: false,
      error: null,

      updateCart: (cart) => {
        set({ cart, ...calculateTotals(cart) });
      },

      modifyItemQuantity: async (productId, sizeId, delta) => {
        set({ isLoading: true, error: null });
        try {
          const { cart } = get();
          let newCart = [...cart];
          const itemIndex = findCartItemIndex(newCart, productId, sizeId);

          if (delta > 0) {
            const { newItem } = await cartService.addToCart(productId, sizeId);

            if (itemIndex !== -1) {
              newCart[itemIndex].quantity += delta;
            } else {
              newCart.push(newItem);
            }
          } else {
            await cartService.decreaseQuantity(productId, sizeId);

            if (itemIndex !== -1) {
              newCart[itemIndex].quantity += delta;
              if (newCart[itemIndex].quantity <= 0)
                newCart.splice(itemIndex, 1);
            }
          }

          set({ cart: newCart, ...calculateTotals(newCart), isLoading: false });
          debouncedUpdateCartFullPrice(get().fullPrice);
        } catch (error) {
          set({
            error: "Не удалось изменить количество товара",
            isLoading: false,
          });
          throw new Error("Ошибка при изменении количества товара");
        }
      },

      removeFromCart: async (productId, sizeId) => {
        set({ isLoading: true, error: null });
        try {
          const newCart = get().cart.filter(
            (item) => item.product.id !== productId || item.size_id !== sizeId
          );
          set({ cart: newCart, ...calculateTotals(newCart), isLoading: false });
          await cartService.removeFromCart(productId, sizeId);
          debouncedUpdateCartFullPrice(get().fullPrice);
        } catch (error) {
          console.error("Ошибка при удалении товара:", error);
          set({ error: "Не удалось удалить товар", isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          set({
            cart: [],
            productTotalAmount: 0,
            fullPrice: 0,
            isLoading: false,
          });
          await cartService.clearCart();
          debouncedUpdateCartFullPrice(0);
        } catch (error) {
          console.error("Ошибка при очистке корзины:", error);
          set({ error: "Не удалось очистить корзину", isLoading: false });
        }
      },
    }),
    { name: "cart-storage" }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "@/entities/cart/model/cartService";
import { CartItem } from "@/entities/cart/model";
import {
  calculateTotals,
  modifyQuantityAPI,
  updateCartQuantity,
} from "./cartUtils";
import { debouncedUpdateCartFullPrice } from "./cartDebounce";
import { enqueue } from "./cartQueue";

interface CartStore {
  cart: CartItem[];
  productTotalAmount: number;
  itemsCount: number;
  fullPrice: number;
  error: string | null;
  isLoading: boolean;
  modifyItemQuantity: (
    productId: number,
    sizeId: number,
    delta: number
  ) => Promise<void>;
  removeFromCart: (productId: number, sizeId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      productTotalAmount: 0,
      fullPrice: 0,
      itemsCount: 0,
      isLoading: false,
      isProductLoading: {},
      error: null,

      modifyItemQuantity: async (productId, sizeId, delta) => {
        const key = "cart";

        set({ isLoading: true, error: null });
        return enqueue(key, async () => {
          try {
            const currentCart = get().cart;
            const newItem = await modifyQuantityAPI(productId, sizeId, delta);

            const newCart = updateCartQuantity(
              currentCart,
              productId,
              sizeId,
              delta,
              newItem
            );

            set({
              cart: newCart,
              ...calculateTotals(newCart),
            });
            debouncedUpdateCartFullPrice(get().fullPrice);
          } catch (error) {
            set({
              error: "Не удалось изменить количество товара",
              isLoading: false,
            });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        });
      },

      removeFromCart: async (productId, sizeId) => {
        set({ isLoading: true, error: null });
        try {
          const newCart = get().cart.filter(
            (item) => item.product.id !== productId || item.size_id !== sizeId
          );
          set({
            cart: newCart,
            ...calculateTotals(newCart),
            isLoading: false,
          });
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
            ...calculateTotals([]),
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
    {
      name: "cart-storage",
      version: 2,
      migrate: (persistedState: any, version) => {
        if (version < 2) {
          return {
            cart: [],
            productTotalAmount: 0,
            fullPrice: 0,
            itemsCount: 0,
            isLoading: false,
            error: null,
          };
        }
        return persistedState as CartStore;
      },
    }
  )
);

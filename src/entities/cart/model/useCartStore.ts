import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "@/entities/cart/model/cartService";
import { CartItem } from "@/entities/cart/model";
import {
  calculateTotals,
  updateCartQuantity,
  modifyQuantityAPI,
} from "./cartUtils";

interface CartStore {
  cart: CartItem[];
  productTotalAmount: number;
  itemsCount: number;
  fullPrice: number;
  error: string | null;
  isLoading: boolean;

  modifyItemQuantity: (productSizeId: number, delta: number) => Promise<void>;
  removeFromCart: (productSizeId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      productTotalAmount: 0,
      itemsCount: 0,
      fullPrice: 0,
      isLoading: false,
      error: null,

      modifyItemQuantity: async (productSizeId, delta) => {
        set({ isLoading: true, error: null });

        try {
          const currentCart = get().cart;

          // API возвращает обновлённый item (или null если удалён)
          const updatedItem = await modifyQuantityAPI(productSizeId, delta);

          const newCart = updateCartQuantity(
            currentCart,
            productSizeId,
            delta,
            updatedItem
          );

          // Локально пересчитываем сумму корзины
          set({ cart: newCart, ...calculateTotals(newCart) });
        } catch (err) {
          console.error(err);
          set({ error: "Не удалось изменить количество товара" });
        } finally {
          set({ isLoading: false });
        }
      },

      removeFromCart: async (productSizeId) => {
        set({ isLoading: true, error: null });

        try {
          const newCart = get().cart.filter(
            (item) => item.productSizeId !== productSizeId
          );

          set({ cart: newCart, ...calculateTotals(newCart) });

          await cartService.removeFromCart(productSizeId);
        } catch (err) {
          console.error(err);
          set({ error: "Не удалось удалить товар" });
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });

        try {
          set({ cart: [], ...calculateTotals([]) });

          await cartService.clearCart();
        } catch (err) {
          console.error(err);
          set({ error: "Не удалось очистить корзину" });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "cart-storage",
      version: 3,
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

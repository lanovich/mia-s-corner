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

let lock = Promise.resolve();

const enqueue = (fn: () => Promise<void>) => {
  lock = lock.then(fn).catch(() => {});
  return lock;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      productTotalAmount: 0,
      itemsCount: 0,
      fullPrice: 0,
      isLoading: false,
      error: null,

      modifyItemQuantity: (productSizeId, delta) =>
        enqueue(async () => {
          const { cart } = get();
          set({ isLoading: true, error: null });

          try {
            const updatedItem = await modifyQuantityAPI(productSizeId, delta);

            const newCart = updateCartQuantity(
              cart,
              productSizeId,
              delta,
              updatedItem
            );

            set({ cart: newCart, ...calculateTotals(newCart) });
          } catch (err) {
            console.error(err);
            set({ error: "Не удалось изменить количество товара" });
          } finally {
            set({ isLoading: false });
          }
        }),

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

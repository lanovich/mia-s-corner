import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "@/services/cartService";
import { Product } from "@/types";
import { calcFullPrice } from "@/lib/calcFullPrice";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  productTotalAmount: number;
  fullPrice: number;
  loading: boolean;
  loadCart: () => Promise<void>;
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  decreaseQuantity: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      productTotalAmount: 0,
      fullPrice: 0,
      loading: true,

      loadCart: async () => {
        set({ loading: true });
        try {
          const cartItems = await cartService.loadCartItems();
          const productTotalAmount = cartItems.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
          );
          const fullPrice = calcFullPrice(productTotalAmount).finalAmount;

          set({
            cart: cartItems,
            productTotalAmount,
            fullPrice,
            loading: false,
          });

          await cartService.updateCartFullPrice(fullPrice);
        } catch (error) {
          console.error("Ошибка при загрузке корзины:", error);
          set({ loading: false });
        }
      },

      addToCart: async (productId) => {
        set({ loading: true });
        try {
          const { cart } = get();
          const existingItem = cart.find((item) => item.product.id === productId);
          let newTotal = get().productTotalAmount;

          if (existingItem) {
            newTotal += existingItem.product.price;
          }

          if (existingItem) {
            set({
              cart: cart.map((item) =>
                item.product.id === productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              productTotalAmount: newTotal,
              fullPrice: calcFullPrice(newTotal).finalAmount,
              loading: false,
            });
          } else {
            const product = await cartService.getProductById(productId);
            if (!product) return set({ loading: false });

            newTotal += product.price;

            set({
              cart: [...cart, { product, quantity: 1 }],
              productTotalAmount: newTotal,
              fullPrice: calcFullPrice(newTotal).finalAmount,
              loading: false,
            });
          }

          await cartService.addToCart(productId);

          await cartService.updateCartFullPrice(get().fullPrice);
        } catch (error) {
          console.error("Ошибка при добавлении товара:", error);
          set({ loading: false });
        }
      },

      decreaseQuantity: async (productId) => {
        set({ loading: true });
        try {
          const { cart } = get();
          const existingItem = cart.find((item) => item.product.id === productId);
          if (!existingItem) return set({ loading: false });

          let newTotal = get().productTotalAmount;

          if (existingItem.quantity > 1) {
            newTotal -= existingItem.product.price;
          }

          if (existingItem.quantity > 1) {
            set({
              cart: cart.map((item) =>
                item.product.id === productId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              ),
              productTotalAmount: newTotal,
              fullPrice: calcFullPrice(newTotal).finalAmount,
              loading: false,
            });
          } else {
            newTotal -= existingItem.product.price;
            set({
              cart: cart.filter((item) => item.product.id !== productId),
              productTotalAmount: newTotal,
              fullPrice: calcFullPrice(newTotal).finalAmount,
              loading: false,
            });
          }

          await cartService.decreaseQuantity(productId);

          await cartService.updateCartFullPrice(get().fullPrice);
        } catch (error) {
          console.error("Ошибка при уменьшении количества товара:", error);
          set({ loading: false });
        }
      },

      removeFromCart: async (productId) => {
        set({ loading: true });
        try {
          const { cart } = get();
          const existingItem = cart.find((item) => item.product.id === productId);
          if (!existingItem) return set({ loading: false });

          let newTotal =
            get().productTotalAmount -
            existingItem.product.price * existingItem.quantity;

          set({
            cart: cart.filter((item) => item.product.id !== productId),
            productTotalAmount: newTotal,
            fullPrice: calcFullPrice(newTotal).finalAmount,
            loading: false,
          });

          await cartService.removeFromCart(productId);

          await cartService.updateCartFullPrice(get().fullPrice);
        } catch (error) {
          console.error("Ошибка при удалении товара:", error);
          set({ loading: false });
        }
      },

      clearCart: async () => {
        set({ loading: true });
        try {
          await cartService.clearCart();
          set({ cart: [], productTotalAmount: 0, fullPrice: 0, loading: false });

          await cartService.updateCartFullPrice(0);
        } catch (error) {
          console.error("Ошибка при очистке корзины:", error);
          set({ loading: false });
        }
      },
    }),
    { name: "cart-storage" }
  )
);
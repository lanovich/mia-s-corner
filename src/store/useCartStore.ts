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
        const cartItems = await cartService.loadCartItems();
        const productTotalAmount = cartItems.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );
        set({
          cart: cartItems,
          productTotalAmount,
          fullPrice: calcFullPrice(productTotalAmount).finalAmount,
          loading: false,
        });
      },

      addToCart: async (productId) => {
        set({ loading: true });
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

        cartService.addToCart(productId).catch(() => get().loadCart());
      },

      decreaseQuantity: async (productId) => {
        set({ loading: true });
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

        cartService.decreaseQuantity(productId).catch(() => get().loadCart());
      },

      removeFromCart: async (productId) => {
        set({ loading: true });
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

        cartService.removeFromCart(productId).catch(() => get().loadCart());
      },

      clearCart: async () => {
        set({ loading: true });
        await cartService.clearCart();
        set({ cart: [], productTotalAmount: 0, fullPrice: 0, loading: false });
      },
    }),
    { name: "cart-storage" }
  )
);

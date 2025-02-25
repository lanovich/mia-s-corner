import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "@/services/cartService";
import { Product } from "@/types";
import { calcFullPrice } from "@/components/cart/lib/calcFullPrice";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  productTotalAmount: number;
  fullPrice: number;
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

      loadCart: async () => {
        const cartItems = await cartService.loadCartItems();
        const productTotalAmount = cartItems.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );

        set({
          cart: cartItems,
          productTotalAmount,
          fullPrice: calcFullPrice(productTotalAmount).finalAmount,
        });
      },

      addToCart: async (productId) => {
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
          });
        } else {
          const product = await cartService.getProductById(productId);
          if (!product) return;

          newTotal += product.price;

          set({
            cart: [...cart, { product, quantity: 1 }],
            productTotalAmount: newTotal,
            fullPrice: calcFullPrice(newTotal).finalAmount,
          });
        }

        cartService.addToCart(productId).catch(() => get().loadCart());
      },

      decreaseQuantity: async (productId) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.product.id === productId);
        if (!existingItem) return;

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
          });
        } else {
          newTotal -= existingItem.product.price;
          set({
            cart: cart.filter((item) => item.product.id !== productId),
            productTotalAmount: newTotal,
            fullPrice: calcFullPrice(newTotal).finalAmount,
          });
        }

        cartService.decreaseQuantity(productId).catch(() => get().loadCart());
      },

      removeFromCart: async (productId) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.product.id === productId);
        if (!existingItem) return;

        let newTotal =
          get().productTotalAmount -
          existingItem.product.price * existingItem.quantity;

        set({
          cart: cart.filter((item) => item.product.id !== productId),
          productTotalAmount: newTotal,
          fullPrice: calcFullPrice(newTotal).finalAmount,
        });

        cartService.removeFromCart(productId).catch(() => get().loadCart());
      },

      clearCart: async () => {
        await cartService.clearCart();
        set({ cart: [], productTotalAmount: 0, fullPrice: 0 });
      },
    }),
    { name: "cart-storage" }
  )
);

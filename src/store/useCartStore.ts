import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "@/services/cartService";
import { calcFullPrice } from "@/lib/calcFullPrice";
import { findSelectedSize } from "@/lib";

interface CartStore {
  cart: CartItem[];
  productTotalAmount: number;
  fullPrice: number;
  loading: boolean;
  loadCart: () => Promise<void>;
  updateCart: (cart: CartItem[]) => void;
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
      loading: false,

      loadCart: async () => {
        set({ loading: true });
        try {
          const cartItems = await cartService.loadCartItems();
          const productTotalAmount = cartItems.reduce(
            (acc, item) =>
              acc +
              (findSelectedSize(item.product, item.size_id)?.price || 0) *
                item.quantity,
            0
          );
          const fullPrice = calcFullPrice(productTotalAmount).finalAmount;
          set({
            cart: cartItems,
            productTotalAmount,
            fullPrice,
            loading: false,
          });
        } catch (error) {
          console.error("Ошибка при загрузке корзины:", error);
          set({ loading: false });
        }
      },

      updateCart: (cart) => {
        const productTotalAmount = cart.reduce(
          (acc, item) =>
            acc +
            (findSelectedSize(item.product, item.size_id)?.price || 0) *
              item.quantity,
          0
        );
        set({
          cart,
          productTotalAmount,
          fullPrice: calcFullPrice(productTotalAmount).finalAmount,
        });
      },

      modifyItemQuantity: async (productId, sizeId, delta) => {
        set({ loading: true });
        try {
          const { cart } = get();
          const itemIndex = cart.findIndex(
            (item) => item.product.id === productId && item.size_id === sizeId
          );
          if (itemIndex === -1 && delta < 0) return set({ loading: false });

          let newCart = [...cart];
          if (itemIndex !== -1) {
            const item = newCart[itemIndex];
            item.quantity += delta;
            if (item.quantity <= 0) newCart.splice(itemIndex, 1);
          } else {
            const product = await cartService.getProductById(productId);
            if (!product) return set({ loading: false });
            newCart.push({ product, quantity: 1, size_id: sizeId });
          }

          set({ cart: newCart, loading: false });
          get().updateCart(newCart);

          if (delta > 0) await cartService.addToCart(productId, sizeId);
          else await cartService.decreaseQuantity(productId, sizeId);
          await cartService.updateCartFullPrice(get().fullPrice);
        } catch (error) {
          console.error("Ошибка при изменении количества товара:", error);
          set({ loading: false });
        }
      },

      removeFromCart: async (productId, sizeId) => {
        set({ loading: true });
        try {
          const newCart = get().cart.filter(
            (item) => item.product.id !== productId || item.size_id !== sizeId
          );
          set({ cart: newCart, loading: false });
          get().updateCart(newCart);
          await cartService.removeFromCart(productId, sizeId);
          await cartService.updateCartFullPrice(get().fullPrice);
        } catch (error) {
          console.error("Ошибка при удалении товара:", error);
          set({ loading: false });
        }
      },

      clearCart: async () => {
        set({ loading: true });
        try {
          set({
            cart: [],
            productTotalAmount: 0,
            fullPrice: 0,
            loading: false,
          });
          await cartService.clearCart();
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

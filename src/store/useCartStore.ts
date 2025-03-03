import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "@/services/cartService";
import { calcFullPrice } from "@/lib/calcFullPrice";
import { findSelectedSize } from "@/lib";

export interface CartItem {
  product: Product;
  quantity: number;
  sizeId: number;
}

interface CartStore {
  cart: CartItem[];
  productTotalAmount: number;
  fullPrice: number;
  loading: boolean;
  loadCart: () => Promise<void>;
  addToCart: (productId: number, sizeId: number) => Promise<void>;
  removeFromCart: (productId: number, sizeId: number) => Promise<void>;
  decreaseQuantity: (productId: number, sizeId: number) => Promise<void>;
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
            (acc, item) => acc + (findSelectedSize(item.product, item.sizeId)?.price || 0) * item.quantity,
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

      addToCart: async (productId, sizeId) => {
        set({ loading: true });
        try {
          const { cart } = get();
          const existingItem = cart.find(
            (cartItem) =>
              cartItem.product.id === productId && cartItem.sizeId === sizeId
          );
          let newTotal = get().productTotalAmount;

          if (existingItem) {
            const size = findSelectedSize(existingItem.product, sizeId);
            if (!size) {
              console.error("Ошибка: не найден размер у уже существующего товара");
              return set({ loading: false });
            }

            newTotal += size.price;
            set({
              cart: cart.map((cartItem) =>
                cartItem.product.id === productId && cartItem.sizeId === sizeId
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
              productTotalAmount: newTotal,
              fullPrice: calcFullPrice(newTotal).finalAmount,
              loading: false,
            });
          } else {
            const product = await cartService.getProductById(productId);
            if (!product || !product.sizes.length) {
              console.error("Ошибка: товар не содержит размеров", product);
              return set({ loading: false });
            }

            const size = findSelectedSize(product, sizeId);
            if (!size) {
              console.error("Ошибка: не найден выбранный размер", sizeId);
              return set({ loading: false });
            }

            newTotal += size.price;
            set({
              cart: [...cart, { product, quantity: 1, sizeId }],
              productTotalAmount: newTotal,
              fullPrice: calcFullPrice(newTotal).finalAmount,
              loading: false,
            });
          }

          await cartService.addToCart(productId, sizeId);
          await cartService.updateCartFullPrice(get().fullPrice);
        } catch (error) {
          console.error("Ошибка при добавлении товара:", error);
          set({ loading: false });
        }
      },

      decreaseQuantity: async (productId, sizeId) => {
        set({ loading: true });
        try {
          const { cart } = get();
          const existingItem = cart.find(
            (item) => item.product.id === productId && item.sizeId === sizeId
          );
          if (!existingItem) return set({ loading: false });

          let newTotal = get().productTotalAmount;
          const size = findSelectedSize(existingItem.product, sizeId);
          if (!size) {
            console.error("Ошибка: не найден размер при уменьшении количества");
            return set({ loading: false });
          }

          if (existingItem.quantity > 1) {
            newTotal -= size.price;
            set({
              cart: cart.map((item) =>
                item.product.id === productId && item.sizeId === sizeId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              ),
              productTotalAmount: newTotal,
              fullPrice: calcFullPrice(newTotal).finalAmount,
              loading: false,
            });
          } else {
            newTotal -= size.price;
            set({
              cart: cart.filter(
                (item) =>
                  item.product.id !== productId || item.sizeId !== sizeId
              ),
              productTotalAmount: newTotal,
              fullPrice: calcFullPrice(newTotal).finalAmount,
              loading: false,
            });
          }

          await cartService.decreaseQuantity(productId, sizeId);
          await cartService.updateCartFullPrice(get().fullPrice);
        } catch (error) {
          console.error("Ошибка при уменьшении количества товара:", error);
          set({ loading: false });
        }
      },

      removeFromCart: async (productId, sizeId) => {
        set({ loading: true });
        try {
          const { cart } = get();
          const existingItem = cart.find(
            (item) => item.product.id === productId && item.sizeId === sizeId
          );
          if (!existingItem) return set({ loading: false });

          const size = findSelectedSize(existingItem.product, sizeId);
          if (!size) {
            console.error("Ошибка: не найден размер при удалении товара");
            return set({ loading: false });
          }

          let newTotal = get().productTotalAmount - size.price * existingItem.quantity;

          set({
            cart: cart.filter(
              (item) => item.product.id !== productId || item.sizeId !== sizeId
            ),
            productTotalAmount: newTotal,
            fullPrice: calcFullPrice(newTotal).finalAmount,
            loading: false,
          });

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
          await cartService.clearCart();
          set({
            cart: [],
            productTotalAmount: 0,
            fullPrice: 0,
            loading: false,
          });

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
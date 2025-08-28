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

const updateCartItemQuantity = async (
  cart: CartItem[],
  productId: number,
  sizeId: number,
  delta: number
) => {
  const itemIndex = findCartItemIndex(cart, productId, sizeId);
  if (itemIndex === -1 && delta < 0) return cart;

  const newCart = [...cart];
  if (itemIndex !== -1) {
    const item = newCart[itemIndex];
    item.quantity += delta;
    if (item.quantity <= 0) newCart.splice(itemIndex, 1);
  } else {
    const product = await cartService.getProductById(productId);
    if (product) newCart.push({ product, quantity: 1, size_id: sizeId });
  }

  return newCart;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      productTotalAmount: 0,
      fullPrice: 0,
      loading: false,
      error: null,

      loadCart: async () => {
        set({ loading: true, error: null });
        try {
          const cartItems = await cartService.loadCartItems();
          set({
            cart: cartItems,
            ...calculateTotals(cartItems),
            loading: false,
          });
        } catch (error) {
          console.error("Ошибка при загрузке корзины:", error);
          set({ error: "Не удалось загрузить корзину", loading: false });
        }
      },

      updateCart: (cart) => {
        set({ cart, ...calculateTotals(cart) });
      },

      modifyItemQuantity: async (productId, sizeId, delta) => {
        set({ loading: true, error: null });
        try {
          const { cart } = get();
          const newCart = await updateCartItemQuantity(
            cart,
            productId,
            sizeId,
            delta
          );
          set({ cart: newCart, ...calculateTotals(newCart), loading: false });

          if (delta > 0) await cartService.addToCart(productId, sizeId);
          else await cartService.decreaseQuantity(productId, sizeId);
          debouncedUpdateCartFullPrice(get().fullPrice);
        } catch (error) {
          console.error("Ошибка при изменении количества товара:", error);
          set({
            error: "Не удалось изменить количество товара",
            loading: false,
          });
        }
      },

      removeFromCart: async (productId, sizeId) => {
        set({ loading: true, error: null });
        try {
          const newCart = get().cart.filter(
            (item) => item.product.id !== productId || item.size_id !== sizeId
          );
          set({ cart: newCart, ...calculateTotals(newCart), loading: false });
          await cartService.removeFromCart(productId, sizeId);
          debouncedUpdateCartFullPrice(get().fullPrice);
        } catch (error) {
          console.error("Ошибка при удалении товара:", error);
          set({ error: "Не удалось удалить товар", loading: false });
        }
      },

      clearCart: async () => {
        set({ loading: true, error: null });
        try {
          set({
            cart: [],
            productTotalAmount: 0,
            fullPrice: 0,
            loading: false,
          });
          await cartService.clearCart();
          debouncedUpdateCartFullPrice(0);
        } catch (error) {
          console.error("Ошибка при очистке корзины:", error);
          set({ error: "Не удалось очистить корзину", loading: false });
        }
      },
    }),
    { name: "cart-storage" }
  )
);

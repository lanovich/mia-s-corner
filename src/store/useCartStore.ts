import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { getUserToken } from "@/lib";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  totalAmount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  loadCart: () => Promise<void>;
  mergeCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      totalAmount: 0,

      addToCart: async (product) => {
        const token = getUserToken();
        const userId = 3;

        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.product.id === product.id
          );
          const updatedCart = existingItem
            ? state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...state.cart, { product, quantity: 1 }];

          supabase.from("cart").upsert([
            {
              token,
              user_id: userId,
              cart: JSON.stringify(updatedCart),
              updated_at: new Date().toISOString(),
            },
          ]);

          return {
            cart: updatedCart,
            totalAmount: updatedCart.reduce(
              (acc, item) => acc + item.product.price * item.quantity,
              0
            ),
          };
        });
      },

      removeFromCart: async (productId) => {
        const token = getUserToken();
        const userId = 3;

        set((state) => {
          const updatedCart = state.cart.filter(
            (item) => item.product.id !== productId
          );

          supabase.from("cart").upsert([
            {
              token,
              user_id: userId,
              cart: JSON.stringify(updatedCart),
              updated_at: new Date().toISOString(),
            },
          ]);

          return {
            cart: updatedCart,
            totalAmount: updatedCart.reduce(
              (acc, item) => acc + item.product.price * item.quantity,
              0
            ),
          };
        });
      },

      decreaseQuantity: async (productId) => {
        const token = getUserToken();
        const userId = 3;

        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item.product.id === productId && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );

          supabase.from("cart").upsert([
            {
              token,
              user_id: userId,
              cart: JSON.stringify(updatedCart),
              updated_at: new Date().toISOString(),
            },
          ]);

          return {
            cart: updatedCart,
            totalAmount: updatedCart.reduce(
              (acc, item) => acc + item.product.price * item.quantity,
              0
            ),
          };
        });
      },

      loadCart: async () => {
        const token = getUserToken();
        const userId = 3;

        let data;
        if (userId) {
          const response = await supabase
            .from("cart")
            .select("cart")
            .eq("user_id", userId)
            .single();
          data = response.data;
        } else {
          const response = await supabase
            .from("cart")
            .select("cart")
            .eq("token", token)
            .single();
          data = response.data;
        }

        if (data) {
          const parsedCart = JSON.parse(data.cart);
          set({
            cart: parsedCart,
            totalAmount: parsedCart.reduce(
              (
                acc: number,
                item: { product: { price: number }; quantity: number }
              ) => acc + item.product.price * item.quantity,
              0
            ),
          });
        }
      },

      mergeCart: async () => {
        const token = getUserToken();
        const userId = 3;
        if (!userId) return;

        const guestCartResponse = await supabase
          .from("cart")
          .select("cart")
          .eq("token", token)
          .single();
        const userCartResponse = await supabase
          .from("cart")
          .select("cart")
          .eq("user_id", userId)
          .single();

        const guestCart = guestCartResponse.data
          ? JSON.parse(guestCartResponse.data.cart)
          : [];
        const userCart = userCartResponse.data
          ? JSON.parse(userCartResponse.data.cart)
          : [];

        const mergedCart = [...userCart];

        guestCart.forEach(
          (guestItem: { product: { id: any }; quantity: any }) => {
            const existingItem = mergedCart.find(
              (item) => item.product.id === guestItem.product.id
            );
            if (existingItem) {
              existingItem.quantity += guestItem.quantity;
            } else {
              mergedCart.push(guestItem);
            }
          }
        );

        await supabase.from("cart").upsert([
          {
            user_id: userId,
            cart: JSON.stringify(mergedCart),
            updated_at: new Date().toISOString(),
          },
        ]);

        await supabase.from("cart").delete().eq("token", token);

        set({
          cart: mergedCart,
          totalAmount: mergedCart.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
          ),
        });
      },
    }),
    { name: "cart-storage" }
  )
);

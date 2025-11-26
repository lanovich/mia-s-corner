import { API, apiFetch } from "@/shared/api";
import { CartItem } from "@/entities/cart/model";

export const cartApi = {
  fetchUserToken: () =>
    apiFetch<{ token: string }>(API.cart.getToken, { revalidate: 60 }),

  getItemByProductSizeId: (productSizeId: number, token: string) =>
    apiFetch<CartItem>(API.cart.getItem(productSizeId), {
      headers: { Authorization: `Bearer ${token}` },
    }),

  addToCart: (productSizeId: number, delta: number, token: string) =>
    apiFetch<{ newItem: CartItem }>(API.cart.add, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productSizeId, delta }),
    }),

  decreaseQuantity: (productSizeId: number, delta: number, token: string) =>
    apiFetch<{ message: string }>(API.cart.decrease, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productSizeId, delta }),
    }),

  removeFromCart: (productSizeId: number, token: string) =>
    apiFetch<void>(API.cart.remove, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productSizeId }),
    }),

  clearCart: (token: string) =>
    apiFetch<void>(API.cart.clear, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateCartFullPrice: (fullPrice: number, token: string) =>
    apiFetch<void>(API.cart.updatePrice, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullPrice }),
    }),
};

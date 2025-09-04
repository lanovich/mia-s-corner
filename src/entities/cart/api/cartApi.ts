import { API, apiFetch } from "@/shared/api";
import { CartItem } from "@/entities/cart/model";

export const cartApi = {
  fetchUserToken: () =>
    apiFetch<{ token: string }>(API.cart.getToken, { revalidate: 60 }),

  getProductById: (productId: number, token: string) =>
    apiFetch<CartItem>(API.cart.getProduct(productId), {
      headers: { Authorization: `Bearer ${token}` },
    }),

  addToCart: (productId: number, sizeId: number, token: string) =>
    apiFetch<{ newItem: CartItem }>(API.cart.add, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, sizeId }),
    }),

  decreaseQuantity: (productId: number, sizeId: number, token: string) =>
    apiFetch<Promise<{ message: string }>>(API.cart.decrease, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, sizeId }),
    }),

  removeFromCart: (productId: number, sizeId: number, token: string) =>
    apiFetch<void>(API.cart.remove, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, sizeId }),
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

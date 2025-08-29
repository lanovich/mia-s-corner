import { API_ROUTES, apiFetch } from "@/shared/api";
import { CartItem } from "@/entities/cart/model";

export const cartApi = {
  fetchUserToken: () =>
    apiFetch<{ token: string }>(API_ROUTES.userToken, { revalidate: 60 }),

  loadCartItems: (token: string) =>
    apiFetch<CartItem[]>(API_ROUTES.loadCart, {
      headers: { Authorization: `Bearer ${token}` },
      revalidate: 60,
    }),

  getProductById: (productId: number, token: string) =>
    apiFetch<CartItem>(API_ROUTES.cartProduct(productId), {
      headers: { Authorization: `Bearer ${token}` },
    }),

  addToCart: (productId: number, sizeId: number, token: string) =>
    apiFetch<CartItem[]>(API_ROUTES.addToCart, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, sizeId }),
    }),

  decreaseQuantity: (productId: number, sizeId: number, token: string) =>
    apiFetch<CartItem[]>(API_ROUTES.decreaseCart, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, sizeId }),
    }),

  removeFromCart: (productId: number, sizeId: number, token: string) =>
    apiFetch<void>(API_ROUTES.removeFromCart, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, sizeId }),
    }),

  clearCart: (token: string) =>
    apiFetch<void>(API_ROUTES.clearCart, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateCartFullPrice: (fullPrice: number, token: string) =>
    apiFetch<void>(API_ROUTES.updateCartPrice, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullPrice }),
    }),
};

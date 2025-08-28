import axios from "axios";
import { getUserToken } from "@/lib/getUserToken";
import { CartItem } from "@/entities/cart/model";

export const cartService = {
  async loadCartItems() {
    const token = await getUserToken();
    const response = await axios.get("/api/cart/load", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as CartItem[];
  },

  async getProductById(productId: number) {
    const token = await getUserToken();
    const res = await axios.get(`/api/cart/product/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  async addToCart(productId: number, sizeId: number) {
    const token = await getUserToken();
    const response = await axios.post(
      "/api/cart/add",
      { productId, sizeId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data as CartItem[];
  },

  async decreaseQuantity(productId: number, sizeId: number) {
    const token = await getUserToken();
    const response = await axios.post(
      "/api/cart/decrease",
      { productId, sizeId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data as CartItem[];
  },

  async updateCartFullPrice(fullPrice: number, p0?: { signal: AbortSignal; }) {
    const token = await getUserToken();
    await axios.post(
      "/api/cart/update-price",
      { fullPrice },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  async removeFromCart(productId: number, sizeId: number) {
    const token = await getUserToken();
    await axios.post(
      "/api/cart/remove",
      { productId, sizeId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  async clearCart() {
    const token = await getUserToken();
    await axios.post(
      "/api/cart/clear",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};

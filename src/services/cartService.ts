import axios from "axios";
import { getUserToken } from "@/lib/getUserToken"

export const cartService = {
  async loadCartItems() {
    const token = await getUserToken();
    const res = await axios.get("/api/cart/load", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
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
    await axios.post(
      "/api/cart/add",
      { productId, sizeId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  async decreaseQuantity(productId: number, sizeId: number) {
    const token = await getUserToken();
    await axios.post(
      "/api/cart/decrease",
      { productId, sizeId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  async updateCartFullPrice(fullPrice: number) {
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

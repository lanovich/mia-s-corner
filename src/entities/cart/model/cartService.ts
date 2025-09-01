import Cookies from "js-cookie";
import { cartApi } from "../api";
import { CartItem } from "@/entities/cart/model";

export const cartService = {
  async getUserToken() {
    const cookieToken = Cookies.get("user_token");

    if (cookieToken) {
      return cookieToken;
    }

    const tokenData = await cartApi.fetchUserToken();
    return tokenData.token;
  },

  async getProductById(productId: number) {
    const token = await this.getUserToken();
    return cartApi.getProductById(productId, token);
  },

  async addToCart(
    productId: number,
    sizeId: number
  ): Promise<{ newItem: CartItem }> {
    const token = await this.getUserToken();
    return cartApi.addToCart(productId, sizeId, token);
  },

  async decreaseQuantity(
    productId: number,
    sizeId: number
  ): Promise<CartItem[]> {
    const token = await this.getUserToken();
    return cartApi.decreaseQuantity(productId, sizeId, token);
  },

  async removeFromCart(productId: number, sizeId: number) {
    const token = await this.getUserToken();
    return cartApi.removeFromCart(productId, sizeId, token);
  },

  async clearCart() {
    const token = await this.getUserToken();
    return cartApi.clearCart(token);
  },

  async updateCartFullPrice(fullPrice: number) {
    const token = await this.getUserToken();
    return cartApi.updateCartFullPrice(fullPrice, token);
  },
};

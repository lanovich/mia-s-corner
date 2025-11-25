import Cookies from "js-cookie";
import { cartApi } from "../api";
import { CartItem } from "./types";

export const cartService = {
  async getUserToken() {
    let token = Cookies.get("user_token");

    if (!token) {
      const tokenData = await cartApi.fetchUserToken();

      if (!tokenData || !tokenData.token) {
        throw new Error("Failed to fetch user token");
      }

      token = tokenData.token;

      Cookies.set("user_token", token, { expires: 30 });
    }

    return token;
  },
  async getProductById(productSizeId: number) {
    const token = await this.getUserToken();
    return cartApi.getItemByProductSizeId(productSizeId, token);
  },

  async addToCart(
    productSizeId: number,
    delta: number
  ): Promise<CartItem | undefined> {
    const token = await this.getUserToken();
    const response = await cartApi.addToCart(productSizeId, delta, token);

    if (!response || !response.newItem) {
      return undefined;
    }

    return response.newItem;
  },

  async decreaseQuantity(productSizeId: number, delta: number) {
    const token = await this.getUserToken();
    return cartApi.decreaseQuantity(productSizeId, delta, token);
  },

  async removeFromCart(productSizeId: number) {
    const token = await this.getUserToken();
    return cartApi.removeFromCart(productSizeId, token);
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

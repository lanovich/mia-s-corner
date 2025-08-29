import { cartApi } from "../api";
import { CartItem } from "@/entities/cart/model";

export const cartService = {
  async fetchUserToken() {
    const tokenData = await cartApi.fetchUserToken();
    return tokenData.token;
  },

  async loadCartItems(): Promise<CartItem[]> {
    const token = await this.fetchUserToken();
    return cartApi.loadCartItems(token);
  },

  async getProductById(productId: number) {
    const token = await this.fetchUserToken();
    return cartApi.getProductById(productId, token);
  },

  async addToCart(productId: number, sizeId: number): Promise<CartItem[]> {
    const token = await this.fetchUserToken();
    return cartApi.addToCart(productId, sizeId, token);
  },

  async decreaseQuantity(
    productId: number,
    sizeId: number
  ): Promise<CartItem[]> {
    const token = await this.fetchUserToken();
    return cartApi.decreaseQuantity(productId, sizeId, token);
  },

  async removeFromCart(productId: number, sizeId: number) {
    const token = await this.fetchUserToken();
    return cartApi.removeFromCart(productId, sizeId, token);
  },

  async clearCart() {
    const token = await this.fetchUserToken();
    return cartApi.clearCart(token);
  },

  async updateCartFullPrice(fullPrice: number) {
    const token = await this.fetchUserToken();
    return cartApi.updateCartFullPrice(fullPrice, token);
  },
};

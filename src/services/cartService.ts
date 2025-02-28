import { getUserToken } from "@/lib";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";

export const cartService = {
  async getCart() {
    const token = await getUserToken();

    const { data: existingCart, error } = await supabase
      .from("cart")
      .select("id")
      .eq("token", token)
      .maybeSingle();

    if (error) {
      console.error("Ошибка при получении корзины:", error.message);
      return null;
    }

    if (existingCart) return existingCart.id;

    const { data: newCart, error: insertError } = await supabase
      .from("cart")
      .insert([{ token }])
      .select("id")
      .maybeSingle();

    if (insertError) {
      console.error("Ошибка при создании корзины:", insertError.message);
      return null;
    }

    return newCart?.id;
  },

  async getProductById(productId: number) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Ошибка при получении товара:", error.message);
      return null;
    }

    return data;
  },

  async loadCartItems() {
    const cartId = await this.getCart();
    if (!cartId) return [];

    const { data, error } = await supabase
      .from("cartItem")
      .select("id, product_id, quantity, product:products(*)")
      .eq("cart_id", cartId);

    if (error) throw new Error(error.message);

    return (
      data?.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product ?? {},
      })) || []
    );
  },

  async addToCart(productId: number) {
    const cartId = await this.getCart();
    if (!cartId) return;

    const { data: existingItem, error } = await supabase
      .from("cartItem")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .maybeSingle();

    if (error) {
      console.error("Ошибка при проверке товара в корзине:", error.message);
      return;
    }

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("cartItem")
        .update({ quantity: existingItem.quantity + 1 })
        .eq("id", existingItem.id);

      if (updateError)
        console.error("Ошибка при обновлении количества:", updateError.message);
    } else {
      const { error: insertError } = await supabase
        .from("cartItem")
        .insert([{ cart_id: cartId, product_id: productId, quantity: 1 }]);

      if (insertError)
        console.error("Ошибка при добавлении товара:", insertError.message);
    }
  },

  async decreaseQuantity(productId: number) {
    const cartId = await this.getCart();
    if (!cartId) return;

    const { data: existingItem } = await supabase
      .from("cartItem")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .maybeSingle();

    if (existingItem && existingItem.quantity > 1) {
      await supabase
        .from("cartItem")
        .update({ quantity: existingItem.quantity - 1 })
        .eq("id", existingItem.id);
    } else {
      await this.removeFromCart(productId);
    }
  },

  async updateCartFullPrice(fullPrice: number) {
    const token = await getUserToken();
    if (!token) return;

    const { error } = await supabase
      .from("cart")
      .update({ fullPrice })
      .eq("token", token);

    if (error) {
      console.error("Ошибка при обновлении fullPrice:", error.message);
    }
  },

  async removeFromCart(productId: number) {
    const cartId = await this.getCart();
    if (!cartId) return;

    await supabase
      .from("cartItem")
      .delete()
      .eq("cart_id", cartId)
      .eq("product_id", productId);
  },

  async clearCart() {
    const cartId = await this.getCart();
    if (!cartId) return;

    await supabase.from("cartItem").delete().eq("cart_id", cartId);
  },
};

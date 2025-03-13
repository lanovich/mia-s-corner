import { getUserToken } from "@/lib";
import { supabase } from "@/lib/supabase";
import { CartItem } from "@/store/useCartStore";

export const cartService = {
  async getCart() {
    const token = await getUserToken();
    if (!token) return null;

    let { data: existingCart, error } = await supabase
      .from("cart")
      .select("id")
      .eq("token", token)
      .maybeSingle();

    if (error) {
      console.error("Ошибка при получении корзины:", error.message);
      return null;
    }

    if (existingCart) return existingCart.id;

    let { data: newCart, error: insertError } = await supabase
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
      .select("*, sizes:sizes(*)")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Ошибка при получении товара:", error.message);
      return null;
    }

    return {
      ...data,
      sizes: data.sizes ?? [],
    };
  },

  async loadCartItems(): Promise<CartItem[]> {
    const cartId = await this.getCart();
    if (!cartId) return [];

    const { data, error } = await supabase
      .from("cartItem")
      .select(
        "id, quantity, size_id, product:products(id, title, history_id, category_id, compound, slug, category_slug, scent_pyramid, description, images, wick, wax, measure, episode, sizes:sizes(*))"
      )
      .eq("cart_id", cartId);

    if (error) {
      console.error("Ошибка при загрузке корзины:", error.message);
      return [];
    }

    return (
      data?.map((item): CartItem => {
        const product = Array.isArray(item.product)
          ? item.product[0]
          : item.product;

        return {
          quantity: item.quantity,
          sizeId: item.size_id,
          product: product
            ? {
                id: product.id,
                title: product.title,
                history_id: product.history_id,
                category_id: product.category_id,
                compound: product.compound,
                slug: product.slug,
                category_slug: product.category_slug,
                scent_pyramid: product.scent_pyramid,
                description: product.description,
                images: product.images,
                wick: product.wick,
                wax: product.wax,
                sizes: product.sizes ?? [],
                episode: product.episode,
                measure: product.measure,
              }
            : {
                id: null,
                title: "",
                history_id: null,
                category_id: null,
                compound: "",
                slug: "",
                category_slug: "",
                scent_pyramid: "",
                description: "",
                images: [],
                wick: "",
                wax: "",
                sizes: [],
                episode: "",
                measure: "мл",
              },
        };
      }) || []
    );
  },

  async addToCart(productId: number, sizeId: number) {
    const cartId = await this.getCart();
    if (!cartId) return;
  
    const { data: existingItem, error } = await supabase
      .from("cartItem")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .eq("size_id", sizeId)
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
  
      if (updateError) {
        console.error("Ошибка при обновлении количества:", updateError.message);
      }
    } else {
      const { error: insertError } = await supabase.from("cartItem").insert([
        {
          cart_id: cartId,
          product_id: productId,
          quantity: 1,
          size_id: sizeId,
        },
      ]);
  
      if (insertError) {
        console.error("Ошибка при добавлении товара:", insertError.message);
      }
    }
  },

  async decreaseQuantity(productId: number, sizeId: number) {
    const cartId = await this.getCart();
    if (!cartId) return;

    const { data: existingItem } = await supabase
      .from("cartItem")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .eq("size_id", sizeId)
      .maybeSingle();

    if (existingItem && existingItem.quantity > 1) {
      await supabase
        .from("cartItem")
        .update({ quantity: existingItem.quantity - 1 })
        .eq("id", existingItem.id);
    } else {
      await this.removeFromCart(productId, sizeId);
    }
  },

  async updateCartFullPrice(fullPrice: number) {
    if (typeof fullPrice !== "number" || isNaN(fullPrice)) {
      console.error("Ошибка: fullPrice должен быть числом.");
      return;
    }

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

  async removeFromCart(productId: number, sizeId: number) {
    const cartId = await this.getCart();
    if (!cartId) return;

    const { error } = await supabase
      .from("cartItem")
      .delete()
      .eq("cart_id", cartId)
      .eq("size_id", sizeId)
      .eq("product_id", productId);

    if (error) {
      console.error("Ошибка при удалении товара:", error.message);
    }
  },

  async clearCart() {
    const cartId = await this.getCart();
    if (!cartId) return;

    const { error } = await supabase
      .from("cartItem")
      .delete()
      .eq("cart_id", cartId);

    if (error) {
      console.error("Ошибка при очистке корзины:", error.message);
    }
  },
};

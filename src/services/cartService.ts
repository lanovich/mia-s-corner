import { getUserToken } from "@/lib";
import { supabase } from "@/lib/supabase";

export const cartService = {
  async loadCartItems(): Promise<CartItem[]> {
    const token = await getUserToken();
    if (!token) return [];

    const { data, error } = await supabase
      .from("cart")
      .select(
        `
          id,
          cartItems:cartItem(
            id, quantity, size_id,
            product:products(
              id, title, history_id, category_id, compound, slug, category_slug,
              scent_pyramid, description, images, wick, wax, measure, episode,
              product_sizes:product_sizes!product_id(
                *,
                size:size_id(*)
              )
            )
          )
        `
      )
      .eq("token", token)
      .single();

    if (error || !data) {
      console.error("Ошибка при загрузке корзины:", error?.message);
      return [];
    }

    return (
      data.cartItems?.map((item): CartItem => {
        const product = Array.isArray(item.product)
          ? item.product[0]
          : item.product;

        return {
          size_id: item.size_id,
          quantity: item.quantity,
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
                episode_number: product.episode_number,
                product_sizes: product.product_sizes.map(
                  (productSize: ProductSize) => ({
                    ...productSize.size,
                    price: productSize.price,
                    oldPrice: productSize.oldPrice,
                    quantity_in_stock: productSize.quantity_in_stock,
                    is_default: productSize.is_default,
                  })
                ),
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
                episode_number: null,
                product_sizes: [],
                episode: "",
                measure: "мл",
              },
        };
      }) || []
    );
  },

  async getProductById(productId: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
          *,
          product_sizes:product_sizes!product_id(
            *,
            size:size_id(*)
          )
        `
      )
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Ошибка при получении товара:", error.message);
      return null;
    }

    return {
      ...data,
      sizes: data.product_sizes.map((productSize: ProductSize) => ({
        ...productSize.size,
        price: productSize.price,
        oldPrice: productSize.oldPrice,
        quantity_in_stock: productSize.quantity_in_stock,
        is_default: productSize.is_default,
      })),
    };
  },

  async addToCart(productId: number, sizeId: number) {
    const token = await getUserToken();
    if (!token) return;

    const { error } = await supabase.rpc("add_to_cart", {
      p_token: token,
      p_product_id: productId,
      p_size_id: sizeId,
    });

    if (error) {
      console.error("Ошибка при добавлении товара в корзину:", error.message);
    } else {
      console.log("Товар успешно добавлен в корзину!");
    }
  },

  async decreaseQuantity(productId: number, sizeId: number) {
    const token = await getUserToken();
    if (!token) return;

    try {
      const response = await fetch("/api/decrease-quantity-in-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, productId, sizeId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка при уменьшении количества:", errorData.error);
        return;
      }

      const result = await response.json();
      console.log("Количество успешно уменьшено:", result);
    } catch (error) {
      console.error("Ошибка при вызове API:", error);
    }
  },

  async updateCartFullPrice(fullPrice: number) {
    if (typeof fullPrice !== "number" || isNaN(fullPrice)) {
      console.error("Ошибка: fullPrice должен быть числом.");
      return;
    }

    const token = await getUserToken();
    if (!token) return;

    try {
      const response = await fetch("/api/update-cart-full-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, fullPrice }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка при обновлении fullPrice:", errorData.error);
        return;
      }

      const result = await response.json();
      console.log("fullPrice успешно обновлён:", result);
    } catch (error) {
      console.error("Ошибка при вызове API:", error);
    }
  },

  async removeFromCart(productId: number, sizeId: number) {
    const token = await getUserToken();
    if (!token) return;

    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("id")
      .eq("token", token)
      .maybeSingle();

    if (cartError || !cart) {
      console.error("Ошибка при поиске корзины:", cartError?.message);
      return;
    }

    const cartId = cart.id;

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
    const token = await getUserToken();
    if (!token) return;

    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("id")
      .eq("token", token)
      .maybeSingle();

    if (cartError || !cart) {
      console.error("Ошибка при поиске корзины:", cartError?.message);
      return;
    }

    const cartId = cart.id;

    const { error } = await supabase
      .from("cartItem")
      .delete()
      .eq("cart_id", cartId);

    if (error) {
      console.error("Ошибка при очистке корзины:", error.message);
    }
  },
};

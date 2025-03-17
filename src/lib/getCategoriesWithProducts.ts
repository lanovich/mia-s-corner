import { CategoryWithProducts } from "@/types";
import { supabase } from "./supabase";

export const getCategoriesWithProducts = async (): Promise<
  CategoryWithProducts[]
> => {
  console.log("🔄 Запрос категорий с товарами...");

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      products:products!category_id(
        *,
        product_sizes:product_sizes!product_id(
          product_id,
          size_id,
          price,
          oldPrice,
          quantity_in_stock,
          is_default,
          size:size_id(id, size, time_of_exploitation, dimensions)
        )
      )
    `
    )
    .order("order");
    
    
  if (error) {
    console.error("❌ Ошибка загрузки категорий с товарами:", error);
    return [];
  }
  
  console.log("✅ Загрузка категорий с продуктами завершена");

  return data.map((category: CategoryWithProducts) => ({
    id: category.id,
    image: category.image,
    name: category.name,
    slug: category.slug,
    order: category.order,
    products: category.products.slice(0, 10).map((product) => ({
      ...product,
      product_sizes: product.product_sizes.map((productSize) => ({
        product_id: productSize.product_id,
        size_id: productSize.size_id,
        price: productSize.price,
        oldPrice: productSize.oldPrice,
        quantity_in_stock: productSize.quantity_in_stock,
        is_default: productSize.is_default,
        size: productSize.size,
      })),
    })),
  }));
};

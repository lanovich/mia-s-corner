import { supabase } from "@/shared/api/supabase/server";
import { Category } from "@/entities/category/model";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image, order");

  if (error) throw new Error(error.message);

  return (data ?? []).sort((a, b) => a.order - b.order);
}

import { CategoryWithProducts } from "@/entities/category/model";

export async function getCategoriesWithProducts(): Promise<
  CategoryWithProducts[]
> {
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
    throw new Error(error.message);
  }

  return (data as CategoryWithProducts[]).map((category) => ({
    id: category.id,
    image: category.image,
    name: category.name,
    slug: category.slug,
    order: category.order,
    products: category.products.slice(0, 10).map((product) => ({
      ...product,
      product_sizes: product.product_sizes.map((ps) => ({
        product_id: ps.product_id,
        size_id: ps.size_id,
        price: ps.price,
        oldPrice: ps.oldPrice,
        quantity_in_stock: ps.quantity_in_stock,
        is_default: ps.is_default,
        size: ps.size,
      })),
    })),
  }));
}

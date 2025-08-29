import { NextResponse } from "next/server";
import { supabase } from "@/shared/api/supabase/server";
import { CategoryWithProducts } from "@/entities/category/model";

export async function GET() {
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const categories = (data as CategoryWithProducts[]).map((category) => ({
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

  return NextResponse.json(categories, {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}

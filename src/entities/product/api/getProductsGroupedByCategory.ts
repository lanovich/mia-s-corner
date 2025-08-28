import { supabase } from "@/shared/api/supabase/client";
import {
  Product,
  ProductsByCategory,
  ProductSize,
  SizeDetails,
} from "@/entities/product/model";
import { CATEGORY_SLUG_MAP } from "@/entities/category/model";

interface RawSize {
  id: number;
  time_of_exploitation: string | null;
  dimensions: { x: number; y: number; z: number } | null;
  size: string | null;
}

export const getProductsGroupedByCategory =
  async (): Promise<ProductsByCategory> => {
    const { data, error } = await supabase
      .from("product_sizes")
      .select(
        `
      id,
      quantity_in_stock,
      price,
      oldPrice,
      is_default,
      size_id,
      product_id,
      sizes:size_id (
        id,
        time_of_exploitation,
        dimensions,
        size,
        category_name
      ),
      products:product_id (
        id,
        title,
        description,
        measure,
        slug,
        category_slug
      )
    `
      )
      .returns<
        (ProductSize & {
          sizes: RawSize | null;
          products: Product | null;
        })[]
      >();

    if (error) {
      console.error("Error fetching product sizes:", error);
      return {};
    }

    const result: ProductsByCategory = {};

    data.forEach((item) => {
      if (!item.products || !item.sizes) return;

      const categorySlug = item.products.category_slug;
      const product = item.products;
      const size = item.sizes;

      if (!result[categorySlug]) {
        result[categorySlug] = [];
      }

      let categoryProduct = result[categorySlug].find(
        (p) => p.product.id === product.id
      );

      if (!categoryProduct) {
        categoryProduct = {
          categorizedQuantity: 0,
          product: {
            id: product.id,
            title: product.title,
            product_description: product.description,
            measure: product.measure,
            slug: product.slug,
            category: {
              slug: product.category_slug,
              name: CATEGORY_SLUG_MAP[product.category_slug],
            },
            sizes: [],
          },
        };
        result[categorySlug].push(categoryProduct);
      }

      const sizeDetail: SizeDetails = {
        id: size.id,
        timeOfExploitation: size.time_of_exploitation,
        dimensions: size.dimensions,
        size: size.size,
        quantity: item.quantity_in_stock,
        price: item.price,
        oldPrice: item.oldPrice ?? null,
        isDefault: item.is_default,
      };

      categoryProduct.product.sizes.push(sizeDetail);
      categoryProduct.categorizedQuantity += item.quantity_in_stock;
    });

    return result;
  };

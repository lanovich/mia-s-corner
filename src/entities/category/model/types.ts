import { SizeDetails } from "@X/entities/product/model";
import { Product } from "@/entities/product/model";

export interface CategoryWithProducts extends Category {
  products: Product[];
}

export type Category = {
  id: number;
  image: string;
  name: string;
  slug: string;
  order: number;
};

export interface CategoryOption {
  id: number;
  title: string;
  slug: string;
  compound?: string;
  quantity?: number;
}

export interface CategoryProduct {
  categorizedQuantity: number;
  product: {
    id: number;
    title: string;
    product_description: string | null;
    measure: string | null;
    slug: string;
    category: {
      slug: string;
      name?: string;
    };
    sizes: SizeDetails[];
  };
}

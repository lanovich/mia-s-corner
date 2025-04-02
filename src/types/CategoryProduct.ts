import { SizeDetails } from "./SizeDetails";

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

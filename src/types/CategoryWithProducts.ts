import { Product } from "./Product";

export interface CategoryWithProducts {
  id: number;
  name: string;
  products: Product[];
}

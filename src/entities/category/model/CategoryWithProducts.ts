import { Product } from "@/entities/product/model";
import { Category } from "./Category";

export interface CategoryWithProducts extends Category {
  products: Product[];
}

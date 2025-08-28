import { ImageType } from "@/shared/types";
import { ProductSize } from "./ProductSize";
import { ScentPyramid } from "./ScentPyramid";

export type Product = {
  category_id: number;
  category_slug: string;
  compound: string;
  description: string;
  episode: string | null;
  history_id: number;
  id: number;
  images: ImageType[];
  measure: string;
  title: string;
  slug: string;
  product_sizes: ProductSize[];
  scent_pyramid: ScentPyramid;
  episode_number: number;
};

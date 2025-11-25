import { Category } from "@/entities/category/model";
import { Episode } from "@/entities/history/model";

export interface Scent {
  id: number;
  name: string;
  scentPyramid?: {
    top: string[];
    heart: string[];
    base: string[];
  };
  description?: string;
}

export interface ShortProductSize {
  id: number;
  price: number;
  oldPrice: number | null;
  image?: string;
  volume: { amount: number | null; unit: string | null };
  stock: number;
  props?: Record<string, any>;
}

export interface ProductSize extends Omit<ShortProductSize, "image"> {
  images: string[];
  isDefault: boolean;
}

export interface Size {
  id: number;
  volume: { amount: number | null; unit: string | null };
  categoryId: number;
  unit: string;
  timeOfExploitation?: number;
}

export interface ShortProduct {
  id: number;
  title: string;
  slug?: string;
  isLimited: boolean;

  episode?: {
    number?: number;
    title?: string;
  };

  scent?: {
    name: string;
  };

  size: ShortProductSize;
  categorySlug: string;
}

export interface GroupedShortProducts {
  categoryInfo: Category;
  products: ShortProduct[];
}

export interface GroupedFullProducts {
  categoryInfo: Category;
  products: Product[];
}

export interface Product {
  id: number;
  title: string;
  slug?: string;
  isLimited: boolean;
  mainImage?: string;
  storyText?: string;
  description?: string;

  category: Category;

  sizes: ProductSize[];
  scent?: Scent;
  episode?: Episode | null;
}

export interface ProductCreateDto {
  title: string;
  slug?: string;
  isLimited?: boolean;
  storyText?: string;
  description?: string;

  categoryId: number;
  historyId?: number;
  scentId?: number;
  episodeId?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  order: number;
}

export interface CategoryOption extends Category {
  stockQuantity: number;
}

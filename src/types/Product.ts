type Product = {
  category_id: number;
  category_slug: string;
  compound: string;
  description: string;
  episode: string | null;
  history_id: number;
  id: number;
  images: Image[];
  measure: string;
  title: string;
  slug: string;
  product_sizes: ProductSize[];
  scent_pyramid: ScentPyramid;
  episode_number: number;
};

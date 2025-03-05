type Product = {
  id: number;
  title: string;
  history_id: number;
  category_id: number;
  compound: string;
  slug: string;
  images: Image[];
  category_slug: string;
  sizes: Size[];
  scent_pyramid: ScentPyramid;
  description: string;
  wick: string;
  wax: string;
  episode: string | null;
  measure: string;
};

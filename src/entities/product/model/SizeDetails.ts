export interface SizeDetails {
  id: number;
  productId?: number;
  timeOfExploitation: string | null;
  dimensions: { x?: number; y?: number; z?: number } | null;
  size: string | null;
  quantity: number;
  price: number;
  oldPrice: number | null;
  isDefault: boolean;
}

import { cn } from "@/lib";
import { Product } from "../types";

interface Props {
  product: Product;
  className?: string;
}

export const AddToCartButton: React.FC<Props> = ({ product, className }) => {
  return (
    <button className={cn("flex items-center gap-1 rounded-lg border border-black px-3 py-2 text-black transition hover:bg-black hover:text-white", className)}>
      <span>+</span>
      <span>{product.price}</span>
    </button>
  );
};

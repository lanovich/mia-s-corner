import { Product } from "@/types";
import Image from "next/image";
import { AddToCartButton } from "./ui";
import Link from "next/link";
import { LINKS } from "@/constants";

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <Link
      href={`${LINKS.CATALOG}/${product.category_slug}/product/${product.slug}`}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer">
        <Image
          src={product.image_url}
          width={300}
          height={400}
          className="h-full w-full object-cover"
          alt={product.title}
        />
        <div
          className="absolute bottom-0 z-10 w-full min-h-[30%] h-[40%] group-hover:h-full bg-white bg-opacity-30 backdrop-blur-md px-4 py-3 flex flex-col justify-between 
      overflow-hidden transition-[height] duration-300 ease-in-out"
        >
          <div className="flex flex-col gap-1">
            <span className="ProductHeading">{product.title}</span>
            <span className="text-xs text-black/50">{product.size}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[0.675rem] text-black/50 line-clamp-2">
              {product.compound}
            </p>
            <AddToCartButton
              product={product}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

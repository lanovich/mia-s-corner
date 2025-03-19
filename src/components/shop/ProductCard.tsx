import Image from "next/image";
import { AddToCartButton } from "./ui";
import Link from "next/link";
import { LINKS } from "@/constants";

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const defaultSize = product.product_sizes.find((size) => size.is_default)

  return (
    <Link
      href={`${LINKS.CATALOG}/${product.category_slug}/product/${product.slug}`}
      className="group block select-none"
    >
      <div className="relative aspect-[9/16] overflow-hidden rounded-lg transition-transform duration-300 hover:scale-101 md:hover:scale-105 bg-gray-200">
        {/* Product Image */}
        <Image
          src={product.images[0].url ||"/placeholder.jpg"}
          width={300}
          height={400}
          className="h-full w-full object-cover hover:scale-110 hover:blur-xs duration-300"
          alt={product.title}
        />

        {/* Нижняя секция: Название, аромат, цена, размер, добавить в корзину */}
        <div className="absolute bottom-0 z-10 w-full bg-white/30 backdrop-blur-md px-2 py-2">
          <div>
            <span className="text-sm line-clamp-1">{product.compound}</span>
            <p className="text-xs text-black/50 line-clamp-1">
              {product.title}
            </p>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-md">{defaultSize?.price} ₽</span>
            <span className="text-sm text-black/50">
              {defaultSize?.size?.size} {product.measure}
            </span>
          </div>
          <AddToCartButton selectedSize={defaultSize || null} className="w-full">
            Добавить в корзину
          </AddToCartButton>
        </div>
      </div>
    </Link>
  );
};

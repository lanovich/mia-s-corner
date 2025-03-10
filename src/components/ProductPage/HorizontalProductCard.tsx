import Image from "next/image";
import Link from "next/link";
import { LINKS } from "@/constants";
import { AddToCartButton } from "../shop/ui";

interface Props {
  product: Product;
}

export const HorizontalProductCard: React.FC<Props> = ({ product }) => {
  const defaultSize = product.sizes.find((size) => size.is_default) || null;

  return (
    <Link
      href={`${LINKS.CATALOG}/${product.category_slug}/product/${product.slug}`}
      className="group block "
    >
      <div className="relative shadow-lg border-2 flex h-40 w-full overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105">
        {/* Product Image */}
        <div className="relative h-full w-40 flex-shrink-0">
          <Image
            src={product.images[0].url}
            width={160}
            height={160}
            className="h-full w-full object-cover"
            alt={product.title}
          />
        </div>

        <div className="flex flex-1 flex-col justify-between bg-white/30 backdrop-blur-md p-3">
          <div>
            <h3 className="text-lg line-clamp-1">{product.title}</h3>
            <p className="text-sm text-black/50 line-clamp-1">
              {product.compound}
            </p>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-xl">{defaultSize?.price} ₽</span>
            <span className="text-sm text-black/50">
              {defaultSize?.size} {product.measure}
            </span>
          </div>
          <AddToCartButton selectedSize={defaultSize} className="w-full">
            Добавить в корзину
          </AddToCartButton>
        </div>
      </div>
    </Link>
  );
};

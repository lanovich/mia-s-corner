import Image from "next/image";
import { AddToCartButton } from "@/features/modify-cart-quantity/ui";
import { LINKS } from "@/shared/model";
import { cn } from "@/shared/lib";
import { Product } from "@/entities/product/model";
import { CustomLink } from "@/shared/ui";

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const defaultSize = product.product_sizes.find((size) => size.is_default);
  const imageUrl = product.images?.[0]?.url ?? "/placeholder.jpg";

  return (
    <div className="group block select-none">
      {/* Основной контейнер без overflow-hidden */}
      <div className="relative rounded-lg transition-transform duration-300 md:hover:scale-105 bg-gray-200">
        {/* Эпизод */}
        <div className="z-40 absolute -top-2 -left-1 bg-black/70 text-white text-sm px-2 py-1 rounded-full shadow-md overflow-visible">
          Эпизод {product.episode_number}
        </div>
        {/* Product Image с обернутой ссылкой */}
        <CustomLink
          href={`${LINKS.CATALOG}/${product.category_slug}/product/${product.slug}`}
          className="block"
        >
          <div className="relative aspect-[3/4]">
            <Image
              src={imageUrl}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover hover:sepia md:hover:sepia-0 duration-300 rounded-t-lg"
              alt={product.title}
            />
          </div>
        </CustomLink>

        {/* Нижняя секция: Название, аромат, цена, размер, добавить в корзину */}
        <div className="p-2 bg-slate-50 shadow-md rounded-b-lg">
          <CustomLink
            href={`${LINKS.CATALOG}/${product.category_slug}/product/${product.slug}`}
          >
            <div>
              <span className="text-sm line-clamp-1">{product.compound}</span>
              <p className="text-xs text-black/50 line-clamp-1">
                {product.title}
              </p>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span
                className={cn(
                  "text-md font-bold",
                  defaultSize?.oldPrice ? "text-red-500 font-bold" : ""
                )}
              >
                {defaultSize?.price} ₽
              </span>
              {defaultSize?.oldPrice && (
                <span className="text-gray-500 text-sm line-through">
                  {defaultSize?.oldPrice} ₽
                </span>
              )}
              <span className="text-sm text-black/50">
                {defaultSize?.size?.size} {product.measure}
              </span>
            </div>
          </CustomLink>
          <AddToCartButton
            selectedSize={defaultSize || null}
            className="w-full"
          >
            Добавить в корзину
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
};

import Image from "next/image";
import { AddToCartButton } from "@/features/modify-cart-quantity/ui";
import { LINKS } from "@/shared/model";
import { cn } from "@/shared/lib";
import { Product } from "@/entities/product/model";
import { CustomLink } from "@/shared/ui";
import { memo, useMemo } from "react";

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = memo(({ product }) => {
  const defaultSize = useMemo(
    () => product.product_sizes.find((s) => s.is_default),
    [product.product_sizes]
  );

  const imageUrl = useMemo(
    () => product.images?.[0]?.url ?? "/placeholder.jpg",
    [product.images]
  );

  return (
    <div className="group block shadow-md transition-transform transform-gpu rounded-md md:hover:scale-[102%]">
      <div className="relative rounded-lg duration-300 will-change-transform ">
        {/* Эпизод */}
        <div className="z-40 absolute -top-2 -left-1 bg-black/70 text-white text-sm px-2 py-1 rounded-full">
          Эпизод {product.episode_number}
        </div>

        {/* Кликабельная часть: картинка и текст */}
        <CustomLink
          href={`${LINKS.CATALOG}/${product.category_slug}/product/${product.slug}`}
          className="block"
        >
          <div className="relative aspect-[3/4] select-none">
            <Image
              src={imageUrl}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover hover:sepia md:hover:sepia-0 duration-300 rounded-t-lg"
              alt={product.title}
            />
          </div>
          <div className="p-2 bg-slate-50">
            <div>
              <span className="text-sm line-clamp-1 font-medium">
                {product.compound}
              </span>
              <p className="text-xs text-black/50 line-clamp-1">{product.title}</p>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span
                className={cn(
                  "text-md font-bold",
                  defaultSize?.oldPrice && "text-red-500"
                )}
              >
                {defaultSize?.price} ₽
              </span>
              {defaultSize?.oldPrice && (
                <span className="text-gray-500 text-sm line-through">
                  {defaultSize.oldPrice} ₽
                </span>
              )}
              <span className="text-sm text-black/50">
                {defaultSize?.size?.size} {product.measure}
              </span>
            </div>
          </div>
        </CustomLink>

        {/* Кнопка — отдельно от ссылки */}
        <div className="px-2 pb-2 bg-slate-50 rounded-b-lg">
          <AddToCartButton selectedSize={defaultSize || null} className="w-full">
            Добавить в корзину
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
});

import Image from "next/image";
import { AddToCartButton } from "@/features/modify-cart-quantity/ui";
import { LINKS } from "@/shared/model";
import { cn } from "@/shared/lib";
import { ShortProduct } from "@/entities/product/model";
import { CustomLink } from "@/shared/ui";
import { memo } from "react";

interface Props {
  product: ShortProduct;
}

export const ProductCard: React.FC<Props> = memo(({ product }) => {
  const { size } = product;

  const imageUrl = product?.size?.image
    ? product?.size?.image
    : "/placeholder.jpg";

  return (
    <div className="group block shadow-md transition-transform transform-gpu rounded-md md:hover:scale-[102%]">
      <div className="relative rounded-lg duration-300 will-change-transform">
        {product.episode && (
          <div className="z-40 absolute -top-2 -left-1 bg-black/70 text-white text-sm px-2 py-1 rounded-full">
            Эпизод {product.episode.number ?? ""}
          </div>
        )}
        <CustomLink
          href={`${LINKS.CATALOG}/${product.categorySlug}/product/${product.slug}`}
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
              <span className="text-sm line-clamp-2 font-medium">
                {product.title}
              </span>
              <p className="text-xs text-black/50 line-clamp-1">
                {product.scent?.name}
              </p>
            </div>

            <div className="flex items-end gap-2 mb-2">
              <span
                className={cn(
                  "text-md font-bold",
                  size?.oldPrice && "text-red-500"
                )}
              >
                {size?.price} ₽
              </span>

              {size.oldPrice && (
                <span className="text-gray-500 text-sm line-through">
                  {size?.oldPrice} ₽
                </span>
              )}
              <span className="text-sm text-black/50">
                {size?.volume?.amount} {size?.volume?.unit}
              </span>
            </div>
          </div>
        </CustomLink>

        <div className="px-2 pb-2 bg-slate-50 rounded-b-lg">
          <AddToCartButton selectedSize={size}>
            Добавить в корзину
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
});

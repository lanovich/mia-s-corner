import Image from "next/image";
import { LINKS } from "@/shared/model";
import { cn } from "@/shared/lib";
import { Product } from "@/entities/product/model";
import { AddToCartButton } from "@/features/modify-cart-quantity/ui";
import { CustomLink } from "@/shared/ui";

interface Props {
  product: Product;
}

export const HorizontalProductCard: React.FC<Props> = ({ product }) => {
  const defaultSize = product.product_sizes.find(
    (size) => size.is_default === true
  );

  return (
    <CustomLink
      href={`${LINKS.CATALOG}/${product.category_slug}/product/${product.slug}`}
      className="group block"
    >
      {/* Родительский контейнер */}
      <div className="relative shadow-lg border flex h-40 w-full rounded-xl transition-transform duration-300 hover:scale-105">
        {/* Product Image */}
        <div className="relative h-full w-40 flex-shrink-0 overflow-hidden">
          <Image
            src={product.images[0].url}
            fill
            sizes="160px"
            className="h-full w-full object-cover rounded-l-xl"
            alt={product.title}
          />
        </div>

        {/* Основной контент */}
        <div className="flex flex-1 flex-col justify-between bg-white/30 backdrop-blur-md p-3">
          <div>
            <h3 className="text-lg line-clamp-1">{product.title}</h3>
            <p className="text-sm text-black/50 line-clamp-1">
              {product.compound}
            </p>
          </div>
          <div className="flex items-end gap-2">
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
              {defaultSize?.size.size} {product.measure}
            </span>
          </div>
          <AddToCartButton
            selectedSize={defaultSize || null}
            className="w-full max-w-[220px]"
          >
            Добавить в корзину
          </AddToCartButton>
        </div>

        {/* Номер эпизода в правом нижнем углу */}
        <div className="absolute -bottom-3 -left-1 bg-black/70 text-white text-sm px-2 py-1 rounded-full shadow-md overflow-visible">
          Эпизод {product.episode_number}
        </div>
      </div>
    </CustomLink>
  );
};

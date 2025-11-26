import Image from "next/image";
import { LINKS } from "@/shared/model";
import { cn } from "@/shared/lib";
import { ShortProduct } from "@/entities/product/model";
import { AddToCartButton } from "@/features/modify-cart-quantity/ui";
import { CustomLink } from "@/shared/ui";

interface Props {
  shortProduct: ShortProduct;
}

export const HorizontalProductCard: React.FC<Props> = ({ shortProduct }) => {
  const { size: defaultSize } = shortProduct;
  
  return (
    <div className="relative shadow-lg border flex h-40 w-full rounded-xl transition-transform duration-300 hover:scale-[102%]">
      {/* Product Image */}
      <CustomLink
        href={`${LINKS.CATALOG}/${shortProduct.categorySlug}/product/${shortProduct.slug}`}
        className="group block"
      >
        <div className="relative h-full w-40 flex-shrink-0 overflow-hidden">
          <Image
            src={shortProduct?.size?.image || "/Placeholder.jpg"}
            fill
            sizes="160px"
            className="h-full w-full object-cover rounded-l-xl"
            alt={shortProduct.title}
          />
        </div>
      </CustomLink>
      {/* Основной контент */}
      <div className="flex flex-1 flex-col justify-between bg-white/30 backdrop-blur-md p-3">
        <div>
          <h3 className="text-lg line-clamp-1">{shortProduct.title}</h3>
          <p className="text-sm text-black/50 line-clamp-1">
            {shortProduct.scent?.name}
          </p>
        </div>
        <div className="flex items-end gap-2">
          <span
            className={cn(
              "text-md font-bold",
              shortProduct?.size?.oldPrice ? "text-red-500 font-bold" : ""
            )}
          >
            {shortProduct.size?.price} ₽
          </span>
          {defaultSize?.oldPrice && (
            <span className="text-gray-500 text-sm line-through">
              {defaultSize?.oldPrice} ₽
            </span>
          )}
          <span className="text-sm text-black/50">
            {defaultSize?.volume?.amount} {defaultSize?.volume?.unit}
          </span>
        </div>
        <AddToCartButton
          selectedSize={defaultSize || null}
        >
          Добавить в корзину
        </AddToCartButton>
      </div>

      <div className="absolute -bottom-3 -left-1 bg-black/70 text-white text-sm px-2 py-1 rounded-full shadow-md overflow-visible">
        Эпизод {shortProduct.episode?.number}
      </div>
    </div>
  );
};

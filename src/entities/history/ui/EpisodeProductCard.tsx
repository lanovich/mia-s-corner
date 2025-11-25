import { CATEGORY_SLUG_MAP } from "@/entities/category/model";
import { ShortProduct } from "@/entities/product/model";
import { LINKS } from "@/shared/model";
import { CustomLink } from "@/shared/ui";

interface ProductCardProps {
  product: ShortProduct;
}

export const EpisodeProductCard: React.FC<ProductCardProps> = ({ product }) => {
  console.log(product);
  return (
    <CustomLink
      href={`${LINKS.CATALOG}/${product.categorySlug}/${LINKS.PRODUCT}/${product.slug}`}
      className="block w-full h-[150px] relative overflow-hidden rounded-lg group"
    >
      {/* Фоновое изображение */}
      {product?.size?.image && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[102%]"
          style={{
            backgroundImage: `url(${product?.size?.image})`,
          }}
        />
      )}

      {/* Затемнение фона */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

      {/* Контент карточки */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white text-center">
        <h3 className="text-lg font-bold">
          {CATEGORY_SLUG_MAP[product.categorySlug] || product.categorySlug}
        </h3>
      </div>
    </CustomLink>
  );
};

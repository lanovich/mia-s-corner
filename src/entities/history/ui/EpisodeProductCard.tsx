import { CATEGORY_SLUG_MAP } from "@/entities/category/model";
import { LINKS } from "@/shared/model";
import { CustomLink } from "@/shared/ui";

interface ProductCardProps {
  product: {
    id: number;
    category_slug: string;
    slug: string;
    images: { url: string }[];
  };
}

export const EpisodeProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <CustomLink
      href={`${LINKS.CATALOG}/${product.category_slug}/${LINKS.PRODUCT}/${product.slug}`}
      className="block w-full h-[150px] relative overflow-hidden rounded-lg group"
    >
      {/* Фоновое изображение */}
      {product.images[0] && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[102%]"
          style={{
            backgroundImage: `url(${product.images[0].url})`,
          }}
        />
      )}

      {/* Затемнение фона */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

      {/* Контент карточки */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white text-center">
        <h3 className="text-lg font-bold">
          {CATEGORY_SLUG_MAP[product.category_slug] || product.category_slug}
        </h3>
      </div>
    </CustomLink>
  );
};

import { Product } from "@/entities/product/model";
import { EpisodeBlock } from "./EpisodeBlock";
import { EpisodeProductCard } from "./EpisodeProductCard";
import { cn } from "@/shared/lib";

interface ProductsGridProps {
  products: Product[];
  className?: string;
}

export const Episodes: React.FC<ProductsGridProps> = ({
  products,
  className,
}) => {
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.episode_number]) {
      acc[product.episode_number] = [];
    }
    acc[product.episode_number].push(product);
    return acc;
  }, {} as Record<number, Product[]>);

  return (
    <div className={cn("grid grid-cols-1 gap-8 px-5", className)}>
      {Object.entries(groupedProducts).map(
        ([episodeNumber, episodeProducts]) => {
          const firstProduct = episodeProducts[0];

          return (
            <div key={episodeNumber} className="space-y-4">
              {/* Блок эпизода */}
              <EpisodeBlock
                episodeNumber={firstProduct.episode_number}
                episodeText={firstProduct.episode}
                compound={firstProduct.compound}
              />

              {/* Сетка продуктов */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {episodeProducts.map((product) => (
                  <EpisodeProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

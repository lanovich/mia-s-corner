import { Product, ShortProduct } from "@/entities/product/model";
import { EpisodeBlock } from "./EpisodeBlock";
import { EpisodeProductCard } from "./EpisodeProductCard";
import { cn } from "@/shared/lib";

interface ProductsGridProps {
  products: ShortProduct[];
  className?: string;
}

export const Episodes: React.FC<ProductsGridProps> = ({
  products,
  className,
}) => {
  const groupedProducts = products.reduce((acc, product) => {
    const episodeNumber = product.episode?.number ?? 0;

    if (!acc[episodeNumber]) {
      acc[episodeNumber] = [];
    }

    acc[episodeNumber].push(product);
    return acc;
  }, {} as Record<number, ShortProduct[]>);

  return (
    <div className={cn("grid grid-cols-1 gap-8 px-5", className)}>
      {Object.entries(groupedProducts).map(
        ([episodeNumber, episodeProducts]) => {
          const firstProduct = episodeProducts[0];

          return (
            <div key={episodeNumber} className="space-y-4">
              <EpisodeBlock
                episodeNumber={firstProduct.episode?.number ?? null}
                episodeText={firstProduct.episode?.title || ""}
                compound={firstProduct.scent?.name ?? ""}
              />

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

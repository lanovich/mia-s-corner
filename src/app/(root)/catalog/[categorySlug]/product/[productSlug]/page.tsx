import { getProductWithHistory } from "@/lib/cache";
import {
  AboutProduct,
  BuySection,
  ProductGallery,
  SimilarProducts,
} from "@/components/ProductPage";
import { Breadcrumbs } from "@/components/ProductPage";
import { Container } from "@/components/shared";
import { MobileSizeAndBuy } from "@/components/ProductPage/MobileSizeAndBuy";

export default async function ProductPage({
  params,
}: {
  params: { categorySlug: CategorySlug; productSlug: string };
}) {
  const { productSlug, categorySlug } = await params;
  const product = await getProductWithHistory(categorySlug, productSlug);

  if (!product) {
    return <div className="container mx-auto px-4 py-6">Продукт не найден</div>;
  }
  if (product.sizes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        У этого товара нет размеров
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs categorySlug={categorySlug} productTitle={product.title} />
      <Container className="max-w-[1380px] px-5">
        <div className="flex flex-col lg:flex-row  gap-6">
          <div>
            <ProductGallery images={product.images} className="md:w-1/3" />

            <BuySection
              productCompound={product.compound}
              productHistoryId={product.history_id}
              productEpisode={product.episode}
              productTitle={product.title}
              sizes={product.sizes}
              className="mt-5 md:hidden sticky top-4 mb-5 flex"
            />

            <AboutProduct
              className="md:flex md:flex-col hidden mt-5"
              product={product}
              type={categorySlug}
            />
          </div>
          <div className="md:w-full lg:w-2/3">
            <BuySection
              productCompound={product.compound}
              productHistoryId={product.history_id}
              productEpisode={product.episode}
              productTitle={product.title}
              sizes={product.sizes}
              className="hidden md:flex sticky top-4 mb-5"
            />
            <AboutProduct
              className="flex flex-col md:hidden"
              product={product}
              type={categorySlug}
            />
          </div>
        </div>

        <div className="w-full">
          <SimilarProducts historyId={product.history_id} className="mt-7" />
        </div>

        <div className="flex md:hidden">
          <MobileSizeAndBuy sizes={product.sizes} />
        </div>
      </Container>
    </>
  );
}

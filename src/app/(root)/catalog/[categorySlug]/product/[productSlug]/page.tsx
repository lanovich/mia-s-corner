import Image from "next/image";
import { getProductWithHistory } from "@/lib/cache";
import { ProductGallery, SizeAndBuy } from "@/components/ProductPage";
import { Breadcrumbs } from "@/components/ProductPage";
import { Container } from "@/components/shared";

export default async function ProductPage({
  params,
}: {
  params: { categorySlug: string; productSlug: string };
}) {
  const { productSlug, categorySlug } = await params;

  const product = await getProductWithHistory(categorySlug, productSlug);

  if (!product) {
    return <div className="container mx-auto px-4 py-6">Продукт не найден</div>;
  }

  return (
    <Container className="max-w-[1380px] px-5">
      <Breadcrumbs
        categorySlug={categorySlug}
        productTitle={product.title}
        className={"my-2"}
      />
      <div className="flex flex-col md:flex-row gap-6">
        <ProductGallery images={product.images} />
        <div className="flex flex-col gap-4 bg-slate-100 rounded-lg py-4 px-4 flex-1">
          <h1 className="text-2xl font-semibold border-b-2 pb-2 border-neutral-200">
            {product.title}
          </h1>
          <p className="text-gray-500">Аромат: {product.compound}</p>
          <h2 className="text-xl font-semibold">Эпизод #{product.history_id}</h2>
          <p className="border-b-2 pb-2 border-neutral-200">{product.history.description}</p>
          <SizeAndBuy product={product} />
        </div>
      </div>
    </Container>
  );
}

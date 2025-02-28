import { AddToCartButton } from "@/components/shop/ui";
import Image from "next/image";
import { getProductWithHistory } from "@/lib/cache";

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
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={product.image_url}
          width={400}
          height={500}
          alt={product.title}
          className="rounded-lg object-cover"
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="text-gray-500">{product.compound}</p>
          <span className="text-lg font-bold">{product.size}</span>
          <AddToCartButton product={product} className="w-20" />
        </div>
      </div>
    </div>
  );
}

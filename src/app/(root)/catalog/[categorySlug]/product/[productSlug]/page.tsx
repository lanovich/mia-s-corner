import { Metadata } from "next";
import { getProductWithHistory } from "@/lib/cache";
import { ProductWithHistory } from "@/types";
import {
  Breadcrumbs,
  ProductGallery,
  BuySection,
  AboutProduct,
  SimilarProducts,
} from "@/components/ProductPage";
import { MobileSizeAndBuy } from "@/components/ProductPage/MobileSizeAndBuy";
import { Container } from "@/components/shared";
import { CATEGORY_SLUG_MAP } from "@/constants/categorySlugMap";

type ProductParams = Promise<{ categorySlug: string; productSlug: string }>;

type GenerateMetadataResult = {
  metadata: Metadata;
  product: ProductWithHistory | null;
};

export async function generateMetadata(props: {
  params: ProductParams;
}): Promise<GenerateMetadataResult> {
  const params = await props.params;
  const product = await getProductWithHistory(
    params.categorySlug,
    params.productSlug
  );

  if (!product) {
    return {
      metadata: {
        title: "Продукт не найден | Mia's Corner",
        description: "Ароматическая продукция ручной работы",
      },
      product: null,
    };
  }

  const productType = CATEGORY_SLUG_MAP[product.category_slug];

  const metadata: Metadata = {
    title: `${product.title} | ${productType} | Mia's Corner`,
    description: `${product.description.slice(
      0,
      160
    )}... Купить в Санкт-Петербурге с доставкой.`,
    alternates: {
      canonical: `https://www.mias-corner.ru/catalog/${params.categorySlug}/product/${params.productSlug}`,
    },
    openGraph: {
      title: `${product.title} | Mia's Corner | ${productType} ручной работы`,
      description: `${product.description.slice(
        0,
        160
      )}`,
      images:
        product.images.length > 0
          ? [
              {
                url: `${product.images[0].url}`,
                width: 800,
                height: 600,
                alt: `${product.title} - ${productType}`,
              },
            ]
          : "product.images[0].url",
      type: "article",
      url: `https://www.mias-corner.ru/catalog/${params.categorySlug}/product/${params.productSlug}`,
      siteName: "Mia's Corner",
    },
    keywords: generateProductKeywords(product),
  };

  return { metadata, product };
}

function getProductFeatures(product: ProductWithHistory): string {
  const features = [];

  if (product.compound) {
    features.push(
      `Состав: ${product.compound.split(",").slice(0, 3).join(", ")}`
    );
  }

  if (product.measure) {
    features.push(`Объем: ${product.measure}`);
  }

  if (product.category_slug === "candles") {
    features.push("Соевый воск", "Хлопковый фитиль", "Горение до 50 часов");
  } else if (product.category_slug === "diffusers") {
    features.push("Натуральные аромамасла", "Срок действия 3-6 месяцев");
  }

  return features.join(". ") + ".";
}

function generateProductKeywords(product: ProductWithHistory): string[] {
  const keywords = [];
  const productName = product.title.toLowerCase();
  const productType = CATEGORY_SLUG_MAP[product.category_slug]

  keywords.push(
    `купить ${productName} СПб`,
    `${productType} ${productName}`,
    `${productName} цена`
  );

  product.product_sizes.forEach((size) => {
    if (size.size) keywords.push(`${productName} ${size.size}`);
    if (size.price) keywords.push(`${productName} за ${size.price} руб`);
  });

  if (product.category_slug === "candles") {
    keywords.push(
      "соевые свечи ручной работы",
      "свечи в стеклянных банках",
      "эко свечи спб"
    );
  } else {
    keywords.push(
      "ароматические диффузоры",
      "диффузоры для дома",
      "стеклянные диффузоры"
    );
  }

  return keywords;
}

export default async function ProductPage(props: { params: ProductParams }) {
  const params = await props.params;
  const product = await getProductWithHistory(
    params.categorySlug,
    params.productSlug
  );

  if (!product) {
    return <div className="container mx-auto px-4 py-6">Продукт не найден</div>;
  }
  if (product.product_sizes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        У этого товара нет размеров
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs
        categorySlug={params.categorySlug}
        productTitle={product.title}
      />
      <Container className="max-w-[1380px] px-5">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <ProductGallery images={product.images} className="" />
            <BuySection
              productCompound={product.compound}
              productEpsiodeId={product.episode_number}
              productEpisode={product.episode}
              productTitle={product.title}
              measure={product.measure}
              sizes={product.product_sizes}
              className="mt-5 md:hidden sticky top-4 mb-5 flex"
            />
            <AboutProduct
              className="md:flex md:flex-col hidden mt-5"
              product={product}
            />
          </div>
          <div className="md:w-full">
            <BuySection
              productCompound={product.compound}
              productEpsiodeId={product.episode_number}
              productEpisode={product.episode}
              productTitle={product.title}
              measure={product.measure}
              sizes={product.product_sizes}
              className="hidden md:flex sticky top-4 mb-5"
            />
            <AboutProduct
              className="flex flex-col md:hidden"
              product={product}
            />
          </div>
        </div>

        <div className="w-full">
          <SimilarProducts
            historyId={product.history_id}
            className="mt-7"
            productId={product.id}
          />
        </div>

        <div className="flex md:hidden">
          <MobileSizeAndBuy
            sizes={product.product_sizes}
            measure={product.measure}
          />
        </div>
      </Container>
    </>
  );
}

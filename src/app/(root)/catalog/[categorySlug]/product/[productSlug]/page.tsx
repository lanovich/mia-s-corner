import { Metadata } from "next";
import { Breadcrumbs, Container } from "@/shared/ui";
import { Product } from "@/entities/product/model";
import {
  AboutProduct,
  BuySection,
  MobileSizeAndBuy,
  ProductGallery,
  SimilarProducts,
} from "@/entities/product/ui";
import { CATEGORY_SLUG_MAP } from "@/entities/category/model";
import { productsApi } from "@/entities/product/api";
import { API, apiFetchServer } from "@/shared/api";

type ProductParams = Promise<{ categorySlug: string; productSlug: string }>;

export async function generateMetadata(props: {
  params: ProductParams;
}): Promise<Metadata> {
  const params = await props.params;

  const product = await apiFetchServer<Product | null>(
    API.products.getProduct(params.categorySlug, params.productSlug),
    {
      revalidate: 3600,
      fallback: null,
    }
  );
  if (!product) {
    return {
      title:
        "Mia's Corner | Ароматические свечи, диффузоры, саше ручной работы в СПб",
      description: "Ароматическая продукция ручной работы",
    };
  }

  const productCategorySlug = product.category?.slug ?? "товар";
  const productType = CATEGORY_SLUG_MAP[productCategorySlug] ?? "Продукт";

  const metadata: Metadata = {
    title: `${product.title ?? "Продукт"} | ${productType} | Mia's Corner`,
    description: `${
      product.description?.slice(0, 160) ?? ""
    }... Купить в Санкт-Петербурге с доставкой.`,
    alternates: {
      canonical: `https://www.mias-corner.ru/catalog/${params.categorySlug}/product/${params.productSlug}`,
    },
    openGraph: {
      title: `${
        product.title ?? "Продукт"
      } | Mia's Corner | ${productType} ручной работы`,
      description: `${product.description?.slice(0, 160) ?? ""}`,
      images: [
        {
          url: product.mainImage ?? "",
          width: 800,
          height: 600,
          alt: `${product.title ?? "Продукт"} - ${productType}`,
        },
      ],
      type: "article",
      url: `https://www.mias-corner.ru/catalog/${params.categorySlug}/product/${params.productSlug}`,
      siteName: "Mia's Corner",
    },
    keywords: generateProductKeywords(product),
  };

  return metadata;
}

function generateProductKeywords(product: Product): string[] {
  const keywords = [];
  const productName = (product.title ?? "товар").toLowerCase();
  const productCategorySlug = product.category?.slug ?? "product";
  const productType = CATEGORY_SLUG_MAP[productCategorySlug] ?? "Продукт";

  keywords.push(
    `купить ${productName} СПб`,
    `${productType} ${productName}`,
    `${productName} цена`
  );

  product.sizes?.forEach(({ price, volume }) => {
    if (volume?.amount) keywords.push(`${productName} ${volume.unit ?? ""}`);
    if (price) keywords.push(`${productName} за ${price} руб`);
  });

  if (productCategorySlug === "candles") {
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
  const product = await apiFetchServer<Product | null>(
    API.products.getProduct(params.categorySlug, params.productSlug),
    {
      revalidate: 3600,
      fallback: null,
    }
  );

  if (!product) {
    return <div className="container mx-auto px-4 py-6">Продукт не найден</div>;
  }

  if (!product.sizes?.length) {
    return (
      <div className="container mx-auto px-4 py-6">
        У этого товара нет размеров
      </div>
    );
  }

  const defaultSize = product.sizes.find((size) => size.isDefault);

  return (
    <>
      <Breadcrumbs
        categoryInfo={{
          slug: params.categorySlug,
          name: product.category?.name ?? product.category?.slug ?? "Категория",
        }}
        productTitle={product.title ?? "Продукт"}
      />
      <Container className="max-w-[1380px] px-5">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <ProductGallery />
            <BuySection
              scent={product.scent?.name ?? ""}
              episodeId={product.episode?.id}
              episodeText={
                product.isLimited
                  ? product.storyText ?? ""
                  : product.episode?.storyText ?? ""
              }
              title={product.title ?? "Продукт"}
              unit={defaultSize?.volume?.unit ?? ""}
              sizes={product.sizes ?? []}
              className="mt-5 md:hidden sticky top-4 mb-5 flex"
            />
            <AboutProduct
              className="md:flex md:flex-col hidden mt-5"
              product={product}
            />
          </div>
          <div className="md:w-full">
            <BuySection
              scent={product.scent?.name ?? ""}
              episodeId={product.episode?.id}
              episodeText={
                product.isLimited
                  ? product.storyText ?? ""
                  : product.episode?.storyText ?? ""
              }
              title={product.title ?? "Продукт"}
              unit={defaultSize?.volume?.unit ?? ""}
              sizes={product.sizes ?? []}
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
            historyId={product.episode?.historyId ?? null}
            className="mt-7"
            productId={product.id ?? ""}
          />
        </div>

        <div className="flex md:hidden">
          <MobileSizeAndBuy
            sizes={product.sizes ?? []}
            unit={defaultSize?.volume?.unit ?? ""}
          />
        </div>
      </Container>
    </>
  );
}

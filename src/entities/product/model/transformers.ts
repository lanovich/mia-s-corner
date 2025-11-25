import {
  CategoryRaw,
  CategoryWithFullProductRaw,
  ProductRaw,
  ShortProductRaw,
} from "@/shared/api/queries";
import type {
  ShortProduct,
  GroupedShortProducts,
  Product,
  GroupedFullProducts,
} from "./types";
import { Episode } from "@/entities/history/model";
import { unitMap } from "@/shared/lib";

export function normalizeProduct(raw: ProductRaw): Product {
  const product: Product = {
    id: raw.id,
    title: raw.title,
    isLimited: raw.isLimited,
    category: {
      id: raw.category.id,
      name: raw.category.name,
      slug: raw.category.slug,
      order: raw.category.order,
      ...(raw.category.image !== null ? { image: raw.category.image } : {}),
    },
    sizes: raw.sizes.map((s) => ({
      id: s.id,
      price: Number(s.price),
      oldPrice: s.oldPrice !== null ? Number(s.oldPrice) : null,
      stock: s.stock ?? 0,
      images: s.images,
      props: s.props as Record<string, string>,
      isDefault: s.isDefault,
      volume: {
        amount: s.size?.amount != null ? Number(s.size.amount) : null,
        unit: unitMap[s.size?.unit] ?? null,
      },
    })),
    ...(raw.slug ? { slug: raw.slug } : {}),
    ...(raw.storyText ? { storyText: raw.storyText } : {}),
    ...(raw.description ? { description: raw.description } : {}),
    ...(raw.sizes[0]?.images?.[0] ? { mainImage: raw.sizes[0].images[0] } : {}),
    ...(raw.episode
      ? {
          episode: {
            historyId: raw.episode.historyId,
            id: raw.episode.id,
            ...(raw.episode.number !== null
              ? { number: Number(raw.episode.number) }
              : {}),
            ...(raw.episode.title ? { title: raw.episode.title } : {}),
            ...(raw.episode.storyText
              ? { storyText: raw.episode.storyText }
              : {}),
            ...(raw.episode.imageUrl ? { imageUrl: raw.episode.imageUrl } : {}),
          } as Episode,
        }
      : {}),
    ...(raw.scent
      ? {
          scent: {
            id: raw.scent.id,
            name: raw.scent.name,
            ...(raw.scent.description
              ? { description: raw.scent.description }
              : {}),
            ...(raw.scent.scentPyramid &&
            typeof raw.scent.scentPyramid === "object"
              ? {
                  scentPyramid: raw.scent.scentPyramid as {
                    top: string[];
                    heart: string[];
                    base: string[];
                  },
                }
              : {}),
          },
        }
      : {}),
  };

  return product;
}
export function mapRawToShortProduct(raw: ShortProductRaw): ShortProduct {
  const defaultSize = raw.sizes[0];

  const shortProduct: ShortProduct = {
    id: raw.id,
    title: raw.title,
    isLimited: raw.isLimited,
    size: {
      id: defaultSize.id,
      price:
        defaultSize.price instanceof Object && "toNumber" in defaultSize.price
          ? defaultSize.price.toNumber()
          : Number(defaultSize.price),
      oldPrice:
        defaultSize.oldPrice != null
          ? defaultSize.oldPrice instanceof Object &&
            "toNumber" in defaultSize.oldPrice
            ? defaultSize.oldPrice.toNumber()
            : Number(defaultSize.oldPrice)
          : null,
      ...(defaultSize.images?.[0] ? { image: defaultSize.images[0] } : {}),
      volume: {
        amount: defaultSize.size ? Number(defaultSize.size.amount) : null,
        unit: unitMap[defaultSize.size.unit],
      },
      stock: defaultSize.stock,
    },
    categorySlug: raw.category.slug,
    ...(raw.slug ? { slug: raw.slug } : {}),
    ...(raw.episode
      ? {
          episode: {
            ...(raw.episode.number != null
              ? {
                  number:
                    raw.episode.number instanceof Object &&
                    "toNumber" in raw.episode.number
                      ? raw.episode.number.toNumber()
                      : Number(raw.episode.number),
                }
              : {}),
            ...(raw.episode.title ? { title: raw.episode.title } : {}),
          },
        }
      : {}),
    ...(raw.scent ? { scent: { name: raw.scent.name } } : {}),
  };

  return shortProduct;
}

export function mapCategoryToGroupedShortProducts(
  category: CategoryRaw
): GroupedShortProducts {
  return {
    categoryInfo: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      ...(category.image ? { image: category.image } : {}),
      order: category.order,
    },
    products: category.products.map((rawProduct) =>
      mapRawToShortProduct({
        ...rawProduct,
        category: { slug: category.slug },
      })
    ),
  };
}

export function mapCategoryToGroupedFullProducts(
  category: CategoryWithFullProductRaw
): GroupedFullProducts {
  return {
    categoryInfo: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      ...(category.image ? { image: category.image } : {}),
      order: category.order,
    },
    products: category.products.map((rawProduct) =>
      normalizeProduct(rawProduct)
    ),
  };
}

import { prisma } from "@/shared/api/prisma";
import type { Category } from "@/entities/category/model";
import type { HistoryData } from "@/entities/history/model";
import {
  baseProductWithDetailsQuery,
  baseShortProductsQuery,
  categoryWithShortProductsQuery,
  ProductRaw,
} from "@/shared/api/queries";
import {
  mapCategoryToGroupedShortProducts,
  mapRawToShortProduct,
  normalizeProduct,
} from "@/entities/product/model/transformers";
import { GroupedShortProducts, ShortProduct } from "@/entities/product/model";

export async function getCategoriesPrerender(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    order: c.order,
    image: c.image ?? undefined,
  }));
}

export async function getHistoriesPrerender(): Promise<HistoryData[]> {
  const histories = await prisma.history.findMany({
    orderBy: { order: "asc" },
    include: {
      episodes: { orderBy: { number: "asc" } },
    },
  });

  return histories.map((h) => ({
    id: h.id,
    title: h.title,
    slug: h.slug || "",
    order: h.order ?? 0,
    ...(h.description && { description: h.description }),
    ...(h.imageUrl && { imageUrl: h.imageUrl }),
    ...(h.episodes && {
      episodes: h.episodes.map((e) => ({
        id: e.id,
        historyId: e.historyId,
        ...(e.title && { title: e.title }),
        ...(e.number !== undefined && { number: Number(e.number) }),
        ...(e.storyText && { storyText: e.storyText }),
        ...(e.imageUrl && { imageUrl: e.imageUrl }),
      })),
    }),
  }));
}

export async function getProductPrerender(
  categorySlug: string,
  productSlug: string
) {
  const raw: ProductRaw | null = await prisma.product.findFirst({
    where: {
      slug: productSlug,
      category: { slug: categorySlug },
    },
    ...baseProductWithDetailsQuery,
  });

  if (!raw) return null;

  return normalizeProduct(raw);
}

export async function getAllProductsPrerender(): Promise<ShortProduct[]> {
  const raw = await prisma.product.findMany(baseShortProductsQuery);
  return raw.map(mapRawToShortProduct);
}

export async function getAllGroupedProductsPrerender(): Promise<
  GroupedShortProducts[]
> {
  const raw = await prisma.category.findMany(categoryWithShortProductsQuery);
  return raw.map(mapCategoryToGroupedShortProducts);
}

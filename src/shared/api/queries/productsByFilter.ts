import { Prisma } from "@prisma/client";

export const baseShortProductsQuery =
  Prisma.validator<Prisma.ProductFindManyArgs>()({
    orderBy: { episode: { number: "asc" } },
    select: {
      id: true,
      title: true,
      slug: true,
      isLimited: true,
      sizes: {
        where: { isDefault: true },
        take: 1,
        select: {
          id: true,
          price: true,
          oldPrice: true,
          images: true,
          stock: true,
          props: true,
          size: {
            select: {
              id: true,
              amount: true,
              unit: true,
            },
          },
        },
      },
      episode: {
        select: { number: true, title: true, historyId: true, storyText: true },
      },
      scent: { select: { name: true } },
      category: { select: { slug: true } },
    },
  });

export const makeShortProductsQueryBySizeId = (productSizeId: number) =>
  Prisma.validator<Prisma.ProductFindManyArgs>()({
    ...baseShortProductsQuery,
    select: {
      ...baseShortProductsQuery.select,
      sizes: {
        ...baseShortProductsQuery.select.sizes,
        where: { id: productSizeId },
      },
    },
  });

export const productsByFilterQuery = (
  filter: Partial<{ categoryId: number; historyId: number }>
) => ({
  where: filter,
  ...baseShortProductsQuery,
});

export type ShortProductRaw = Prisma.ProductGetPayload<
  typeof baseShortProductsQuery
>;

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
          size: {
            select: {
              id: true,
              amount: true,
              unit: true,
              props: true,
            },
          },
        },
      },
      episode: { select: { number: true, title: true, historyId: true } },
      scent: { select: { name: true } },
      category: { select: { slug: true } },
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

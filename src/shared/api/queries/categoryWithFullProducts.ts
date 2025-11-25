import { Prisma } from "@prisma/client";

export const categoryWithFullProductsQuery =
  Prisma.validator<Prisma.CategoryFindManyArgs>()({
    orderBy: { order: "asc" },
    include: {
      products: {
        include: {
          category: true,
          episode: true,
          history: true,
          scent: true,
          sizes: {
            include: {
              size: true,
            },
          },
        },
      },
    },
  });

export type CategoryWithFullProductRaw = Prisma.CategoryGetPayload<
  typeof categoryWithFullProductsQuery
>;

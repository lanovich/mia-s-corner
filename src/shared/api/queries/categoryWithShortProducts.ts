import { Prisma } from "@prisma/client";
import { baseShortProductsQuery } from "./productsByFilter";

export const categoryWithShortProductsQuery =
  Prisma.validator<Prisma.CategoryFindManyArgs>()({
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      order: true,
      products: {
        take: 10,
        select: baseShortProductsQuery.select,
      },
    },
  });

export type CategoryRaw = Prisma.CategoryGetPayload<
  typeof categoryWithShortProductsQuery
>;

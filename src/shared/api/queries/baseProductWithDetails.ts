import { Prisma } from "@prisma/client";

export const baseProductWithDetailsQuery =
  Prisma.validator<Prisma.ProductFindManyArgs>()({
    select: {
      id: true,
      title: true,
      slug: true,
      isLimited: true,
      storyText: true,
      description: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
          order: true,
        },
      },
      sizes: {
        select: {
          id: true,
          price: true,
          oldPrice: true,
          stock: true,
          images: true,
          isDefault: true,
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
      scent: {
        select: {
          id: true,
          name: true,
          description: true,
          scentPyramid: true,
        },
      },
      episode: {
        select: {
          id: true,
          number: true,
          title: true,
          historyId: true,
          storyText: true,
          imageUrl: true,
        },
      },
    },
  });

export type ProductRaw = Prisma.ProductGetPayload<
  typeof baseProductWithDetailsQuery
>;

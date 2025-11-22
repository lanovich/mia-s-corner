import { prisma } from "@/shared/api/prisma";

export async function getCategories() {
  const categories = await prisma.categories.findMany({
    orderBy: {
      order: "asc",
    },
  });

  return categories;
}

import { getCategories } from "@/lib/cache";
import { Container } from "@/components/shared";
import Link from "next/link";

export default async function CatalogPage() {
  const categories = await getCategories();

  return (
    <Container>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category: { slug: string; name: string }) => (
          <Link
            key={category.slug}
            href={`/catalog/${category.slug}`}
            className="block w-full h-[300px] bg-slate-100 items-center justify-center text-lg font-semibold hover:bg-slate-200 transition rounded-lg"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </Container>
  );
}

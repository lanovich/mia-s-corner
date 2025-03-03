import { cn } from "@/lib";
import { getCategoryBySlug } from "@/lib/cache";
import Link from "next/link";

interface Props {
  categorySlug: string;
  productTitle?: string;
  className?: string;
}

export const Breadcrumbs: React.FC<Props> = async ({
  categorySlug,
  productTitle,
  className,
}) => {
  const category = await getCategoryBySlug(categorySlug);
  const categoryName = category?.name || categorySlug;

  const breadcrumbs = [
    { name: "Главная", href: "/" },
    { name: "Каталог", href: "/catalog" },
    { name: categoryName, href: `/catalog/${categorySlug}` },
    { name: productTitle, href: "#" },
  ];

  return (
    <nav className={cn("text-sm text-gray-500", className)}>
      <ul className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index !== breadcrumbs.length - 1 ? (
              <Link href={crumb.href} className="hover:underline">
                {crumb.name}
              </Link>
            ) : (
              <span className="text-black">{crumb.name}</span>
            )}
            {index !== breadcrumbs.length - 1 && (
              <span className="mx-2">/</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

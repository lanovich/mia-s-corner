import { cn } from "@/lib";
import { getCategoryBySlug, getHistoryById } from "@/lib/cache";
import Link from "next/link";
import { Container } from "../shared";

interface Props {
  categorySlug?: string;
  historyId?: number;
  productTitle?: string;
  className?: string;
}

export const Breadcrumbs: React.FC<Props> = async ({
  categorySlug,
  historyId,
  productTitle,
  className,
}) => {
  const category = categorySlug ? await getCategoryBySlug(categorySlug) : null;

  const history = historyId ? await getHistoryById(historyId) : null;

  const breadcrumbs = [
    { name: "Главная", href: "/" },
    { name: "Каталог", href: "/catalog" },
    ...(category
      ? [{ name: category, href: `/catalog/${categorySlug}` }]
      : []),
    ...(history
      ? [{ name: history.title, href: `/histories/${historyId}` }]
      : []),
    ...(productTitle ? [{ name: productTitle, href: "#" }] : []),
  ];

  return (
    <Container className="max-w-[1380px]">
      <nav className={cn("text-sm text-gray-500 ml-5 my-2", className)}>
        <ul className="flex items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index !== breadcrumbs.length - 1 ? (
                <Link href={crumb.href} className="hover:underline">
                  {crumb.name}
                </Link>
              ) : (
                <span className="text-black line-clamp-1">{crumb.name}</span>
              )}
              {index !== breadcrumbs.length - 1 && (
                <span className="mx-2">/</span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
};

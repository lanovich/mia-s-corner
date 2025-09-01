import Link from "next/link";
import { Container } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface Props {
  categoryInfo?: { name: string; slug: string };
  historyInfo?: { name: string; id: string };
  productTitle?: string;
  className?: string;
}

export const Breadcrumbs: React.FC<Props> = ({
  categoryInfo,
  historyInfo,
  productTitle,
  className,
}) => {
  const breadcrumbs = [
    { name: "Главная", href: "/" },
    { name: "Каталог", href: "/catalog" },
    ...(categoryInfo?.slug
      ? [{ name: categoryInfo?.name, href: `/catalog/${categoryInfo?.slug}` }]
      : []),
    ...(historyInfo?.id
      ? [{ name: historyInfo?.name, href: `/histories/${historyInfo?.id}` }]
      : []),
    ...(productTitle ? [{ name: productTitle, href: "#" }] : []),
  ];

  return (
    <Container className="max-w-[1380px]">
      <nav className={cn("text-sm text-gray-500 ml-5 my-2", className)}>
        <ul className="flex items-center gap-2 overflow-hidden">
          {/* Полная версия для больших экранов */}
          <div className="hidden md:flex items-center">
            {breadcrumbs.map((crumb, index) => (
              <li key={`full-${index}`} className="flex items-center">
                {index !== breadcrumbs.length - 1 ? (
                  <Link
                    href={crumb.href}
                    className="hover:underline whitespace-nowrap"
                  >
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
          </div>

          {/* Сокращенная версия для мобильных */}
          <div className="flex md:hidden items-center">
            {breadcrumbs.length > 3 ? (
              <>
                <Link
                  href={breadcrumbs[0].href}
                  className="hover:underline whitespace-nowrap"
                >
                  {breadcrumbs[0].name}
                </Link>
                <span className="mx-2">/</span>
                <span>...</span>
                <span className="mx-2">/</span>
                <Link
                  href={breadcrumbs[breadcrumbs.length - 2].href}
                  className="hover:underline whitespace-nowrap"
                >
                  {breadcrumbs[breadcrumbs.length - 2].name}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-black line-clamp-1">
                  {breadcrumbs[breadcrumbs.length - 1].name}
                </span>
              </>
            ) : (
              // Если элементов мало, показываем как есть
              breadcrumbs.map((crumb, index) => (
                <li key={`mobile-${index}`} className="flex items-center">
                  {index !== breadcrumbs.length - 1 ? (
                    <Link
                      href={crumb.href}
                      className="hover:underline whitespace-nowrap"
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-black line-clamp-1">
                      {crumb.name}
                    </span>
                  )}
                  {index !== breadcrumbs.length - 1 && (
                    <span className="mx-2">/</span>
                  )}
                </li>
              ))
            )}
          </div>
        </ul>
      </nav>
    </Container>
  );
};

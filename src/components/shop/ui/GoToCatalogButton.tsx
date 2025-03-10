import Link from "next/link";

interface Props {
  categorySlug: string;
  categoryName: string;
}

export const GoToCatalogButton: React.FC<Props> = ({
  categorySlug,
  categoryName,
}) => {
  return (
    <div className="flex">
      <Link
        href={`/catalog/${categorySlug}`}
        className="m-auto rounded-full bg-black px-8 py-3 text-lg font-medium text-white transition-all duration-300 hover:bg-gray-600 shadow-lg"
      >
        открыть {categoryName} в каталоге
      </Link>
    </div>
  );
};

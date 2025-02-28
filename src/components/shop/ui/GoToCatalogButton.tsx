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
        className="m-auto rounded-full border border-black px-6 py-2 text-black bg-transparent hover:bg-black hover:text-white transition z-50 font-bold"
      >
        открыть {categoryName} в каталоге
      </Link>
    </div>
  );
};

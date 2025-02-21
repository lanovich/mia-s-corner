import Link from "next/link";

interface Props {
  categoryId: number;
  categoryName: string;
}

export const GoToCatalogButton: React.FC<Props> = ({
  categoryId,
  categoryName,
}) => {
  return (
    <div className="flex">
      <Link
        href={`/catalog/${categoryId}`}
        className="m-auto rounded-full border border-black px-6 py-2 text-black bg-transparent hover:bg-black hover:text-white transition z-50 font-bold"
      >
        открыть {categoryName} в каталоге
      </Link>
    </div>
  );
};

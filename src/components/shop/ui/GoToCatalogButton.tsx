import { CategoryWithProducts } from "../types";
import Link from "next/link";

interface Props {
  className?: string;
  category?: CategoryWithProducts;
}

export const GoToCatalogButton: React.FC<Props> = ({ className, category }) => {
  return <Link href={`catalog/${category?.id}`} className="">перейти в {category?.name}</Link>;
};

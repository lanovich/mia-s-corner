import { CustomLink } from "./CustomLink";
import { LINKS } from "@/constants";

interface Props {
  className?: string;
  onLinkClick?: () => void;
}

export const Navigation = ({ className, onLinkClick }: Props) => {
  return (
    <div className={className}>
      <CustomLink href={`${LINKS.CATALOG}`} onClick={onLinkClick}>
        Каталог
      </CustomLink>
      <CustomLink href="about" onClick={onLinkClick}>
        О нас
      </CustomLink>
      <CustomLink href="contacts" onClick={onLinkClick}>
        Контакты
      </CustomLink>
      <CustomLink href="/api/random-product" onClick={onLinkClick}>
        Случайный товар
      </CustomLink>
    </div>
  );
};

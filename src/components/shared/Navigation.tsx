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
      <CustomLink href={`/${LINKS.ABOUT}`} onClick={onLinkClick}>
        О нас
      </CustomLink>
      <CustomLink href={`/${LINKS.CONTACTS}`} onClick={onLinkClick}>
        Контакты
      </CustomLink>
      <CustomLink href="/api/random-product" onClick={onLinkClick}>
        Случайный товар
      </CustomLink>
    </div>
  );
};

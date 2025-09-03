import { CustomLink } from "./CustomLink";
import { LINKS } from "@/shared/model";

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
      <CustomLink
        href={`${LINKS.CATALOG}/${LINKS.HISTORIES}/1`}
        onClick={onLinkClick}
      >
        Истории
      </CustomLink>
      <CustomLink href={`/${LINKS.CONTACTS}`} onClick={onLinkClick}>
        Контакты
      </CustomLink>
      <CustomLink href={`/${LINKS.ABOUT}`} onClick={onLinkClick}>
        О нас
      </CustomLink>
      <CustomLink href="/api/products/random-product" onClick={onLinkClick}>
        Случайный товар
      </CustomLink>
    </div>
  );
};

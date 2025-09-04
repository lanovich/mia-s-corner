import { CustomLink } from ".";

interface CardProps {
  slug: string;
  title: string;
  image?: string;
  description?: string;
  href: string;
}

export function CatalogCard({
  slug,
  title,
  image,
  description,
  href,
}: CardProps) {
  return (
    <CustomLink
      key={slug}
      href={href}
      className="block w-full h-[300px] relative overflow-hidden rounded-lg group"
    >
      {/* Фоновое изображение */}
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}

      {/* Затемнение фона */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

      {/* Контент карточки */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {description && <p className="text-sm line-clamp-2">{description}</p>}
      </div>
    </CustomLink>
  );
}

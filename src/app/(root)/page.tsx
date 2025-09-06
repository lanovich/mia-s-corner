import { LINKS } from "@/shared/model";
import {
  ChapterHeading,
  ImageCarousel,
  СhapterContainer,
  HeroSection,
} from "@/shared/ui";
import { AboutSection } from "@/widgets/about-page/motion";
import { Shop } from "@/widgets/main-products/ui";

export default function Home() {
  return (
    <>
      <ImageCarousel>
        <HeroSection
          title="Откройте для себя новую историю"
          textXPosition={"center"}
          textYPosition={"center"}
          description="Звёздный маскарад, вишнёвые воспоминания и миг, когда весь мир замер — лишь чтобы их сердца снова встретились"
          buttonText="Перейти к истории"
          buttonPosition="center"
          smallImage="https://www.mias-corner.ru/history_1.jpg"
          buttonUrl={`${LINKS.CATALOG}/${LINKS.HISTORIES}/1`}
          className="bg-gradient-to-tl from-purple-50 to-indigo-100"
        />
        <HeroSection
          title={"Мы теперь в Pinterest"}
          textXPosition={"center"}
          textYPosition={"center"}
          smallImage="/aromasachet.jpg"
          className="bg-gradient-to-t from-rose-50 to-pink-100"
          buttonText="Подписаться на Pinterest"
          buttonPosition="center"
          buttonUrl="https://ru.pinterest.com/mias_corner/"
          target="_blank"
        />
        <HeroSection
          title={"Мы теперь в Telegram"}
          textXPosition={"center"}
          textYPosition={"center"}
          description="подписывайтесь на Telegram, чтобы не пропустить всё самое важное"
          buttonPosition="center"
          className="bg-gradient-to-br from-blue-50 to-blue-100"
          buttonText="Подписаться на Telegram"
          buttonUrl="https://t.me/mias_corner"
          target="_blank"
        />
      </ImageCarousel>

      <СhapterContainer className="mb-12 max-w-none">
        <ChapterHeading>Наши продукты</ChapterHeading>
        <Shop />
      </СhapterContainer>

      <СhapterContainer>
        <ChapterHeading>О нас</ChapterHeading>
        <AboutSection />
      </СhapterContainer>
    </>
  );
}

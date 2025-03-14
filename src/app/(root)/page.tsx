import {
  ChapterHeading,
  ImageCarousel,
  СhapterContainer,
  HeroSection,
} from "@/components/shared";
import Shop from "@/components/shop/Shop";
import { AboutSection } from "@/components/about";

export default function Home() {
  return (
    <>
      <ImageCarousel>
        <HeroSection
          title="Откройте для себя новую историю"
          textXPosition={"center"}
          textYPosition={"center"}
          description="окунитесь в момент встречи двух влюблённых на старом тихом чердаке"
          buttonText="Товар из новой истории"
          buttonPosition="center"
          buttonUrl="https://t.me/mias_corner"
        />
        <HeroSection
          title={"Мы теперь в Pinterest"}
          textXPosition={"center"}
          textYPosition={"center"}
          smallImage="/aromasachet.jpg"
          buttonText="Подписаться на Pinterest"
          buttonPosition="center"
          buttonUrl="https://ru.pinterest.com/mias_corner/"
        />
        <HeroSection
          title={"Мы теперь в Telegram"}
          textXPosition={"center"}
          textYPosition={"center"}
          description="подписывайтесь на наш Telegram, чтобы не пропустить всё самое важное"
          buttonPosition="center"
          buttonText="Подписаться на Telegram"
          buttonUrl="https://t.me/mias_corner"
        />
      </ImageCarousel>

      <СhapterContainer>
        <ChapterHeading>О нас</ChapterHeading>
        <AboutSection />
      </СhapterContainer>

      <СhapterContainer className="mb-16">
        <ChapterHeading>Наши продукты</ChapterHeading>
        <Shop />
      </СhapterContainer>
    </>
  );
}

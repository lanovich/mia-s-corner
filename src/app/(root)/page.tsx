import {
  ChapterHeading,
  ImageCarousel,
  СhapterContainer,
  HeroSection,
} from "@/components/shared";
import Shop from "@/components/shop/Shop";
import { AboutSection } from "@/components/about";
import { LINKS } from "@/constants";

export default function Home() {
  return (
    <>
      <ImageCarousel>
        <HeroSection
          title="Откройте для себя новую историю"
          textXPosition={"center"}
          textYPosition={"center"}
          description="окунитесь в момент встречи двух влюблённых на старом тихом чердаке"
          buttonText="Перейти к новой истории"
          buttonPosition="center"
          buttonUrl={`${LINKS.CATALOG}/${LINKS.HISTORIES}/4`}
          backgroundImage=""
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
          description="подписывайтесь на наш Telegram, чтобы не пропустить всё самое важное"
          buttonPosition="center"
          className="bg-gradient-to-br from-blue-50 to-blue-100"
          buttonText="Подписаться на Telegram"
          buttonUrl="https://t.me/mias_corner"
          target="_blank"
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

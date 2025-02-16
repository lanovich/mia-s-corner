import {
  ChapterHeading,
  ImageCarousel,
  AboutSection,
  СhapterContainer,
} from "@/components/shared";
import Shop from "@/components/shop/Shop";
import { NewCollection } from "@/components/shared/slides";

export default function Home() {
  return (
    <>
      <ImageCarousel>
        <NewCollection />
        <NewCollection />
        <NewCollection />
        <NewCollection />
      </ImageCarousel>

      <СhapterContainer>
        <ChapterHeading>Наши продукты</ChapterHeading>
        <Shop />
      </СhapterContainer>

      <СhapterContainer>
        <ChapterHeading>О нас</ChapterHeading>
        <AboutSection
          heading="Идея компании"
          description="Наша фишка - истории.
Каждый наш аромат имеет название, которое связано с другими названиями ароматов линейки. Собрав всю линейку, ты сможешь целиком погрузиться в атмосферу истории.
Аромат не привязан к конкретному изделию - то есть свечи, диффузоры и саше с одинаковым ароматом называются одинаково"
          link="ссылка куда-то"
        ></AboutSection>
        <AboutSection
          heading="Что-то ещё"
          description=""
          link="ссылка куда-то"
        ></AboutSection>
      </СhapterContainer>
    </>
  );
}

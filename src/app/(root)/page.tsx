import {
  ChapterHeading,
  ImageCarousel,
  СhapterContainer,
  HeroSection,
  HeroSectionTelegram,
} from "@/components/shared";
import Shop from "@/components/shop/Shop";
import { NewCollection } from "@/components/shared/slides";
import { AboutSection } from "@/components/about";

export default function Home() {
  return (
    <>
      <ImageCarousel>
        <NewCollection />
        <HeroSection />
        <HeroSectionTelegram />
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

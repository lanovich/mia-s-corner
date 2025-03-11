import {
  ChapterHeading,
  ImageCarousel,
  СhapterContainer,
  HeroSection,
  HeroSectionTelegram,
} from "@/components/shared";
import Shop from "@/components/shop/Shop";
import { NewCollection } from "@/components/shared/slides";
import { lazy, Suspense } from "react";

const AboutSection = lazy(() => import("@/components/about/AboutSection"));

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
        <Suspense fallback={<div>Загрузка...</div>}>
          <AboutSection />
        </Suspense>
      </СhapterContainer>

      <СhapterContainer className="mb-16">
        <ChapterHeading>Наши продукты</ChapterHeading>
        <Shop />
      </СhapterContainer>
    </>
  );
}

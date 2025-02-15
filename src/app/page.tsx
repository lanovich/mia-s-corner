import {
  ChapterHeading,
  ImageCarousel,
  AboutSection,
  СhapterContainer,
  ProductCategories,
  ShopCarousel,
  ProductGroupList,
} from "@/components/shared";
import { NewCollection } from "@/components/shared/slides";

const cats = [
  { id: 1, name: "Популярное" },
  { id: 2, name: "Свечи" },
  { id: 3, name: "Аромадиффузоры" },
  { id: 4, name: "Аромасаше" },
  { id: 5, name: "Прочее" },
];

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

        <ShopCarousel cats={cats}>
          <ProductGroupList
            categoryTitle={cats[1].name}
            categoryId={cats[1].id}
            products={[
              {
                id: 1,
                title: "Она влюбилась в простака, Он убил её на закате и они долго и счастливо что-то делали",
                compound: "Ирис, ваниль, пачули, персик, манго, белини, привет",
                size: "100мл",
                price: 450,
                imageUrl: "/main.jpg",
              },
              {
                id: 2,
                title: "Еще один заголовок",
                compound: "Ирис, ваниль, пачули",
                size: "100мл",
                price: 450,
                imageUrl: "https://i.pinimg.com/originals/10/0a/ee/100aee44974916e10da52482ba1a26db.jpg",
              },
              {
                id: 3,
                title: "Она влюбилась в простака, Он убил её на закате",
                compound: "Ирис, ваниль, пачули",
                size: "100мл",
                price: 450,
                imageUrl: "/main.jpg",
              },
              {
                id: 4,
                title: "Она влюбилась в простака, Он убил её на закате",
                compound: "Ирис, ваниль, пачули",
                size: "100мл",
                price: 450,
                imageUrl: "/main.jpg",
              },
              {
                id: 5,
                title: "Она влюбилась в простака, Он убил её на закате",
                compound: "Ирис, ваниль, пачули",
                size: "100мл",
                price: 450,
                imageUrl: "/main.jpg",
              },
              {
                id: 6,
                title: "Она влюбилась в простака, Он убил её на закате",
                compound: "Ирис, ваниль, пачули",
                size: "100мл",
                price: 450,
                imageUrl: "/main.jpg",
              },
              {
                id: 7,
                title: "Она влюбилась в простака, Он убил её на закате",
                compound: "Ирис, ваниль, пачули",
                size: "100мл",
                price: 450,
                imageUrl: "/main.jpg",
              },
              {
                id: 8,
                title: "Она влюбилась в простака, Он убил её на закате",
                compound: "Ирис, ваниль, пачули",
                size: "100мл",
                price: 450,
                imageUrl: "/main.jpg",
              },
            ]}
          />
          <ProductGroupList
            categoryTitle={cats[2].name}
            categoryId={cats[2].id}
            products={[
              {
                id: 1,
                title: "Она влюбилась в простака, Он убил её на закате",
                compound: "Ирис, ваниль, пачули",
                size: "100мл",
                price: 450,
                imageUrl: "/main.jpg",
              },
              {
                id: 2,
                title: "Она влюбилась в простака, Он убил её на закате",
                compound: "Ирис, ваниль, пачули",
                size: "100мл",
                price: 450,
                imageUrl: "/main.jpg",
              },
              {
                id: 3,
                title: "Она влюбилась в простака, Он убил её на закате",
                compound: "Ирис, ваниль, пачули",
                size: "100мл",
                price: 450,
                imageUrl: "/main.jpg",
              },
            ]}
          />
        </ShopCarousel>
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

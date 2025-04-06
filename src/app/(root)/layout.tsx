import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../globals.css";
import { Footer, Header, MobileCartButton } from "@/components/shared";
import { Toaster } from "sonner";
import { CookieBanner } from "@/components/shared/CookieBanner";

const roboto = Roboto({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mias-corner.ru"),
  title: "Mia's Corner | Ароматические свечи, диффузоры, духи",
  description:
    "Ароматические свечи и диффузоры ручной работы в Санкт-Петербурге. Каждый аромат - часть уникальной истории. Доставка по СПБ и ЛО. Натуральные компоненты. Свечи на заказ.",
  keywords:
    "ароматические свечи, диффузоры, аромасаше, духи, натуральные ароматы, свечи ручной работы, домашние ароматы, купить свечи в СПб, купить диффузоры в Санкт-Петербурге, аромасаше купить, духи ручной работы, соевые свечи, эко свечи, свечи с эфирными маслами, гипоаллергенные диффузоры, хлопковый фитиль, подарочные наборы свечей, свечи для релаксации, ароматерапия, свечи для спальни, диффузоры для офиса, автомобильные диффузоры, ароматические палочки, аромакамни, свечи в жестяных банках, ароматические мешочки, лавандовые свечи, ванильные духи, хвойные ароматы, цитрусовые диффузоры, цветочные саше, морские ароматы, кофейные свечи, романтические ароматы, уют в доме, натуральная парфюмерия, доставка свечей СПб, магазин ароматов в Петербурге, недорогие свечи ручной работы, духи на заказ, диффузоры с доставкой, саше для шкафа, ароматы для медитации, свечи для подарка, премиальные духи, элитные ароматы, handmade свечи, авторские духи, экологичные диффузоры, натуральные саше, уютные ароматы для дома",
  openGraph: {
    title: "Mia's Corner - Магазин ароматической продукции",
    description:
      "Ароматические продукты ручной работы из натуральных компонентов",
    url: "https://www.mias-corner.ru",
    siteName: "Mia's Corner",
    images: [
      {
        url: "https://www.mias-corner.ru/og.jpg",
        width: 630,
        height: 630,
        alt: "Ароматическая продукция Mia's Corner",
      },
    ],
    emails: ["miascorner.business@gmail.com"],
    locale: "ru_RU",
    countryName: "Russia",
    type: "website",
  },

  authors: [{ name: "Mia's Corner", url: "https://www.mias-corner.ru" }],
  creator: "Mia's Corner",
  publisher: "Mia's Corner",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  other: {
    "geo.position": "59.934280;30.335099",
    "geo.placename": "Saint Petersburg, Russia",
    "geo.region": "RU-SPB",

    "yandex-verification": "ce248331bf85f524",
    yandex: "enable",
  },

  icons: {
    icon: "/favicon.ico",

    shortcut: "/favicon.ico",
    apple: "apple-touch-icon.png",

    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        url: "/favicon-96x96.png",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        url: "/favicon.svg",
      },
      {
        rel: "manifest",
        url: "https://www.mias-corner.ru/site.webmanifest",
      },
    ],
  },

  alternates: {
    canonical: "https://www.mias-corner.ru",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${roboto.variable} antialiased`}>
        <main className="min-h-screen">
          <Header />
          {children}
          <MobileCartButton />
          <CookieBanner />
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

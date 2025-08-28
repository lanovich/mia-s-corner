import { Metadata } from "next";
import { LINKS } from "@/constants";
import { ContactPageClient } from "@/widgets/contact-page/ui";

export const metadata: Metadata = {
  title: "Контакты | Mia's Corner - связь с магазином ароматов",
  description:
    "Контактная информация магазина ароматических свечей и диффузоров Mia's Corner. Адрес, телефон, email и форма обратной связи в Санкт-Петербурге.",
  alternates: {
    canonical: "https://www.mias-corner.ru/contacts",
  },
  openGraph: {
    title: "Контакты | Mia's Corner",
    description:
      "Свяжитесь с нами по вопросам покупки ароматических свечей, диффузоров, саше",
    url: "https://www.mias-corner.ru/contacts",
    images: [
      {
        url: "https://www.mias-corner.ru/og.jpg",
        width: 1200,
        height: 630,
        alt: "Контактная информация Mia's Corner",
      },
    ],
    type: "website",
    siteName: "Mia's Corner",
  },
  keywords: [
    "контакты Mia's Corner",
    "как связаться с Mia's Corner",
    "адрес магазина ароматов СПб",
    "телефон для заказа свечей",
    "форма обратной связи",
    "контакты магазина свечей Санкт-Петербург",
    "где купить аромадиффузоры в СПб",
    "официальные контакты Mia's Corner",
    "электронная почта магазина ароматов",
    "график работы Mia's Corner",
  ],
  other: {
    email: LINKS.GMAIL,
    contact: `email: ${LINKS.GMAIL}`,
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}

import { LINKS } from "@/constants";
import { Container } from "./Container";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <Container>
        <div className="container mx-auto px-4 flex flex-col">
          {/* Основной контент футера */}
          <div className="py-10 flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold">
                Mia's Corner | Санкт-Петербург
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Каждый наш аромат - часть истории
              </p>
            </div>

            {/* Навигация */}
            <nav className="mt-6 md:mt-0">
              <ul className="flex flex-wrap justify-center gap-6 text-gray-300">
                <li>
                  <Link
                    href={LINKS.CATALOG}
                    className="hover:text-white transition"
                  >
                    Каталог
                  </Link>
                </li>
                <li>
                  <Link
                    href={LINKS.ABOUT}
                    className="hover:text-white transition"
                  >
                    О нас
                  </Link>
                </li>
                <li>
                  <Link
                    href={LINKS.CONTACTS}
                    className="hover:text-white transition"
                  >
                    Контакты
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Соцсети */}
            <div className="mt-6 md:mt-0 flex gap-4">
              <Link
                href={LINKS.PINTEREST}
                className="hover:text-gray-400 transition"
              >
                Pinterest
              </Link>
              <Link
                href={LINKS.TELEGRAM}
                className="hover:text-gray-400 transition"
              >
                Telegram
              </Link>
              <Link href={LINKS.VK} className="hover:text-gray-400 transition">
                VK
              </Link>
            </div>
          </div>

          {/* Реквизиты */}
          <div className="py-4 border-t border-gray-800">
            <ul className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              <li className="flex items-center">
                <span className="font-medium mr-1">ИП:</span>
                <span>Добромыслова Мария Алексеевна</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-1">ИНН:</span>
                <span>352841176253</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-1">ОГРНИП:</span>
                <span>324350000060030</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

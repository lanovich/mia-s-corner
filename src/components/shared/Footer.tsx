import { Container } from "./Container";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-10">
      <Container>
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold">Mia's Corner</h2>
            <p className="text-gray-400 text-sm mt-1">
              Каждый наш аромат - часть истории
            </p>
          </div>

          {/* Навигация */}
          <nav className="mt-6 md:mt-0">
            <ul className="flex flex-wrap justify-center gap-6 text-gray-300">
              <li>
                <a href="/catalog" className="hover:text-white transition">
                  Каталог
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition">
                  О нас
                </a>
              </li>
              <li>
                <a href="/contacts" className="hover:text-white transition">
                  Контакты
                </a>
              </li>
            </ul>
          </nav>

          {/* Соцсети */}
          <div className="mt-6 md:mt-0 flex gap-4">
            <a href="#" className="hover:text-gray-400 transition">
              Pinterest
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              Telegram
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              VK
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

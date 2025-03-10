import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <Link href={"/"} className="select-none w-24 h-full">
          <Image
            className="pointer-events-none select-none object-contain w-24 h-[100%] filter invert"
            style={{ width: "auto", height: "auto" }}
            src="/logo.svg"
            alt="logo"
            width={96}
            height={96}
          />
        </Link>
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold">Mia's Corner</h2>
          <p className="text-gray-400 text-sm mt-1">
            Ароматы, создающие уют и атмосферу.
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
            Vkontakte
          </a>
        </div>
      </div>

      {/* Копирайт */}
      <div className="text-center text-gray-500 text-sm mt-6">
        &copy; {new Date().getFullYear()} Mia's Corner. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;

import Image from "next/image";

export const HeroSection = ({ className }: { className?: string }) => {
  return (
    <div
      className={`${className} relative flex h-[80vh] flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 overflow-hidden text-center px-6`}
    >
      {/* Блоб фоны */}
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute w-2/3 h-2/3 top-0 left-0 opacity-30 blur"
      >
        <path
          fill="#a11329"
          d="M28.7,-41.4C37.1,-27.1,43.7,-18,50.6,-5C57.6,8,64.9,24.8,62.1,41.6C59.3,58.4,46.3,75,29.7,80.5C13.2,86,-7,80.4,-20.6,69.8C-34.1,59.1,-41.1,43.4,-52.5,28.1C-64,12.8,-80,-2,-77.9,-13.8C-75.9,-25.5,-55.8,-34.1,-39.8,-47C-23.9,-60,-11.9,-77.3,-0.9,-76.3C10.1,-75.2,20.3,-55.7,28.7,-41.4Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute w-1/2 h-1/2 bottom-0 right-0 opacity-20 blur"
      >
        <path
          fill="#FF0066"
          d="M62.3,-26.1C76.6,-11.1,81.4,19.3,69.4,34.7C57.5,50,28.7,50.3,1.1,49.7C-26.5,49,-53,47.5,-63.2,33.2C-73.4,18.8,-67.2,-8.2,-54,-22.7C-40.7,-37.1,-20.4,-38.9,1.8,-39.9C23.9,-41,47.9,-41.2,62.3,-26.1Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Текст */}
      <h2 className="relative z-10 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl text-gray-800">
        Теперь мы в Pinterest
      </h2>
      <p className="relative z-10 max-w-xl mt-4 text-lg text-gray-600">
        Следите за нашими новинками и вдохновляйтесь стильными образами.
      </p>

      {/* Изображение */}
      <div className="relative z-10 mt-8 flex flex-wrap justify-center items-center gap-6">
        <Image
          src="/аромасаще.jpg"
          alt="Ароматическая свеча"
          width={280}
          height={280}
          className="rounded-xl shadow-xl transition-transform duration-300 hover:scale-105"
          priority
        />
      </div>

      {/* Кнопка */}
      <div className="relative z-10 mt-8">
        <button className="rounded-full bg-black px-8 py-3 text-lg font-medium text-white transition-all duration-300 hover:bg-gray-800 shadow-lg">
          <a href="https://ru.pinterest.com/mias_corner/">
            Перейти в Pinterest
          </a>
        </button>
      </div>
    </div>
  );
};

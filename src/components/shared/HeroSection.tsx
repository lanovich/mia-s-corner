import { cn } from "@/lib";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  title: string;
  textXPosition: "left" | "right" | "center";
  textYPosition: "top" | "center" | "bottom";
  backgroundImage?: string;
  smallImage?: string;
  description?: string;
  buttonUrl?: string;
  buttonText?: string;
  buttonPosition?: "left" | "right" | "center";
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  textXPosition,
  textYPosition,
  backgroundImage,
  smallImage,
  description,
  buttonUrl,
  buttonText,
  buttonPosition,
  className,
}) => {
  const textXPositionClasses = {
    left: "items-start",
    center: "items-center",
    right: "items-end",
  };

  const textYPositionClasses = {
    top: "justify-start",
    center: "justify-center",
    bottom: "justify-end",
  };

  const buttonPositionClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div
      className={cn(
        "relative flex h-[80vh] flex-col overflow-hidden px-8 md:px-16 lg:px-24 bg-slate-100",
        textXPositionClasses[textXPosition],
        textYPositionClasses[textYPosition],
        className
      )}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Текст */}
      <div className="relative z-10 max-w-2xl text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-800">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
            {description}
          </p>
        )}
      </div>

      {smallImage && (
        <div className="relative z-10 mt-8">
          <Image
            src={smallImage}
            alt="Small Image"
            width={200}
            height={200}
            className="rounded-xl shadow-xl transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>
      )}

      {buttonText && buttonUrl && (
        <div
          className={cn(
            "relative z-10 mt-8 flex w-full",
            buttonPosition
              ? buttonPositionClasses[buttonPosition]
              : textXPositionClasses[textXPosition]
          )}
        >
          <Link href={buttonUrl} target="_blank">
            <button className="rounded-full bg-black px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-medium text-white transition-all duration-300 hover:bg-gray-800 shadow-lg">
              {buttonText}
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

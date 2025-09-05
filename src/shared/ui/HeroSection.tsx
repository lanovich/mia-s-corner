import { cn } from "@/shared/lib";
import Image from "next/image";
import { GoToButton } from "@/shared/ui";

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
  target?: string;
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
  target,
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
        "relative flex h-[80dvh] flex-col overflow-hidden px-8 md:px-16 lg:px-24 bg-slate-100",
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
        <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-gray-800">
          {title}
        </h2>
        {smallImage && (
          <div className="relative z-10 mt-8 w-[200px] h-[160px] mx-auto">
            <Image
              src={smallImage}
              alt="Small Image"
              fill
              sizes="200px"
              className="rounded-xl shadow-xl transition-transform duration-300 hover:scale-105 object-cover"
            />
          </div>
        )}
        {description && (
          <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-600">
            {description}
          </p>
        )}
      </div>

      {buttonText && buttonUrl && (
        <div
          className={cn(
            "relative z-10 mt-8 flex w-full",
            buttonPosition
              ? buttonPositionClasses[buttonPosition]
              : textXPositionClasses[textXPosition]
          )}
        >
          <GoToButton href={buttonUrl} label={buttonText} target={target} />
        </div>
      )}
    </div>
  );
};

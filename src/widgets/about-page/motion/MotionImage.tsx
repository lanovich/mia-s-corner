"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type ForegroundLayer = {
  imageUrl: string;
  speed?: number;
  zIndex?: number;
  className?: string;
};

export const MotionImage = ({
  imageUrl,
  foregroundLayers = [],
}: {
  imageUrl: string;
  foregroundLayers?: ForegroundLayer[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-25%", "25%"]);

  return (
    <div
      ref={containerRef}
      className="relative h-[70vh] w-full overflow-hidden"
    >
      <div
        ref={windowRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[90%] md:w-4/5 md:h-[90%] overflow-hidden rounded-none md:rounded-lg z-10"
      >
        <motion.div
          style={{
            y: bgY,
            backgroundImage: `url(${imageUrl})`,
          }}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
        />

        {foregroundLayers.map((layer, index) => {
          const speed = layer.speed || 0.5;
          const layerY = useTransform(
            scrollYProgress,
            [0, 1],
            [`${-15 * speed}%`, `${15 * speed}%`]
          );

          return (
            <motion.div
              key={index}
              style={{
                y: layerY,
                zIndex: layer.zIndex || 15,
                backgroundImage: `url(${layer.imageUrl})`,
              }}
              className={`absolute inset-0 w-full h-full bg-cover bg-center ${
                layer.className || ""
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

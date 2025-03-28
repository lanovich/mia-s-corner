"use client";

import { motion, useInView, stagger, useAnimate } from "framer-motion";
import { useEffect, useRef } from "react";
import { MotionImage } from "./MotionImage";
import { GoToButton } from "../shop/ui";
import { LINKS } from "@/constants";

export const AboutSection = () => {
  const [scope, animate] = useAnimate();
  const textRef = useRef(null);
  const imageContainerRef = useRef(null);

  const isTextInView = useInView(textRef, { margin: "-20% 0px", once: true });
  const isImageInView = useInView(imageContainerRef, {
    margin: "-10% 0px",
    once: true,
  });

  useEffect(() => {
    if (isTextInView) {
      animate(
        ".text-block",
        { opacity: 1, y: 0 },
        { delay: stagger(0.15), duration: 0.8 }
      );
    }
  }, [isTextInView, animate]);

  return (
    <section ref={scope} className="w-full mb-16">
      <div className="relative flex flex-col md:flex-row justify-between overflow-hidden px-4 md:px-4 text-center md:text-start">
        <div
          ref={textRef}
          className="flex flex-col space-y-6 w-full md:w-1/2 mt-5 md:mt-28 px-4 md:px-0"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            className="text-block text-2xl md:text-3xl font-bold z-10"
          >
            Каждый наш аромат — часть истории.
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            className="text-block text-xl md:text-2xl text-gray-600 z-10"
          >
            Названия связаны между собой, создавая единую линию повествования.
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            className="text-block hidden md:flex"
          >
            <GoToButton
              href={`${LINKS.ABOUT}`}
              label={"Узнать о нас подробнее"}
            />
          </motion.div>
        </div>

        <motion.div
          ref={imageContainerRef}
          initial={{ opacity: 0 }}
          animate={
            isImageInView
              ? {
                  opacity: 1,
                  transition: {
                    duration: 0.8,
                    ease: "easeOut",
                    delay: 0.3,
                  },
                }
              : {}
          }
          className="w-full md:w-1/2 md:mt-0"
        >
          <div className="block md:hidden">
            {/* Мобильная версия */}
            <MotionImage imageUrl="/image.webp" />
          </div>
          <div className="hidden md:block">
            {/* Десктопная версия */}
            <MotionImage imageUrl="/image.webp" />
          </div>
        </motion.div>

        <GoToButton
          href={`${LINKS.ABOUT}`}
          label={"Узнать о нас подробнее"}
          className="mx-auto flex md:hidden mt-6 px-4"
        />
      </div>
    </section>
  );
};

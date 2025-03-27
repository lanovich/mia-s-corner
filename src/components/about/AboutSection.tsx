"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MotionImage } from "./MotionImage";
import { GoToButton } from "../shop/ui";
import { LINKS } from "@/constants";

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.3,
    once: true,
  });

  return (
    <section ref={ref} className="w-full mb-16">
      <div className="relative flex flex-col md:flex-row justify-between overflow-hidden px-4 text-center md:text-start">
        {/* Текстовый блок */}
        <div className="flex flex-col space-y-6 w-full md:w-1/2 mt-5 md:mt-28">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold z-10"
          >
            Каждый наш аромат — часть истории.
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 z-10"
          >
            Названия связаны между собой, создавая единую линию повествования.
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <GoToButton
              href={`${LINKS.ABOUT}`}
              label={"Узнать о нас подробнее"}
              className="hidden md:flex"
            />
          </motion.div>
        </div>

        {/* Картинка */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end md:mt-0">
          <MotionImage />
        </div>
          <GoToButton
            href={`${LINKS.ABOUT}`}
            label={"Узнать о нас подробнее"}
            className="mx-auto flex md:hidden"
          />
      </div>
    </section>
  );
};

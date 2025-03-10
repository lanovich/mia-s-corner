import React from "react";
import { MotionText } from "./MotionText";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib";

interface Props {
  className?: string;
}

export const MotionImage: React.FC<Props> = ({ className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.6,
    once: true,
  });

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full h-[500px] mx-auto px-4 overflow-hidden mb-4",
        className
      )}
    >
      {/* Крупный текст */}
      <MotionText
        text={"Отдых под могучим дубом с раскидистыми ветвями"}
        position={{ top: "5%", left: "30%" }}
        delay={0.75}
        className="w-52 sm:w-52"
        size="md"
        depth="near"
        isInView={isInView}
      />
      <MotionText
        text={"Она влюбилась в простака"}
        position={{ top: "45%", left: "25%" }}
        delay={0.75}
        size="md"
        depth="near"
        isInView={isInView}
      />
      <MotionText
        text={"Ожидание её в старом балетном зале"}
        position={{ top: "70%", left: "60%" }}
        delay={0.75}
        size="md"
        depth="near"
        isInView={isInView}
      />

      {/* Средний текст */}
      <MotionText
        text={"Бутылка грушевого коньяка стала изюминкой вечера"}
        position={{ top: "60%", left: "5%" }}
        delay={1.25}
        size="sm"
        depth="middle"
        isInView={isInView}
      />
      <MotionText
        text={"Объятия тёплого вечера в тени старого дерева"}
        position={{ top: "25%", left: "55%" }}
        delay={1.25}
        size="sm"
        depth="middle"
        isInView={isInView}
      />
      <MotionText
        text={"Влюблённые стояли у обрыва"}
        position={{ top: "55%", left: "50%" }}
        delay={1.25}
        size="sm"
        depth="middle"
        isInView={isInView}
      />
      <MotionText
        text={"Он подарил ей книгу на старом чердаке"}
        position={{ top: "33%", left: "0%" }}
        delay={1.5}
        size="sm"
        depth="middle"
        isInView={isInView}
      />
      <MotionText
        text={"Желаемая встреча там, где всё началось"}
        position={{ top: "75%", left: "10%" }}
        delay={1.5}
        size="sm"
        depth="middle"
        isInView={isInView}
      />

      {/* Мелкий текст */}
      <MotionText
        text={"Она танцевала в лунном свете"}
        position={{ top: "90%", left: "45%" }}
        delay={2}
        size="xs"
        depth="far"
        isInView={isInView}
      />
      <MotionText
        text={"Каждое слово будто оживляло забытые мечты"}
        position={{ top: "20%", left: "5%" }}
        delay={2}
        size="xs"
        depth="far"
        isInView={isInView}
      />
      <MotionText
        text={"Он убил её на закате"}
        position={{ top: "40%", left: "50%" }}
        delay={2}
        size="xs"
        depth="far"
        isInView={isInView}
      />
    </div>
  );
};

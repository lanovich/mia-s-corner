"use client";

import { cn } from "@/lib";
import { motion } from "framer-motion";

interface MotionTextProps {
  text: string;
  position?: { top?: string; left?: string; right?: string; bottom?: string };
  delay?: number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xs";
  depth?: "near" | "middle" | "far";
  isInView?: boolean;
}

export const MotionText: React.FC<MotionTextProps> = ({
  text,
  position = { top: "0%", left: "0%" },
  delay = 0,
  className = "",
  size = "sm",
  depth = "middle",
  isInView = false,
}) => {
  const textVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const textColor =
    depth === "near"
      ? "text-black/100"
      : depth === "middle"
      ? "text-black/70"
      : "text-black/50";

  const textShadow =
    depth === "near"
      ? "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))"
      : depth === "middle"
      ? "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))"
      : "drop-shadow(0.5px 0.5px 1px rgba(0, 0, 0, 0.2))";

  return (
    <motion.p
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={textVariants}
      transition={{ duration: 0.8, delay }}
      className={cn(
        `absolute text-${size} text-center w-48 select-none ${textColor}`,
        className
      )}
      style={{
        top: position.top,
        left: position.left,
        right: position.right,
        bottom: position.bottom,
        filter: textShadow,
        transform:
          depth === "near"
            ? "scale(1.1)"
            : depth === "far"
            ? "scale(0.9)"
            : "scale(1)",
      }}
    >
      {text}
    </motion.p>
  );
};

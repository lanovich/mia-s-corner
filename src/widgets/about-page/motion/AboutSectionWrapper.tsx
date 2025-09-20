"use client";

import dynamic from "next/dynamic";

export const AboutSection = dynamic(
  () =>
    import("@/widgets/about-page/motion/AboutSection").then((m) => m.default),
  { ssr: false }
);

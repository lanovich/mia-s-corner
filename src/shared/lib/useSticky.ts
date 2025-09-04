"use client";

import { useState, useEffect, useRef } from "react";

interface UseStickyOptions {
  offset?: number;
  initialSticky?: boolean;
}

export const useSticky = ({
  offset = 0,
  initialSticky = false,
}: UseStickyOptions = {}) => {
  const [isSticky, setIsSticky] = useState(initialSticky);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      if (!ref.current) return;
      const { top } = ref.current.getBoundingClientRect();
      setIsSticky(top <= offset);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset]);

  return { ref, isSticky, isMobile };
};

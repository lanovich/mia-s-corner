"use client"

import { useState, useEffect, useRef } from "react";
import type { EmblaCarouselType } from "embla-carousel";

interface UseEmblaAutoplayProps {
  emblaApi?: EmblaCarouselType;
  delay?: number;
}

export function useEmblaAutoplay({
  emblaApi,
  delay = 6000,
}: UseEmblaAutoplayProps) {
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!emblaApi) return;

    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (isPaused) return;

    autoPlayRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, delay);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [emblaApi, isPaused, delay]);

  useEffect(() => {
    const handleVisibilityChange = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  return { isPaused, pause, resume };
}

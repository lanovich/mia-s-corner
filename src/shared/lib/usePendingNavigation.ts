"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const usePendingNavigation = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  return { isPending, navigate };
};

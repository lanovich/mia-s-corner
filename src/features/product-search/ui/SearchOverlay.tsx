"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HeaderSearch } from "./HeaderSearch";
import { Button } from "@/shared/shadcn-ui";
import { SearchIcon, X } from "lucide-react";
import { cn } from "@/shared/lib";
import { useClickOutside } from "../lib";

interface Props {
  className?: string;
}

export const SearchOverlay = ({ className }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  return (
    <>
      <Button
        className={cn("flex sm:hidden md:flex lg:hidden", className)}
        onClick={() => setIsOpen(true)}
      >
        <SearchIcon size={36} />
      </Button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-40 bg-black/50 flex justify-center items-start p-4">
            <div
              ref={containerRef}
              className="w-full max-w-2xl bg-white rounded-lg shadow-lg relative"
            >
              <HeaderSearch
                className="p-2"
                autoFocus
                onClose={() => setIsOpen(false)}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

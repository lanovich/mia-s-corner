import { ProductSize, ShortProductSize } from "@/entities/product/model";
import { create } from "zustand";

interface SelectedSizeStore {
  selectedSize: ShortProductSize | null;
  setSelectedSize: (size: ShortProductSize) => void;
}

export const useSelectedSizeStore = create<SelectedSizeStore>((set) => ({
  selectedSize: null,
  setSelectedSize: (size) => set({ selectedSize: size }),
}));

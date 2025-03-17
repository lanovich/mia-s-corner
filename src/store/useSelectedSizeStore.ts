import { create } from "zustand";

interface SelectedSizeStore {
  selectedSize: ProductSize | null;
  setSelectedSize: (size: ProductSize) => void;
}

export const useSelectedSizeStore = create<SelectedSizeStore>((set) => ({
  selectedSize: null,
  setSelectedSize: (size) => set({ selectedSize: size }),
}));

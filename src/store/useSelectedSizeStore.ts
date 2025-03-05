import { create } from "zustand";

interface SelectedSizeStore {
  selectedSize: Size | null;
  setSelectedSize: (size: Size) => void;
}

export const useSelectedSizeStore = create<SelectedSizeStore>((set) => ({
  selectedSize: null,
  setSelectedSize: (size) => set({ selectedSize: size }),
}));

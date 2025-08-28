import { create } from "zustand";

interface DropDownNavigationStore {
  isMenuOpened: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

export const useDropDownNavigation = create<DropDownNavigationStore>((set) => ({
  isMenuOpened: false,
  toggleMenu: () => set((state) => ({ isMenuOpened: !state.isMenuOpened })),
  closeMenu: () => set({ isMenuOpened: false }),
}));

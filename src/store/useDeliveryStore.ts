import { create } from "zustand";

type DeliveryMethod = "fastDelivery" | "postalDelivery" | "selfPickup";

interface DeliveryStore {
  selectedMethod: DeliveryMethod | null;
  setSelectedMethod: (method: DeliveryMethod) => void;
}

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  selectedMethod: null,
  setSelectedMethod: (method) => set({ selectedMethod: method }),
}));
import { create } from "zustand";

type DeliveryMethod = "fastDelivery" | "selfPickup";

interface DeliveryStore {
  selectedMethod: DeliveryMethod;
  setSelectedMethod: (method: DeliveryMethod) => void;
}

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  selectedMethod: "selfPickup",
  setSelectedMethod: (method) => set({ selectedMethod: method }),
}));
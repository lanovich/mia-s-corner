import { create } from "zustand";

export type DeliveryMethod = "fastDelivery" | "selfPickup" | "postalDelivery";

interface DeliveryStore {
  selectedDeliveryMethod: DeliveryMethod;
  setselectedDeliveryMethod: (method: DeliveryMethod) => void;
  deliveryPrice: number;
  setDeliveryPrice: (price: number) => void;
}

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  selectedDeliveryMethod: "selfPickup",
  deliveryPrice: 0,
  setselectedDeliveryMethod: (method) =>
    set({ selectedDeliveryMethod: method }),
  setDeliveryPrice: (price: number) => set({ deliveryPrice: price }),
}));

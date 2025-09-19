import { create } from "zustand";
import { PickupPoint } from "./types";
import { getOpenSubmitByMethod } from "../lib";

export type DeliveryMethod = "fastDelivery" | "selfPickup" | "postalDelivery";

interface DeliveryStore {
  selectedDeliveryMethod: DeliveryMethod;
  openSubmit: boolean;
  setOpenSubmit: (bool: boolean) => void;
  setSelectedDeliveryMethod: (method: DeliveryMethod) => void;
  deliveryPrice: number;
  setDeliveryPrice: (price: number) => void;

  pickupPoints: PickupPoint[];
  setPickupPoints: (points: PickupPoint[]) => void;
  clearPickupPoints: () => void;

  selectedPoint: PickupPoint | null;
  setSelectedPoint: (point: PickupPoint | null) => void;
}

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  selectedDeliveryMethod: "selfPickup",
  openSubmit: true,
  deliveryPrice: 0,

  pickupPoints: [],
  setPickupPoints: (points) => set({ pickupPoints: points }),
  clearPickupPoints: () => set({ pickupPoints: [] }),

  setSelectedDeliveryMethod: (method) =>
    set({
      selectedDeliveryMethod: method,
      openSubmit: getOpenSubmitByMethod(method),
    }),
  setDeliveryPrice: (price: number) => set({ deliveryPrice: price }),
  setOpenSubmit: (bool: boolean) => set({ openSubmit: bool }),

  selectedPoint: null,
  setSelectedPoint: (point) => set({ selectedPoint: point }),
}));

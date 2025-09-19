import { DeliveryMethod } from "../model";

export const getOpenSubmitByMethod = (method: DeliveryMethod): boolean => {
  switch (method) {
    case "selfPickup":
      return true;
    case "fastDelivery":
      return false;
    case "postalDelivery":
      return false;
    default:
      return false;
  }
};

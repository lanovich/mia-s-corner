import { PickupPoint } from "../model";

const STOP_WORDS = new Set(["улица", "проспект", "дом"]);

export const normalizeAddress = (str?: string) => {
  if (!str) return [];
  return str
    .toLowerCase()
    .replace(/[,\.]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => {
      if (word === "ул" || word === "улица") return "улица";
      if (word === "пр" || word === "просп" || word === "проспект")
        return "проспект";
      if (word === "д" || word === "дом") return "дом";
      return word;
    })
    .filter(Boolean);
};

export const hasAddressMatch = (input: string, target: string) => {
  const inputTokens = normalizeAddress(input).filter((t) => !STOP_WORDS.has(t));
  const targetTokens = normalizeAddress(target).filter(
    (t) => !STOP_WORDS.has(t)
  );

  if (inputTokens.length === 0 || targetTokens.length === 0) {
    return false;
  }

  const intersection = inputTokens.filter((t) => targetTokens.includes(t));

  return intersection.length > 0;
};

export const normalizeHouse = (str?: string) =>
  str
    ?.toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[,\.]/g, "")
    .replace(/корп(ус)?/g, "к")
    .replace(/лит(ера)?/g, "л")
    .trim() || "";

export function validateSelectedPoint(
  point: PickupPoint,
  city: string,
  street: string,
  building: string
) {
  if (!point) return false;

  const regionOk =
    hasAddressMatch(city, point.address?.region || "") ||
    hasAddressMatch(point.address?.region || "", city);

  const streetOk = hasAddressMatch(street, point.address?.street || "");
  const houseOk =
    normalizeHouse(building) === normalizeHouse(point.address?.house);

  return regionOk && streetOk && houseOk;
}

export function findPickupMatch(
  pickupPoints: PickupPoint[],
  city: string,
  street: string,
  building: string
) {
  return (
    pickupPoints.find((p) =>
      validateSelectedPoint(p, city, street, building)
    ) || null
  );
}

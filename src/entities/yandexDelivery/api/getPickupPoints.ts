import { apiFetch, withQuery } from "@/shared/api";
import { PickupPoint } from "../model";

export async function getPickupPoints(
  geoId: number,
): Promise<PickupPoint[]> {
  const url = withQuery("/api/yandex/pickup-points", { geo_id: geoId });

  return apiFetch<PickupPoint[]>(url, {
    method: "GET",
    revalidate: 60,
  });
}

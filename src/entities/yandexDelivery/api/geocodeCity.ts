import { apiFetch } from "@/shared/api";

export interface CityGeo {
  geo_id: number;
  address: string;
}

export async function geocodeCity(
  city: string
): Promise<{ points: CityGeo[] | [] }> {
  try {
    const data = await apiFetch<{ points: CityGeo[] }>(
      "/api/yandex/geography",
      {
        method: "POST",
        body: JSON.stringify({ name: city, type: "city" }),
      }
    );

    if (!data.points || data.points.length === 0) return { points: [] };

    return data;
  } catch (err) {
    console.error("GeocodeCity error:", err);
    return { points: [] };
  }
}

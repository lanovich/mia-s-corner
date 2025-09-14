import { apiFetch } from "@/shared/api";

export interface DaDataSuggestion<T = any> {
  value: string;
  unrestricted_value: string;
  data: T;
}

export interface DaDataAddressData {
  city?: string;
  street?: string;
  house?: string;
  [key: string]: any;
}

export interface DaDataResponse<T = DaDataAddressData> {
  suggestions: DaDataSuggestion<T>[];
}

export async function fetchAddressSuggestions(
  query: string,
  count = 5
): Promise<DaDataSuggestion<DaDataAddressData>[]> {
  if (!query) return [];

  const token = process.env.NEXT_PUBLIC_DADATA_API_KEY;
  if (!token) throw new Error("NEXT_PUBLIC_DADATA_API_KEY is not set");

  const data = await apiFetch<DaDataResponse>(
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ query, count }),
    }
  );

  return data.suggestions ?? [];
}

import { apiFetch, API_ROUTES } from "@/shared/api";
import { HistoryData } from "../model";

export const historiesApi = {
  fetchHistories: () =>
    apiFetch<HistoryData[]>(API_ROUTES.histories, { revalidate: 60 }),

  fetchHistoryById: (id?: string) => {
    if (!id) return null;

    return apiFetch<HistoryData>(API_ROUTES.categoryBySlug(id), {
      revalidate: 60,
    });
  },
};

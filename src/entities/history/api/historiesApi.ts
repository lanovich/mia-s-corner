import { apiFetch, API } from "@/shared/api";
import { HistoryData } from "../model";

export const historiesApi = {
  fetchHistories: () =>
    apiFetch<HistoryData[]>(API.histories.getHistories, { revalidate: 60 }),

  fetchHistoryById: (id?: string) => {
    if (!id) return null;

    return apiFetch<HistoryData>(API.histories.getHistoryById(id), {
      revalidate: 60,
    });
  },
};

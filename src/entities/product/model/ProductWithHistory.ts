export interface ProductWithHistory extends Product {
  history: HistoryData;
  details: Record<string, any> | null;
}
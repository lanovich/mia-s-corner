import { HistoryData } from "@X/entities/history/model";
import { Product } from "./Product";

export interface ProductWithHistory extends Product {
  history: HistoryData;
  details: Record<string, any> | null;
}
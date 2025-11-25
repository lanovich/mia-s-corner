export interface HistoryData {
  id: number;
  title: string;
  slug: string;
  description?: string;
  order: number;
  imageUrl?: string;
  episodes?: Episode[];
}

export interface Episode {
  id: number;
  historyId: number;
  title: string;
  number?: number;
  storyText?: string;
  imageUrl?: string;
}

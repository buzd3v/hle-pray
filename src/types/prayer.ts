export interface Prayer {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  flameColor: string;
}

export type Language = "vi" | "en" | "ko";

export const STATS = {
  total: 12405,
  today: 8230,
  week: 54112,
};

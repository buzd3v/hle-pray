export interface Prayer {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  flameColor: string;
}

export type Language = "vi" | "en" | "ko";

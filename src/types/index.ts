export interface FoodItem {
  id: number;
  name: string;
  portionSize?: string;
  servingSize?: string;
  brand?: string;
  upc?: string;
  score: number;
  warnings: string[];
}

export interface BatchContainer {
  id: number;
  name: string;
  items: { name: string; portion: string; score: number }[];
  totalScore: number;
}

export type DetectedFood = FoodItem | BatchContainer;

export interface Meal {
  id: string;
  name: string;
  date: string; // ISO date string
  time: string; // display time like "8:30 AM"
  items: DetectedFood[];
  totalScore: number;
  method: 'photo' | 'batch' | 'barcode' | 'manual';
}

export interface UserProfile {
  name: string;
  email: string;
  condition: string;
  joinDate: string;
  allergies: string[];
  sensitivities: string[];
}

export interface DailyStats {
  date: string;
  totalScore: number;
  mealCount: number;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  condition?: string;
  joinDate: string;
  allergies: string[];
  sensitivities: string[];
}

export interface UserProfile extends User {
  totalMeals: number;
  streak: number;
  notificationsEnabled: boolean;
  remindersEnabled: boolean;
}

// Authentication types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  condition?: string;
}

// Meal types
export interface MealItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  score: number;
  category: 'positive' | 'neutral' | 'negative';
  nutrients?: NutrientInfo;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: MealItem[];
  totalScore: number;
  timestamp: string;
  photoUri?: string;
  notes?: string;
}

export interface NutrientInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sulforaphane?: number;
}

// Stats types
export interface DailyStats {
  date: string;
  totalScore: number;
  mealsLogged: number;
  energyLevel?: number;
}

export interface UserStats {
  todayScore: number;
  weekAverage: number;
  streak: number;
  energyLevel: number;
  weightChange: number;
  totalMeals: number;
}

// Insight types
export interface Insight {
  id: string;
  type: 'success' | 'tip' | 'warning';
  message: string;
  icon: string;
  timestamp: string;
}

// Food recognition types
export interface FoodRecognitionResult {
  name: string;
  confidence: number;
  category: 'positive' | 'neutral' | 'negative';
  score: number;
  nutrients?: NutrientInfo;
}

export interface BarcodeResult {
  barcode: string;
  productName: string;
  brand?: string;
  score: number;
  category: 'positive' | 'neutral' | 'negative';
  nutrients?: NutrientInfo;
  ingredients?: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// App State
export interface AppState {
  user: UserProfile | null;
  meals: Meal[];
  stats: UserStats;
  insights: Insight[];
  dailyStats: DailyStats[];
  isLoading: boolean;
}

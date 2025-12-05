import {
  ApiResponse,
  FoodRecognitionResult,
  BarcodeResult,
  Meal,
  User,
  UserStats,
  Insight,
  NutrientInfo,
} from '../types';
import { AuthStorage } from './storage';

// API Configuration
// Replace with your actual backend URL when available
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.cbi-app.com';

// Food database for scoring (Dowd Protocol based)
const FOOD_SCORES: Record<string, { score: number; category: 'positive' | 'neutral' | 'negative' }> = {
  // Positive foods (sulforaphane-rich, anti-inflammatory)
  broccoli: { score: 5, category: 'positive' },
  'broccoli sprouts': { score: 8, category: 'positive' },
  kale: { score: 4, category: 'positive' },
  cauliflower: { score: 4, category: 'positive' },
  'brussels sprouts': { score: 5, category: 'positive' },
  cabbage: { score: 4, category: 'positive' },
  spinach: { score: 3, category: 'positive' },
  salmon: { score: 4, category: 'positive' },
  sardines: { score: 5, category: 'positive' },
  'olive oil': { score: 3, category: 'positive' },
  avocado: { score: 3, category: 'positive' },
  blueberries: { score: 3, category: 'positive' },
  turmeric: { score: 4, category: 'positive' },
  ginger: { score: 3, category: 'positive' },
  garlic: { score: 3, category: 'positive' },
  'green tea': { score: 2, category: 'positive' },
  walnuts: { score: 3, category: 'positive' },
  'chia seeds': { score: 3, category: 'positive' },
  flaxseed: { score: 3, category: 'positive' },
  eggs: { score: 2, category: 'positive' },
  chicken: { score: 2, category: 'positive' },
  beef: { score: 1, category: 'neutral' },

  // Neutral foods
  rice: { score: 0, category: 'neutral' },
  potato: { score: 0, category: 'neutral' },
  'sweet potato': { score: 1, category: 'neutral' },
  apple: { score: 1, category: 'neutral' },
  banana: { score: 1, category: 'neutral' },
  orange: { score: 1, category: 'neutral' },
  carrot: { score: 1, category: 'neutral' },

  // Negative foods (inflammatory, nightshades, processed)
  tomato: { score: -2, category: 'negative' },
  pepper: { score: -2, category: 'negative' },
  eggplant: { score: -2, category: 'negative' },
  'white bread': { score: -2, category: 'negative' },
  pasta: { score: -1, category: 'negative' },
  sugar: { score: -3, category: 'negative' },
  soda: { score: -4, category: 'negative' },
  candy: { score: -3, category: 'negative' },
  'processed meat': { score: -3, category: 'negative' },
  'fried food': { score: -3, category: 'negative' },
  alcohol: { score: -3, category: 'negative' },
  'vegetable oil': { score: -2, category: 'negative' },
};

// Helper to create headers with auth token
async function getHeaders(): Promise<HeadersInit> {
  const token = await AuthStorage.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Generic API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error ${response.status}`,
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    // Return mock data for development
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Food Recognition Service
export const FoodRecognitionAPI = {
  // Analyze food from photo
  async analyzePhoto(photoUri: string): Promise<ApiResponse<FoodRecognitionResult[]>> {
    // In production, this would send the image to an ML backend
    // For now, return simulated results
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulated food recognition results
      const mockResults: FoodRecognitionResult[] = [
        {
          name: 'Broccoli',
          confidence: 0.92,
          score: 5,
          category: 'positive',
          nutrients: {
            calories: 55,
            protein: 3.7,
            carbs: 11.2,
            fat: 0.6,
            fiber: 5.1,
            sulforaphane: 45,
          },
        },
        {
          name: 'Grilled Chicken',
          confidence: 0.88,
          score: 2,
          category: 'positive',
          nutrients: {
            calories: 165,
            protein: 31,
            carbs: 0,
            fat: 3.6,
            fiber: 0,
          },
        },
        {
          name: 'Brown Rice',
          confidence: 0.75,
          score: 0,
          category: 'neutral',
          nutrients: {
            calories: 216,
            protein: 5,
            carbs: 45,
            fat: 1.8,
            fiber: 3.5,
          },
        },
      ];

      return { success: true, data: mockResults };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to analyze photo',
      };
    }
  },

  // Look up food by barcode
  async lookupBarcode(barcode: string): Promise<ApiResponse<BarcodeResult>> {
    // In production, this would query a food database API
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulated barcode lookup
      const mockResult: BarcodeResult = {
        barcode,
        productName: 'Organic Broccoli Sprouts',
        brand: 'Green Valley',
        score: 8,
        category: 'positive',
        nutrients: {
          calories: 35,
          protein: 4,
          carbs: 5,
          fat: 0.5,
          fiber: 4,
          sulforaphane: 100,
        },
        ingredients: ['Organic broccoli sprouts'],
      };

      return { success: true, data: mockResult };
    } catch (error) {
      return {
        success: false,
        error: 'Barcode not found',
      };
    }
  },

  // Search food database
  async searchFood(query: string): Promise<ApiResponse<FoodRecognitionResult[]>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const lowerQuery = query.toLowerCase();
      const results: FoodRecognitionResult[] = [];

      // Search through food scores
      for (const [food, data] of Object.entries(FOOD_SCORES)) {
        if (food.includes(lowerQuery)) {
          results.push({
            name: food.charAt(0).toUpperCase() + food.slice(1),
            confidence: 1,
            score: data.score,
            category: data.category,
          });
        }
      }

      // If no matches, add generic entry
      if (results.length === 0) {
        results.push({
          name: query.charAt(0).toUpperCase() + query.slice(1),
          confidence: 0.5,
          score: 0,
          category: 'neutral',
        });
      }

      return { success: true, data: results };
    } catch (error) {
      return {
        success: false,
        error: 'Search failed',
      };
    }
  },

  // Get food score
  getScore(foodName: string): { score: number; category: 'positive' | 'neutral' | 'negative' } {
    const lowerName = foodName.toLowerCase();
    for (const [food, data] of Object.entries(FOOD_SCORES)) {
      if (lowerName.includes(food) || food.includes(lowerName)) {
        return data;
      }
    }
    return { score: 0, category: 'neutral' };
  },
};

// Meals API
export const MealsAPI = {
  async syncMeals(meals: Meal[]): Promise<ApiResponse<Meal[]>> {
    return apiRequest<Meal[]>('/meals/sync', {
      method: 'POST',
      body: JSON.stringify({ meals }),
    });
  },

  async getMeals(startDate?: string, endDate?: string): Promise<ApiResponse<Meal[]>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiRequest<Meal[]>(`/meals?${params.toString()}`);
  },
};

// Stats API
export const StatsAPI = {
  async getStats(): Promise<ApiResponse<UserStats>> {
    // Return mock stats for offline use
    const mockStats: UserStats = {
      todayScore: 14,
      weekAverage: 11,
      streak: 7,
      energyLevel: 8,
      weightChange: -2.5,
      totalMeals: 45,
    };
    return { success: true, data: mockStats };
  },

  async getInsights(): Promise<ApiResponse<Insight[]>> {
    const mockInsights: Insight[] = [
      {
        id: '1',
        type: 'success',
        message: 'Your energy levels are up 60% this week!',
        icon: 'flash',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'tip',
        message: 'Add more sulforaphane - only 1 cruciferous serving yesterday',
        icon: 'bulb',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'warning',
        message: 'Detected nightshades in 2 meals - may trigger symptoms',
        icon: 'warning',
        timestamp: new Date().toISOString(),
      },
    ];
    return { success: true, data: mockInsights };
  },

  // Calculate score for a meal
  calculateMealScore(items: { name: string; quantity: number }[]): number {
    let totalScore = 0;
    for (const item of items) {
      const { score } = FoodRecognitionAPI.getScore(item.name);
      totalScore += score * item.quantity;
    }
    return totalScore;
  },
};

// User API
export const UserAPI = {
  async getProfile(): Promise<ApiResponse<User>> {
    return apiRequest<User>('/user/profile');
  },

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    return apiRequest<User>('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },
};

export default {
  FoodRecognitionAPI,
  MealsAPI,
  StatsAPI,
  UserAPI,
};

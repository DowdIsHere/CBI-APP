import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MealStorage, StatsStorage, InsightStorage } from '../services/storage';
import { FoodRecognitionAPI, StatsAPI } from '../services/api';
import { Meal, MealItem, UserStats, Insight, DailyStats, FoodRecognitionResult } from '../types';

interface AppContextType {
  // Meals
  meals: Meal[];
  todayMeals: Meal[];
  addMeal: (meal: Omit<Meal, 'id' | 'timestamp'>) => Promise<Meal>;
  updateMeal: (mealId: string, updates: Partial<Meal>) => Promise<void>;
  deleteMeal: (mealId: string) => Promise<void>;
  getMealsByDate: (date: string) => Promise<Meal[]>;

  // Stats
  stats: UserStats;
  dailyStats: DailyStats[];
  refreshStats: () => Promise<void>;

  // Insights
  insights: Insight[];
  refreshInsights: () => Promise<void>;

  // Food Recognition
  analyzePhoto: (photoUri: string) => Promise<FoodRecognitionResult[]>;
  lookupBarcode: (barcode: string) => Promise<FoodRecognitionResult | null>;
  searchFood: (query: string) => Promise<FoodRecognitionResult[]>;

  // Loading state
  isLoading: boolean;

  // Refresh all data
  refreshAll: () => Promise<void>;
}

const defaultStats: UserStats = {
  todayScore: 0,
  weekAverage: 0,
  streak: 0,
  energyLevel: 5,
  weightChange: 0,
  totalMeals: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

// Helper to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper to get today's date string
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function AppProvider({ children }: AppProviderProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadMeals(),
        loadStats(),
        loadInsights(),
      ]);
    } catch (error) {
      console.error('Error loading app data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMeals = async () => {
    const savedMeals = await MealStorage.getAll();
    setMeals(savedMeals);
  };

  const loadStats = async () => {
    // Try to get from storage first
    const savedStats = await StatsStorage.getUserStats();
    if (savedStats) {
      setStats(savedStats);
    } else {
      // Fetch from API or calculate
      const response = await StatsAPI.getStats();
      if (response.success && response.data) {
        setStats(response.data);
        await StatsStorage.saveUserStats(response.data);
      }
    }

    // Load daily stats
    const savedDailyStats = await StatsStorage.getDailyStats();
    setDailyStats(savedDailyStats);
  };

  const loadInsights = async () => {
    const savedInsights = await InsightStorage.getAll();
    if (savedInsights.length > 0) {
      setInsights(savedInsights);
    } else {
      // Fetch from API
      const response = await StatsAPI.getInsights();
      if (response.success && response.data) {
        setInsights(response.data);
        await InsightStorage.saveAll(response.data);
      }
    }
  };

  // Calculate today's meals
  const todayMeals = meals.filter((m) => m.timestamp.startsWith(getTodayDate()));

  // Add a new meal
  const addMeal = async (mealData: Omit<Meal, 'id' | 'timestamp'>): Promise<Meal> => {
    const newMeal: Meal = {
      ...mealData,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };

    await MealStorage.add(newMeal);
    setMeals((prev) => [...prev, newMeal]);

    // Update stats
    await updateStatsAfterMeal(newMeal);

    return newMeal;
  };

  // Update stats after adding a meal
  const updateStatsAfterMeal = async (meal: Meal) => {
    const today = getTodayDate();

    // Update daily stats
    const currentDailyStats = dailyStats.find((s) => s.date === today);
    const newDailyStats: DailyStats = {
      date: today,
      totalScore: (currentDailyStats?.totalScore || 0) + meal.totalScore,
      mealsLogged: (currentDailyStats?.mealsLogged || 0) + 1,
    };
    await StatsStorage.addOrUpdateDailyStats(newDailyStats);

    // Update user stats
    const newStats: UserStats = {
      ...stats,
      todayScore: stats.todayScore + meal.totalScore,
      totalMeals: stats.totalMeals + 1,
    };
    setStats(newStats);
    await StatsStorage.saveUserStats(newStats);

    // Reload daily stats
    const updatedDailyStats = await StatsStorage.getDailyStats();
    setDailyStats(updatedDailyStats);
  };

  // Update existing meal
  const updateMeal = async (mealId: string, updates: Partial<Meal>) => {
    await MealStorage.update(mealId, updates);
    setMeals((prev) =>
      prev.map((m) => (m.id === mealId ? { ...m, ...updates } : m))
    );
  };

  // Delete meal
  const deleteMeal = async (mealId: string) => {
    const meal = meals.find((m) => m.id === mealId);
    if (meal) {
      await MealStorage.delete(mealId);
      setMeals((prev) => prev.filter((m) => m.id !== mealId));

      // Update stats (subtract score)
      const newStats: UserStats = {
        ...stats,
        todayScore: meal.timestamp.startsWith(getTodayDate())
          ? stats.todayScore - meal.totalScore
          : stats.todayScore,
        totalMeals: stats.totalMeals - 1,
      };
      setStats(newStats);
      await StatsStorage.saveUserStats(newStats);
    }
  };

  // Get meals by date
  const getMealsByDate = async (date: string): Promise<Meal[]> => {
    return meals.filter((m) => m.timestamp.startsWith(date));
  };

  // Refresh stats
  const refreshStats = async () => {
    await loadStats();
  };

  // Refresh insights
  const refreshInsights = async () => {
    const response = await StatsAPI.getInsights();
    if (response.success && response.data) {
      setInsights(response.data);
      await InsightStorage.saveAll(response.data);
    }
  };

  // Analyze photo for food recognition
  const analyzePhoto = async (photoUri: string): Promise<FoodRecognitionResult[]> => {
    const response = await FoodRecognitionAPI.analyzePhoto(photoUri);
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  };

  // Lookup barcode
  const lookupBarcode = async (barcode: string): Promise<FoodRecognitionResult | null> => {
    const response = await FoodRecognitionAPI.lookupBarcode(barcode);
    if (response.success && response.data) {
      return {
        name: response.data.productName,
        confidence: 1,
        score: response.data.score,
        category: response.data.category,
        nutrients: response.data.nutrients,
      };
    }
    return null;
  };

  // Search food
  const searchFood = async (query: string): Promise<FoodRecognitionResult[]> => {
    const response = await FoodRecognitionAPI.searchFood(query);
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  };

  // Refresh all data
  const refreshAll = async () => {
    await loadAllData();
  };

  const value: AppContextType = {
    meals,
    todayMeals,
    addMeal,
    updateMeal,
    deleteMeal,
    getMealsByDate,
    stats,
    dailyStats,
    refreshStats,
    insights,
    refreshInsights,
    analyzePhoto,
    lookupBarcode,
    searchFood,
    isLoading,
    refreshAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;

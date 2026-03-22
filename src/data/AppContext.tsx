import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, Meal, FoodItem, Trigger, Insight, UserProfile, Settings } from './types';
import { demoData, initialData } from './initialData';

const STORAGE_KEY = '@cbi_app_data';
const ONBOARDING_KEY = '@cbi_onboarding_complete';
const USE_DEMO_DATA = false; // Set to false for new user experience

interface AppContextType {
  data: AppData;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;

  // Onboarding
  completeOnboarding: () => Promise<void>;

  // Meal actions
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  deleteMeal: (mealId: string) => void;

  // Trigger actions
  addTrigger: (trigger: Omit<Trigger, 'id'>) => void;
  removeTrigger: (triggerId: string) => void;

  // Profile actions
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Settings actions
  updateSettings: (settings: Partial<Settings>) => void;

  // Learning actions
  completeLesson: (lessonId: string, moduleId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;

  // Stats helpers
  getTodaysMeals: () => Meal[];
  getWeeklyStats: () => { day: string; score: number }[];

  // Reset
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(USE_DEMO_DATA ? demoData : initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(USE_DEMO_DATA);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
    loadOnboardingStatus();
  }, []);

  // Save data to storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [data, isLoading]);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      } else if (USE_DEMO_DATA) {
        setData(demoData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (completed === 'true') {
        setHasCompletedOnboarding(true);
      }
    } catch (error) {
      console.error('Failed to load onboarding status:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  // Generate unique ID
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Get today's date string
  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Add a meal
  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...meal,
      id: generateId(),
    };

    setData(prev => {
      const newStats = { ...prev.stats };
      newStats.todayScore += meal.totalScore;
      newStats.totalMeals += 1;
      if (meal.totalScore > newStats.bestDay) {
        newStats.bestDay = meal.totalScore;
      }

      // Check for First Meal achievement
      const achievements = prev.achievements.map(a => {
        if (a.id === '1' && !a.unlocked) {
          return { ...a, unlocked: true, unlockedDate: getTodayString() };
        }
        return a;
      });

      return {
        ...prev,
        meals: [...prev.meals, newMeal],
        stats: newStats,
        achievements,
      };
    });
  };

  // Delete a meal
  const deleteMeal = (mealId: string) => {
    setData(prev => {
      const meal = prev.meals.find(m => m.id === mealId);
      if (!meal) return prev;

      const newStats = { ...prev.stats };
      if (meal.date === getTodayString()) {
        newStats.todayScore -= meal.totalScore;
      }
      newStats.totalMeals -= 1;

      return {
        ...prev,
        meals: prev.meals.filter(m => m.id !== mealId),
        stats: newStats,
      };
    });
  };

  // Add a trigger
  const addTrigger = (trigger: Omit<Trigger, 'id'>) => {
    const newTrigger: Trigger = {
      ...trigger,
      id: generateId(),
    };

    setData(prev => ({
      ...prev,
      triggers: [...prev.triggers, newTrigger],
    }));
  };

  // Remove a trigger
  const removeTrigger = (triggerId: string) => {
    setData(prev => ({
      ...prev,
      triggers: prev.triggers.filter(t => t.id !== triggerId),
    }));
  };

  // Update profile
  const updateProfile = (profile: Partial<UserProfile>) => {
    setData(prev => ({
      ...prev,
      user: { ...prev.user, ...profile },
    }));
  };

  // Update settings
  const updateSettings = (settings: Partial<Settings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  };

  // Check if a lesson is completed
  const isLessonCompleted = (lessonId: string): boolean => {
    return data.completedLessonIds.includes(lessonId);
  };

  // Complete a lesson by ID
  const completeLesson = (lessonId: string, moduleId: string) => {
    setData(prev => {
      // Don't add if already completed
      if (prev.completedLessonIds.includes(lessonId)) {
        return prev;
      }

      const newCompletedIds = [...prev.completedLessonIds, lessonId];

      // Update module completed count
      const modules = prev.learningModules.map(m => {
        if (m.id === moduleId) {
          return { ...m, completedLessons: m.completedLessons + 1 };
        }
        return m;
      });

      // Calculate total progress
      const totalLessons = prev.learningModules.reduce((sum, m) => sum + m.lessons, 0);
      const completedCount = newCompletedIds.length;
      const overallProgress = Math.round((completedCount / totalLessons) * 100);

      // Check for Learning Started achievement
      const achievements = prev.achievements.map(a => {
        if (a.id === '6' && !a.unlocked) {
          return { ...a, unlocked: true, unlockedDate: getTodayString() };
        }
        return a;
      });

      return {
        ...prev,
        completedLessonIds: newCompletedIds,
        learningModules: modules,
        achievements,
        currentLesson: {
          ...prev.currentLesson,
          progress: overallProgress,
        },
      };
    });
  };

  // Get today's meals
  const getTodaysMeals = (): Meal[] => {
    const today = getTodayString();
    return data.meals.filter(m => m.date === today);
  };

  // Get weekly stats for chart
  const getWeeklyStats = (): { day: string; score: number }[] => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result: { day: string; score: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = days[date.getDay()];

      const dayStats = data.dailyStats.find(s => s.date === dateStr);
      const dayMeals = data.meals.filter(m => m.date === dateStr);
      const score = dayStats?.totalScore || dayMeals.reduce((sum, m) => sum + m.totalScore, 0);

      result.push({ day: dayName, score });
    }

    return result;
  };

  // Reset all data
  const resetData = () => {
    setData(initialData);
  };

  return (
    <AppContext.Provider
      value={{
        data,
        isLoading,
        hasCompletedOnboarding,
        completeOnboarding,
        addMeal,
        deleteMeal,
        addTrigger,
        removeTrigger,
        updateProfile,
        updateSettings,
        completeLesson,
        isLessonCompleted,
        getTodaysMeals,
        getWeeklyStats,
        resetData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppProvider');
  }
  return context;
}

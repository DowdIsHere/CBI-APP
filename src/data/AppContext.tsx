import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppData,
  Meal,
  Trigger,
  UserProfile,
  Settings,
  SymptomEntry,
  SymptomType,
  FoodSymptomCorrelation,
} from './types';
import { demoData, initialData } from './initialData';
import { useAuth } from '../contexts/AuthContext';
import { syncDataToCloud, fetchDataFromCloud } from '../services/api';
import { syncNotifications } from '../services/notifications';
import { logger } from '../services/logger';

const STORAGE_KEY = '@cbi_app_data';
const ONBOARDING_KEY = '@cbi_onboarding_complete';
const USE_DEMO_DATA = false;
const SYNC_DEBOUNCE_MS = 2000;

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

  // Symptom actions
  addSymptom: (symptom: Omit<SymptomEntry, 'id'>) => void;
  deleteSymptom: (symptomId: string) => void;
  getRecentSymptoms: (days?: number) => SymptomEntry[];
  getFoodSymptomCorrelations: (limit?: number) => FoodSymptomCorrelation[];

  // Learning actions
  completeLesson: (lessonId: string, moduleId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;

  // Stats helpers
  getTodaysMeals: () => Meal[];
  getWeeklyStats: () => { day: string; score: number }[];

  // Sync
  syncStatus: SyncStatus;
  syncNow: () => Promise<void>;

  // Reset
  resetData: () => void;
}

type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
const getTodayString = () => new Date().toISOString().split('T')[0];
const stamp = (data: AppData): AppData => ({ ...data, updatedAt: new Date().toISOString() });

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(USE_DEMO_DATA ? demoData : initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(USE_DEMO_DATA);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  const { isAuthenticated, user } = useAuth();
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPushed = useRef<string | null>(null);
  const initialPullDone = useRef(false);

  // Load data from local storage on mount.
  useEffect(() => {
    loadData();
    loadOnboardingStatus();
  }, []);

  // Persist locally on every change.
  useEffect(() => {
    if (!isLoading) saveData();
  }, [data, isLoading]);

  // Pull from cloud when the user signs in.
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      initialPullDone.current = false;
      return;
    }
    if (initialPullDone.current) return;
    initialPullDone.current = true;
    void pullFromCloud();
  }, [isAuthenticated, isLoading]);

  // Debounced push on every meaningful local change once we're authed.
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    if (data.updatedAt === lastPushed.current) return;

    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      void pushToCloud();
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, [data.updatedAt, isAuthenticated, isLoading]);

  // Reconcile scheduled notifications whenever inputs change.
  useEffect(() => {
    if (isLoading) return;
    const today = getTodayString();
    const hasLoggedToday = data.meals.some((m) => m.date === today);
    void syncNotifications({
      settings: data.settings,
      hasLoggedToday,
      streak: data.stats.streak,
    });
  }, [
    isLoading,
    data.settings.notificationsEnabled,
    data.settings.remindersEnabled,
    data.settings.fastingSchedule,
    data.meals.length,
    data.stats.streak,
  ]);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AppData>;
        setData({
          ...initialData,
          ...parsed,
          symptoms: parsed.symptoms ?? [],
          updatedAt: parsed.updatedAt ?? new Date(0).toISOString(),
        } as AppData);
      } else if (USE_DEMO_DATA) {
        setData(demoData);
      }
    } catch (error) {
      logger.captureException(error, { source: 'AppContext.loadData' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (completed === 'true') setHasCompletedOnboarding(true);
    } catch (error) {
      logger.captureException(error, { source: 'AppContext.loadOnboarding' });
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      logger.captureException(error, { source: 'AppContext.completeOnboarding' });
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      logger.captureException(error, { source: 'AppContext.saveData' });
    }
  };

  const pullFromCloud = async () => {
    setSyncStatus('syncing');
    try {
      const result = await fetchDataFromCloud();
      if (!result.success) {
        setSyncStatus(result.error?.includes('offline') ? 'offline' : 'error');
        return;
      }
      const cloud = result.data;
      if (!cloud) {
        // First sign-in for this user — push the local copy up.
        setSyncStatus('idle');
        await pushToCloud();
        return;
      }

      setData((prev) => {
        const localTs = Date.parse(prev.updatedAt || '0');
        const cloudTs = Date.parse(cloud.updatedAt || '0');
        if (cloudTs > localTs) {
          lastPushed.current = cloud.updatedAt;
          return { ...initialData, ...cloud, symptoms: cloud.symptoms ?? [] };
        }
        return prev; // local is fresher; the push effect will send it up
      });
      setSyncStatus('idle');
    } catch (error) {
      logger.captureException(error, { source: 'AppContext.pullFromCloud' });
      setSyncStatus('error');
    }
  };

  const pushToCloud = async () => {
    if (!isAuthenticated) return;
    setSyncStatus('syncing');
    try {
      const snapshot = data;
      const result = await syncDataToCloud(snapshot);
      if (result.success) {
        lastPushed.current = snapshot.updatedAt;
        setSyncStatus('idle');
      } else {
        setSyncStatus(result.error?.includes('offline') ? 'offline' : 'error');
      }
    } catch (error) {
      logger.captureException(error, { source: 'AppContext.pushToCloud' });
      setSyncStatus('error');
    }
  };

  const syncNow = async () => {
    await pushToCloud();
  };

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal: Meal = { ...meal, id: generateId() };

    setData((prev) => {
      const newStats = { ...prev.stats };
      newStats.todayScore += meal.totalScore;
      newStats.totalMeals += 1;
      if (meal.totalScore > newStats.bestDay) newStats.bestDay = meal.totalScore;

      const achievements = prev.achievements.map((a) =>
        a.id === '1' && !a.unlocked
          ? { ...a, unlocked: true, unlockedDate: getTodayString() }
          : a,
      );

      return stamp({
        ...prev,
        meals: [...prev.meals, newMeal],
        stats: newStats,
        achievements,
      });
    });
  };

  const deleteMeal = (mealId: string) => {
    setData((prev) => {
      const meal = prev.meals.find((m) => m.id === mealId);
      if (!meal) return prev;

      const newStats = { ...prev.stats };
      if (meal.date === getTodayString()) newStats.todayScore -= meal.totalScore;
      newStats.totalMeals -= 1;

      return stamp({
        ...prev,
        meals: prev.meals.filter((m) => m.id !== mealId),
        stats: newStats,
      });
    });
  };

  const addTrigger = (trigger: Omit<Trigger, 'id'>) => {
    const newTrigger: Trigger = { ...trigger, id: generateId() };
    setData((prev) => stamp({ ...prev, triggers: [...prev.triggers, newTrigger] }));
  };

  const removeTrigger = (triggerId: string) => {
    setData((prev) => stamp({ ...prev, triggers: prev.triggers.filter((t) => t.id !== triggerId) }));
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setData((prev) => stamp({ ...prev, user: { ...prev.user, ...profile } }));
  };

  const updateSettings = (settings: Partial<Settings>) => {
    setData((prev) => stamp({ ...prev, settings: { ...prev.settings, ...settings } }));
  };

  const addSymptom = (symptom: Omit<SymptomEntry, 'id'>) => {
    const entry: SymptomEntry = { ...symptom, id: generateId() };
    setData((prev) => stamp({ ...prev, symptoms: [...prev.symptoms, entry] }));
  };

  const deleteSymptom = (symptomId: string) => {
    setData((prev) =>
      stamp({ ...prev, symptoms: prev.symptoms.filter((s) => s.id !== symptomId) }),
    );
  };

  const getRecentSymptoms = (days = 7): SymptomEntry[] => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return data.symptoms
      .filter((s) => Date.parse(s.date) >= cutoff.getTime())
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.time < b.time ? 1 : -1));
  };

  // Naive correlation: for each (food name, symptom type) pair, count cases where
  // a symptom of severity >= 3 was logged on the same day or the day after a meal
  // containing that food. Cheap and good enough as a v1 insight.
  const getFoodSymptomCorrelations = (limit = 5): FoodSymptomCorrelation[] => {
    if (data.symptoms.length === 0 || data.meals.length === 0) return [];

    // Bad symptoms: pain/bloating/brain_fog/stool issues high; energy/mood/sleep low.
    const isAdverse = (s: SymptomEntry) => {
      const negativeIfHigh: SymptomType[] = ['pain', 'bloating', 'brain_fog', 'stool'];
      if (negativeIfHigh.includes(s.type)) return s.severity >= 3;
      // For energy/mood/sleep, low values are adverse.
      return s.severity <= 2;
    };

    const symptomsByDate = new Map<string, SymptomEntry[]>();
    for (const s of data.symptoms.filter(isAdverse)) {
      const list = symptomsByDate.get(s.date) ?? [];
      list.push(s);
      symptomsByDate.set(s.date, list);
    }

    const counts = new Map<string, FoodSymptomCorrelation>();
    for (const meal of data.meals) {
      const next = new Date(meal.date);
      next.setDate(next.getDate() + 1);
      const nextStr = next.toISOString().split('T')[0];
      const sameDay = symptomsByDate.get(meal.date) ?? [];
      const dayAfter = symptomsByDate.get(nextStr) ?? [];
      const candidates = [...sameDay, ...dayAfter];
      if (candidates.length === 0) continue;

      for (const item of meal.items) {
        const food = item.name.trim();
        if (!food) continue;
        for (const s of candidates) {
          const key = `${food.toLowerCase()}|${s.type}`;
          const existing = counts.get(key);
          if (existing) {
            existing.occurrences += 1;
          } else {
            counts.set(key, { food, symptom: s.type, occurrences: 1 });
          }
        }
      }
    }

    return Array.from(counts.values())
      .filter((c) => c.occurrences >= 2)
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, limit);
  };

  const isLessonCompleted = (lessonId: string): boolean =>
    data.completedLessonIds.includes(lessonId);

  const completeLesson = (lessonId: string, moduleId: string) => {
    setData((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) return prev;
      const newCompletedIds = [...prev.completedLessonIds, lessonId];

      const modules = prev.learningModules.map((m) =>
        m.id === moduleId ? { ...m, completedLessons: m.completedLessons + 1 } : m,
      );

      const totalLessons = prev.learningModules.reduce((sum, m) => sum + m.lessons, 0);
      const overallProgress = Math.round((newCompletedIds.length / totalLessons) * 100);

      const achievements = prev.achievements.map((a) =>
        a.id === '6' && !a.unlocked
          ? { ...a, unlocked: true, unlockedDate: getTodayString() }
          : a,
      );

      return stamp({
        ...prev,
        completedLessonIds: newCompletedIds,
        learningModules: modules,
        achievements,
        currentLesson: { ...prev.currentLesson, progress: overallProgress },
      });
    });
  };

  const getTodaysMeals = (): Meal[] => {
    const today = getTodayString();
    return data.meals.filter((m) => m.date === today);
  };

  const getWeeklyStats = (): { day: string; score: number }[] => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result: { day: string; score: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = days[date.getDay()];
      const dayStats = data.dailyStats.find((s) => s.date === dateStr);
      const dayMeals = data.meals.filter((m) => m.date === dateStr);
      const score = dayStats?.totalScore || dayMeals.reduce((sum, m) => sum + m.totalScore, 0);
      result.push({ day: dayName, score });
    }

    return result;
  };

  const resetData = () => setData(stamp(initialData));

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
        addSymptom,
        deleteSymptom,
        getRecentSymptoms,
        getFoodSymptomCorrelations,
        completeLesson,
        isLessonCompleted,
        getTodaysMeals,
        getWeeklyStats,
        syncStatus,
        syncNow,
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

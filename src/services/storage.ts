import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { User, Meal, DailyStats, UserStats, Insight, UserProfile } from '../types';

// Storage keys
const STORAGE_KEYS = {
  USER_PROFILE: '@cbi_user_profile',
  MEALS: '@cbi_meals',
  DAILY_STATS: '@cbi_daily_stats',
  USER_STATS: '@cbi_user_stats',
  INSIGHTS: '@cbi_insights',
  SETTINGS: '@cbi_settings',
  ONBOARDING_COMPLETE: '@cbi_onboarding_complete',
};

const SECURE_KEYS = {
  AUTH_TOKEN: 'cbi_auth_token',
  REFRESH_TOKEN: 'cbi_refresh_token',
};

// Generic storage helpers
async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    throw error;
  }
}

async function getItem<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return null;
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    throw error;
  }
}

// Secure storage helpers (for sensitive data like tokens)
async function setSecureItem(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error saving secure ${key}:`, error);
    // Fallback to AsyncStorage if SecureStore fails (e.g., on web)
    await AsyncStorage.setItem(`secure_${key}`, value);
  }
}

async function getSecureItem(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error reading secure ${key}:`, error);
    // Fallback to AsyncStorage
    return await AsyncStorage.getItem(`secure_${key}`);
  }
}

async function removeSecureItem(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error removing secure ${key}:`, error);
    // Fallback
    await AsyncStorage.removeItem(`secure_${key}`);
  }
}

// User Profile
export const UserStorage = {
  async save(profile: UserProfile): Promise<void> {
    await setItem(STORAGE_KEYS.USER_PROFILE, profile);
  },

  async get(): Promise<UserProfile | null> {
    return getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
  },

  async update(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const current = await this.get();
    if (current) {
      const updated = { ...current, ...updates };
      await this.save(updated);
      return updated;
    }
    return null;
  },

  async clear(): Promise<void> {
    await removeItem(STORAGE_KEYS.USER_PROFILE);
  },
};

// Meals
export const MealStorage = {
  async saveAll(meals: Meal[]): Promise<void> {
    await setItem(STORAGE_KEYS.MEALS, meals);
  },

  async getAll(): Promise<Meal[]> {
    const meals = await getItem<Meal[]>(STORAGE_KEYS.MEALS);
    return meals || [];
  },

  async add(meal: Meal): Promise<void> {
    const meals = await this.getAll();
    meals.push(meal);
    await this.saveAll(meals);
  },

  async update(mealId: string, updates: Partial<Meal>): Promise<void> {
    const meals = await this.getAll();
    const index = meals.findIndex((m) => m.id === mealId);
    if (index !== -1) {
      meals[index] = { ...meals[index], ...updates };
      await this.saveAll(meals);
    }
  },

  async delete(mealId: string): Promise<void> {
    const meals = await this.getAll();
    const filtered = meals.filter((m) => m.id !== mealId);
    await this.saveAll(filtered);
  },

  async getByDate(date: string): Promise<Meal[]> {
    const meals = await this.getAll();
    return meals.filter((m) => m.timestamp.startsWith(date));
  },

  async getRecent(limit: number = 10): Promise<Meal[]> {
    const meals = await this.getAll();
    return meals
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },

  async clear(): Promise<void> {
    await removeItem(STORAGE_KEYS.MEALS);
  },
};

// Daily Stats
export const StatsStorage = {
  async saveDailyStats(stats: DailyStats[]): Promise<void> {
    await setItem(STORAGE_KEYS.DAILY_STATS, stats);
  },

  async getDailyStats(): Promise<DailyStats[]> {
    const stats = await getItem<DailyStats[]>(STORAGE_KEYS.DAILY_STATS);
    return stats || [];
  },

  async addOrUpdateDailyStats(stat: DailyStats): Promise<void> {
    const stats = await this.getDailyStats();
    const index = stats.findIndex((s) => s.date === stat.date);
    if (index !== -1) {
      stats[index] = stat;
    } else {
      stats.push(stat);
    }
    await this.saveDailyStats(stats);
  },

  async saveUserStats(stats: UserStats): Promise<void> {
    await setItem(STORAGE_KEYS.USER_STATS, stats);
  },

  async getUserStats(): Promise<UserStats | null> {
    return getItem<UserStats>(STORAGE_KEYS.USER_STATS);
  },

  async clear(): Promise<void> {
    await removeItem(STORAGE_KEYS.DAILY_STATS);
    await removeItem(STORAGE_KEYS.USER_STATS);
  },
};

// Insights
export const InsightStorage = {
  async saveAll(insights: Insight[]): Promise<void> {
    await setItem(STORAGE_KEYS.INSIGHTS, insights);
  },

  async getAll(): Promise<Insight[]> {
    const insights = await getItem<Insight[]>(STORAGE_KEYS.INSIGHTS);
    return insights || [];
  },

  async add(insight: Insight): Promise<void> {
    const insights = await this.getAll();
    insights.unshift(insight); // Add to beginning
    // Keep only last 50 insights
    await this.saveAll(insights.slice(0, 50));
  },

  async clear(): Promise<void> {
    await removeItem(STORAGE_KEYS.INSIGHTS);
  },
};

// Auth Tokens
export const AuthStorage = {
  async saveToken(token: string): Promise<void> {
    await setSecureItem(SECURE_KEYS.AUTH_TOKEN, token);
  },

  async getToken(): Promise<string | null> {
    return getSecureItem(SECURE_KEYS.AUTH_TOKEN);
  },

  async saveRefreshToken(token: string): Promise<void> {
    await setSecureItem(SECURE_KEYS.REFRESH_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return getSecureItem(SECURE_KEYS.REFRESH_TOKEN);
  },

  async clearTokens(): Promise<void> {
    await removeSecureItem(SECURE_KEYS.AUTH_TOKEN);
    await removeSecureItem(SECURE_KEYS.REFRESH_TOKEN);
  },
};

// Settings
export const SettingsStorage = {
  async save(settings: Record<string, any>): Promise<void> {
    await setItem(STORAGE_KEYS.SETTINGS, settings);
  },

  async get(): Promise<Record<string, any>> {
    const settings = await getItem<Record<string, any>>(STORAGE_KEYS.SETTINGS);
    return settings || {};
  },

  async update(key: string, value: any): Promise<void> {
    const settings = await this.get();
    settings[key] = value;
    await this.save(settings);
  },
};

// Onboarding
export const OnboardingStorage = {
  async setComplete(complete: boolean): Promise<void> {
    await setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, complete);
  },

  async isComplete(): Promise<boolean> {
    const complete = await getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return complete === true;
  },
};

// Clear all app data
export async function clearAllData(): Promise<void> {
  await UserStorage.clear();
  await MealStorage.clear();
  await StatsStorage.clear();
  await InsightStorage.clear();
  await AuthStorage.clearTokens();
  await removeItem(STORAGE_KEYS.SETTINGS);
  await removeItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
}

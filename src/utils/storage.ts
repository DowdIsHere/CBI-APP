import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal, UserProfile } from '../types';

const MEALS_KEY = 'cbi_meals';
const PROFILE_KEY = 'cbi_profile';
const STREAK_KEY = 'cbi_streak';

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  condition: '',
  joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  allergies: [],
  sensitivities: [],
};

export async function getMeals(): Promise<Meal[]> {
  const data = await AsyncStorage.getItem(MEALS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveMeal(meal: Meal): Promise<void> {
  const meals = await getMeals();
  meals.unshift(meal);
  await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

export async function deleteMeal(mealId: string): Promise<void> {
  const meals = await getMeals();
  const filtered = meals.filter((m) => m.id !== mealId);
  await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(filtered));
}

export async function getTodayMeals(): Promise<Meal[]> {
  const meals = await getMeals();
  const today = new Date().toISOString().split('T')[0];
  return meals.filter((m) => m.date === today);
}

export async function getWeekMeals(): Promise<Meal[]> {
  const meals = await getMeals();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return meals.filter((m) => new Date(m.date) >= weekAgo);
}

export async function getStreak(): Promise<number> {
  const meals = await getMeals();
  if (meals.length === 0) return 0;

  const dates = [...new Set(meals.map((m) => m.date))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export async function getProfile(): Promise<UserProfile> {
  const data = await AsyncStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : defaultProfile;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getTimeString(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDayScores(meals: Meal[]): { day: string; score: number; date: string }[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result: { day: string; score: number; date: string }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayMeals = meals.filter((m) => m.date === dateStr);
    const score = dayMeals.reduce((sum, m) => sum + m.totalScore, 0);
    result.push({ day: days[d.getDay()], score, date: dateStr });
  }

  return result;
}

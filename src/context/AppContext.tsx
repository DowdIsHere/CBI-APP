import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface FoodItem {
  id: number;
  name: string;
  portionSize?: string;
  servingSize?: string;
  brand?: string;
  upc?: string;
  score: number;
  warnings?: string[];
  items?: { name: string; portion: string; score: number }[];
  totalScore?: number;
}

export interface Meal {
  id: number;
  name: string;
  time: string;
  date: string;
  score: number;
  items: number;
  foods: FoodItem[];
}

export interface UserProfile {
  name: string;
  email: string;
  condition: string;
  joinDate: string;
  allergies: string[];
  sensitivities: string[];
}

export interface UserStats {
  todayScore: number;
  weekAverage: number;
  monthAverage: number;
  yearAverage: number;
  streak: number;
  totalMeals: number;
  energyLevel: number;
  weightChange: number;
  bestDay: number;
  energyImprovement: number;
}

export interface Settings {
  notificationsEnabled: boolean;
  remindersEnabled: boolean;
}

export interface WeeklyData {
  day: string;
  score: number;
  date: string;
}

export interface MonthlyData {
  week: string;
  score: number;
}

export interface YearlyData {
  month: string;
  score: number;
}

interface AppContextType {
  // State
  meals: Meal[];
  userProfile: UserProfile;
  userStats: UserStats;
  settings: Settings;
  weeklyData: WeeklyData[];
  monthlyData: MonthlyData[];
  yearlyData: YearlyData[];
  isLoading: boolean;

  // Actions
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addAllergy: (allergy: string) => void;
  removeAllergy: (allergy: string) => void;
  addSensitivity: (sensitivity: string) => void;
  removeSensitivity: (sensitivity: string) => void;
  getTodaysMeals: () => Meal[];
  refreshStats: () => void;
}

const defaultProfile: UserProfile = {
  name: 'John Doe',
  email: 'john@example.com',
  condition: 'Multiple Sclerosis',
  joinDate: 'Jan 2025',
  allergies: ['Shellfish', 'Tree Nuts'],
  sensitivities: ['Nightshades', 'Dairy', 'Gluten'],
};

const defaultSettings: Settings = {
  notificationsEnabled: true,
  remindersEnabled: true,
};

const getDefaultStats = (): UserStats => ({
  todayScore: 0,
  weekAverage: 0,
  monthAverage: 0,
  yearAverage: 0,
  streak: 0,
  totalMeals: 0,
  energyLevel: 5,
  weightChange: 0,
  bestDay: 0,
  energyImprovement: 0,
});

const generateWeeklyData = (meals: Meal[]): WeeklyData[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekData: WeeklyData[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayMeals = meals.filter(m => m.date === dateStr);
    const dayScore = dayMeals.reduce((sum, m) => sum + m.score, 0);

    weekData.push({
      day: days[date.getDay()],
      score: dayScore,
      date: dateStr,
    });
  }

  return weekData;
};

const generateMonthlyData = (meals: Meal[]): MonthlyData[] => {
  const today = new Date();
  const monthData: MonthlyData[] = [];

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() - (i * 7));

    const weekMeals = meals.filter(m => {
      const mealDate = new Date(m.date);
      return mealDate >= weekStart && mealDate <= weekEnd;
    });

    const weekScore = weekMeals.reduce((sum, m) => sum + m.score, 0);
    monthData.push({
      week: `Week ${4 - i}`,
      score: Math.round(weekScore / 7),
    });
  }

  return monthData;
};

const generateYearlyData = (meals: Meal[]): YearlyData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const yearData: YearlyData[] = [];

  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(today);
    monthDate.setMonth(monthDate.getMonth() - i);
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();

    const monthMeals = meals.filter(m => {
      const mealDate = new Date(m.date);
      return mealDate.getMonth() === month && mealDate.getFullYear() === year;
    });

    const monthScore = monthMeals.length > 0
      ? Math.round(monthMeals.reduce((sum, m) => sum + m.score, 0) / monthMeals.length)
      : 0;

    yearData.push({
      month: months[month],
      score: monthScore,
    });
  }

  return yearData;
};

const calculateStats = (meals: Meal[]): UserStats => {
  const today = new Date().toISOString().split('T')[0];
  const todaysMeals = meals.filter(m => m.date === today);
  const todayScore = todaysMeals.reduce((sum, m) => sum + m.score, 0);

  // Calculate weekly average
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekMeals = meals.filter(m => new Date(m.date) >= oneWeekAgo);
  const weekAverage = weekMeals.length > 0
    ? Math.round(weekMeals.reduce((sum, m) => sum + m.score, 0) / 7)
    : 0;

  // Calculate monthly average
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
  const monthMeals = meals.filter(m => new Date(m.date) >= oneMonthAgo);
  const monthAverage = monthMeals.length > 0
    ? Math.round(monthMeals.reduce((sum, m) => sum + m.score, 0) / 30)
    : 0;

  // Calculate yearly average
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const yearMeals = meals.filter(m => new Date(m.date) >= oneYearAgo);
  const yearAverage = yearMeals.length > 0
    ? Math.round(yearMeals.reduce((sum, m) => sum + m.score, 0) / 365)
    : 0;

  // Calculate streak
  let streak = 0;
  const checkDate = new Date();
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const dayMeals = meals.filter(m => m.date === dateStr);
    if (dayMeals.length > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate best day
  const dailyScores: { [key: string]: number } = {};
  meals.forEach(m => {
    if (!dailyScores[m.date]) dailyScores[m.date] = 0;
    dailyScores[m.date] += m.score;
  });
  const bestDay = Math.max(0, ...Object.values(dailyScores));

  return {
    todayScore,
    weekAverage,
    monthAverage,
    yearAverage,
    streak,
    totalMeals: meals.length,
    energyLevel: Math.min(10, Math.round(5 + (weekAverage / 4))),
    weightChange: -2.5, // This would come from user input in a real app
    bestDay,
    energyImprovement: Math.round((weekAverage / 15) * 100),
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [userStats, setUserStats] = useState<UserStats>(getDefaultStats());
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Recalculate stats when meals change
  useEffect(() => {
    const stats = calculateStats(meals);
    setUserStats(stats);
    setWeeklyData(generateWeeklyData(meals));
    setMonthlyData(generateMonthlyData(meals));
    setYearlyData(generateYearlyData(meals));
  }, [meals]);

  const loadData = async () => {
    try {
      const [mealsData, profileData, settingsData] = await Promise.all([
        AsyncStorage.getItem('meals'),
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem('settings'),
      ]);

      if (mealsData) {
        setMeals(JSON.parse(mealsData));
      } else {
        // Set default demo meals for new users
        const today = new Date().toISOString().split('T')[0];
        const defaultMeals: Meal[] = [
          {
            id: 1,
            name: 'Breakfast',
            time: '8:30 AM',
            date: today,
            score: 8,
            items: 3,
            foods: [
              { id: 1, name: 'Wild Salmon', portionSize: '4 oz', score: 3 },
              { id: 2, name: 'Avocado', portionSize: '1/2', score: 2 },
              { id: 3, name: 'Steamed Kale', portionSize: '1 cup', score: 3 },
            ],
          },
          {
            id: 2,
            name: 'Lunch',
            time: '12:45 PM',
            date: today,
            score: 12,
            items: 4,
            foods: [
              { id: 4, name: 'Grilled Chicken', portionSize: '6 oz', score: 2 },
              { id: 5, name: 'Broccoli', portionSize: '1.5 cups', score: 4 },
              { id: 6, name: 'Sweet Potato', portionSize: '1 medium', score: 3 },
              { id: 7, name: 'Olive Oil', portionSize: '1 tbsp', score: 3 },
            ],
          },
          {
            id: 3,
            name: 'Snack',
            time: '3:15 PM',
            date: today,
            score: 4,
            items: 2,
            foods: [
              { id: 8, name: 'Blueberries', portionSize: '1 cup', score: 2 },
              { id: 9, name: 'Almonds', portionSize: '1 oz', score: 2 },
            ],
          },
        ];
        setMeals(defaultMeals);
        await AsyncStorage.setItem('meals', JSON.stringify(defaultMeals));
      }

      if (profileData) {
        setUserProfile(JSON.parse(profileData));
      }

      if (settingsData) {
        setSettings(JSON.parse(settingsData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal = { ...meal, id: Date.now() };
    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);
    saveData('meals', updatedMeals);
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    const updatedProfile = { ...userProfile, ...profile };
    setUserProfile(updatedProfile);
    saveData('userProfile', updatedProfile);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveData('settings', updatedSettings);
  };

  const addAllergy = (allergy: string) => {
    if (!userProfile.allergies.includes(allergy)) {
      const updatedProfile = {
        ...userProfile,
        allergies: [...userProfile.allergies, allergy],
      };
      setUserProfile(updatedProfile);
      saveData('userProfile', updatedProfile);
    }
  };

  const removeAllergy = (allergy: string) => {
    const updatedProfile = {
      ...userProfile,
      allergies: userProfile.allergies.filter(a => a !== allergy),
    };
    setUserProfile(updatedProfile);
    saveData('userProfile', updatedProfile);
  };

  const addSensitivity = (sensitivity: string) => {
    if (!userProfile.sensitivities.includes(sensitivity)) {
      const updatedProfile = {
        ...userProfile,
        sensitivities: [...userProfile.sensitivities, sensitivity],
      };
      setUserProfile(updatedProfile);
      saveData('userProfile', updatedProfile);
    }
  };

  const removeSensitivity = (sensitivity: string) => {
    const updatedProfile = {
      ...userProfile,
      sensitivities: userProfile.sensitivities.filter(s => s !== sensitivity),
    };
    setUserProfile(updatedProfile);
    saveData('userProfile', updatedProfile);
  };

  const getTodaysMeals = (): Meal[] => {
    const today = new Date().toISOString().split('T')[0];
    return meals.filter(m => m.date === today);
  };

  const refreshStats = () => {
    const stats = calculateStats(meals);
    setUserStats(stats);
    setWeeklyData(generateWeeklyData(meals));
    setMonthlyData(generateMonthlyData(meals));
    setYearlyData(generateYearlyData(meals));
  };

  return (
    <AppContext.Provider
      value={{
        meals,
        userProfile,
        userStats,
        settings,
        weeklyData,
        monthlyData,
        yearlyData,
        isLoading,
        addMeal,
        updateProfile,
        updateSettings,
        addAllergy,
        removeAllergy,
        addSensitivity,
        removeSensitivity,
        getTodaysMeals,
        refreshStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

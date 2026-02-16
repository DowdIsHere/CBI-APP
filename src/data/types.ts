// User Profile
export interface UserProfile {
  name: string;
  email: string;
  condition: string;
  joinDate: string;
  avatar?: string;
}

// Triggers
export interface Trigger {
  id: string;
  name: string;
  category: 'Food Group' | 'Allergy' | 'Sensitivity';
  severity: 'high' | 'medium' | 'low';
}

// Food Items
export interface FoodItem {
  id: string;
  name: string;
  portionSize?: string;
  servingSize?: string;
  brand?: string;
  upc?: string;
  score: number;
  warnings: string[];
}

// Meals
export interface Meal {
  id: string;
  name: string;
  time: string;
  date: string;
  items: FoodItem[];
  totalScore: number;
}

// Daily Stats
export interface DailyStats {
  date: string;
  totalScore: number;
  mealsLogged: number;
  energyLevel?: number;
}

// User Stats
export interface UserStats {
  todayScore: number;
  weekAverage: number;
  streak: number;
  energyLevel: number;
  weightChange: number;
  totalMeals: number;
  bestDay: number;
}

// Achievement
export interface Achievement {
  id: string;
  name: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedDate?: string;
}

// Insight
export interface Insight {
  id: string;
  type: 'success' | 'tip' | 'warning';
  message: string;
  icon: string;
  color: string;
  date: string;
}

// Learning Module
export interface LearningModule {
  id: string;
  title: string;
  lessons: number;
  completedLessons: number;
  duration: string;
  icon: string;
  color: string;
}

// Lesson
export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  duration: string;
  content: string[];
  keyPoints: string[];
  completed: boolean;
}

// Article
export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  icon: string;
  content: string[];
  keyTakeaways: string[];
}

// Current Lesson
export interface CurrentLesson {
  moduleId: string;
  week: string;
  title: string;
  progress: number;
  timeEstimate: string;
}

// Settings
export interface Settings {
  notificationsEnabled: boolean;
  remindersEnabled: boolean;
  darkMode: boolean;
}

// App State
export interface AppData {
  user: UserProfile;
  stats: UserStats;
  triggers: Trigger[];
  meals: Meal[];
  dailyStats: DailyStats[];
  achievements: Achievement[];
  insights: Insight[];
  learningModules: LearningModule[];
  currentLesson: CurrentLesson;
  completedLessonIds: string[];
  settings: Settings;
}

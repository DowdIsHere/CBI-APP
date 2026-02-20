import { AppData } from './types';

export const initialData: AppData = {
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    condition: 'Multiple Sclerosis',
    joinDate: 'Jan 2025',
  },

  stats: {
    todayScore: 0,
    weekAverage: 0,
    streak: 0,
    energyLevel: 5,
    weightChange: 0,
    totalMeals: 0,
    bestDay: 0,
  },

  triggers: [
    { id: '1', name: 'Nightshades', category: 'Food Group', severity: 'high' },
    { id: '2', name: 'Dairy', category: 'Food Group', severity: 'medium' },
    { id: '3', name: 'Gluten', category: 'Food Group', severity: 'medium' },
    { id: '4', name: 'Shellfish', category: 'Allergy', severity: 'high' },
    { id: '5', name: 'Tree Nuts', category: 'Allergy', severity: 'high' },
  ],

  meals: [],

  dailyStats: [],

  achievements: [
    { id: '1', name: 'First Meal', icon: 'restaurant', color: '#3b82f6', unlocked: false },
    { id: '2', name: '7-Day Streak', icon: 'flame', color: '#f59e0b', unlocked: false },
    { id: '3', name: 'ENS Optimizer', icon: 'fitness', color: '#8b5cf6', unlocked: false },
    { id: '4', name: 'Omega-3 Master', icon: 'fish', color: '#3b82f6', unlocked: false },
    { id: '5', name: 'Sugar-Free Week', icon: 'ban', color: '#ef4444', unlocked: false },
    { id: '6', name: 'Learning Started', icon: 'book', color: '#10b981', unlocked: false },
  ],

  insights: [],

  learningModules: [
    { id: '1', title: 'Foundation', lessons: 4, completedLessons: 0, duration: '20 min', icon: 'school', color: '#3b82f6' },
    { id: '2', title: 'Mechanisms', lessons: 5, completedLessons: 0, duration: '30 min', icon: 'cog', color: '#8b5cf6' },
    { id: '3', title: 'Optimization', lessons: 6, completedLessons: 0, duration: '35 min', icon: 'fitness', color: '#10b981' },
    { id: '4', title: 'Disease-Specific', lessons: 4, completedLessons: 0, duration: '25 min', icon: 'medical', color: '#ef4444' },
  ],

  currentLesson: {
    moduleId: '1',
    week: 'Week 1: Foundation',
    title: 'Meet Your Enteric Nervous System',
    progress: 0,
    timeEstimate: '5 min',
  },

  completedLessonIds: [],

  settings: {
    notificationsEnabled: true,
    remindersEnabled: true,
    darkMode: false,
    fastingSchedule: {
      enabled: false,
      startTime: '20:00',
      endTime: '12:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  },
};

// Demo data with some progress for testing
export const demoData: AppData = {
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    condition: 'Multiple Sclerosis',
    joinDate: 'Jan 2025',
  },

  stats: {
    todayScore: 14,
    weekAverage: 11,
    streak: 7,
    energyLevel: 8,
    weightChange: -2.5,
    totalMeals: 45,
    bestDay: 18,
  },

  triggers: [
    { id: '1', name: 'Nightshades', category: 'Food Group', severity: 'high' },
    { id: '2', name: 'Dairy', category: 'Food Group', severity: 'medium' },
    { id: '3', name: 'Gluten', category: 'Food Group', severity: 'medium' },
    { id: '4', name: 'Shellfish', category: 'Allergy', severity: 'high' },
    { id: '5', name: 'Tree Nuts', category: 'Allergy', severity: 'high' },
  ],

  meals: [
    {
      id: '1',
      name: 'Breakfast',
      time: '8:30 AM',
      date: new Date().toISOString().split('T')[0],
      items: [
        { id: '1a', name: 'Eggs', score: 2, warnings: [] },
        { id: '1b', name: 'Avocado', score: 3, warnings: [] },
        { id: '1c', name: 'Spinach', score: 3, warnings: [] },
      ],
      totalScore: 8,
    },
    {
      id: '2',
      name: 'Lunch',
      time: '12:45 PM',
      date: new Date().toISOString().split('T')[0],
      items: [
        { id: '2a', name: 'Wild Salmon', score: 4, warnings: [] },
        { id: '2b', name: 'Broccoli', score: 3, warnings: [] },
        { id: '2c', name: 'Olive Oil', score: 2, warnings: [] },
        { id: '2d', name: 'Quinoa', score: 3, warnings: [] },
      ],
      totalScore: 12,
    },
    {
      id: '3',
      name: 'Snack',
      time: '3:15 PM',
      date: new Date().toISOString().split('T')[0],
      items: [
        { id: '3a', name: 'Blueberries', score: 2, warnings: [] },
        { id: '3b', name: 'Walnuts', score: 2, warnings: [] },
      ],
      totalScore: 4,
    },
  ],

  dailyStats: [
    { date: getDateString(-6), totalScore: 12, mealsLogged: 3, energyLevel: 7 },
    { date: getDateString(-5), totalScore: 9, mealsLogged: 2, energyLevel: 6 },
    { date: getDateString(-4), totalScore: 15, mealsLogged: 4, energyLevel: 8 },
    { date: getDateString(-3), totalScore: 11, mealsLogged: 3, energyLevel: 7 },
    { date: getDateString(-2), totalScore: 13, mealsLogged: 3, energyLevel: 8 },
    { date: getDateString(-1), totalScore: 10, mealsLogged: 3, energyLevel: 7 },
    { date: getDateString(0), totalScore: 14, mealsLogged: 3, energyLevel: 8 },
  ],

  achievements: [
    { id: '1', name: 'First Meal', icon: 'restaurant', color: '#3b82f6', unlocked: true, unlockedDate: '2025-01-15' },
    { id: '2', name: '7-Day Streak', icon: 'flame', color: '#f59e0b', unlocked: true, unlockedDate: '2025-01-22' },
    { id: '3', name: 'ENS Optimizer', icon: 'fitness', color: '#8b5cf6', unlocked: true, unlockedDate: '2025-01-25' },
    { id: '4', name: 'Omega-3 Master', icon: 'fish', color: '#3b82f6', unlocked: true, unlockedDate: '2025-01-28' },
    { id: '5', name: 'Sugar-Free Week', icon: 'ban', color: '#ef4444', unlocked: false },
    { id: '6', name: 'Learning Started', icon: 'book', color: '#10b981', unlocked: true, unlockedDate: '2025-01-16' },
  ],

  insights: [
    { id: '1', type: 'success', message: 'Your energy levels are up 60% this week!', icon: 'flash', color: '#10b981', date: getDateString(0) },
    { id: '2', type: 'tip', message: 'Add more sulforaphane - only 1 cruciferous serving yesterday', icon: 'bulb', color: '#3b82f6', date: getDateString(0) },
    { id: '3', type: 'warning', message: 'Detected nightshades in 2 meals - may trigger symptoms', icon: 'warning', color: '#f59e0b', date: getDateString(0) },
  ],

  learningModules: [
    { id: '1', title: 'Foundation', lessons: 4, completedLessons: 3, duration: '20 min', icon: 'school', color: '#3b82f6' },
    { id: '2', title: 'Mechanisms', lessons: 5, completedLessons: 0, duration: '30 min', icon: 'cog', color: '#8b5cf6' },
    { id: '3', title: 'Optimization', lessons: 6, completedLessons: 0, duration: '35 min', icon: 'fitness', color: '#10b981' },
    { id: '4', title: 'Disease-Specific', lessons: 4, completedLessons: 0, duration: '25 min', icon: 'medical', color: '#ef4444' },
  ],

  currentLesson: {
    moduleId: '1',
    week: 'Week 1: Foundation',
    title: 'The Three Intelligences',
    progress: 75,
    timeEstimate: '5 min',
  },

  completedLessonIds: ['1-1', '1-2', '1-3'], // First 3 lessons of Foundation module

  settings: {
    notificationsEnabled: true,
    remindersEnabled: true,
    darkMode: false,
    fastingSchedule: {
      enabled: true,
      startTime: '20:00',
      endTime: '12:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
  },
};

// Helper to get date string for N days ago
function getDateString(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

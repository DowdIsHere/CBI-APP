import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const NOTIFICATION_PREFS_KEY = 'cbi_notification_prefs';
const PUSH_TOKEN_KEY = 'cbi_push_token';

export interface NotificationPreferences {
  notificationsEnabled: boolean;
  mealRemindersEnabled: boolean;
}

const DEFAULT_PREFS: NotificationPreferences = {
  notificationsEnabled: true,
  mealRemindersEnabled: true,
};

// Configure how notifications appear when the app is in the foreground
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Register for push notifications and return the Expo push token.
 * Returns null if permissions are denied or unavailable.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Push notifications only work on physical devices
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device');
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permission if not already granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Push notification permission not granted');
    return null;
  }

  // Android requires a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('meal-reminders', {
      name: 'Meal Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1e3a8a',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('streak-reminders', {
      name: 'Streak Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#f59e0b',
      sound: 'default',
    });
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    const token = tokenData.data;

    // Persist the token locally
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    return token;
  } catch (error) {
    console.error('Failed to get push token:', error);
    return null;
  }
}

/**
 * Schedule daily meal reminder notifications.
 * Breakfast at 8:00 AM, Lunch at 12:00 PM, Dinner at 6:00 PM.
 * Each repeats daily.
 */
export async function scheduleMealReminders(): Promise<void> {
  // Cancel any existing meal reminders before scheduling new ones
  await cancelMealReminders();

  const mealSchedule = [
    {
      identifier: 'breakfast-reminder',
      title: 'Breakfast Time',
      body: 'Good morning! Time to log your breakfast and start the day right.',
      hour: 8,
      minute: 0,
    },
    {
      identifier: 'lunch-reminder',
      title: 'Lunch Time',
      body: 'Midday check-in! Log your lunch to keep your nutrition on track.',
      hour: 12,
      minute: 0,
    },
    {
      identifier: 'dinner-reminder',
      title: 'Dinner Time',
      body: 'Evening reminder! Log your dinner to complete your daily meals.',
      hour: 18,
      minute: 0,
    },
  ];

  for (const meal of mealSchedule) {
    await Notifications.scheduleNotificationAsync({
      identifier: meal.identifier,
      content: {
        title: meal.title,
        body: meal.body,
        sound: 'default',
        data: { screen: 'LogMeal', type: 'meal-reminder' },
        ...(Platform.OS === 'android' && { channelId: 'meal-reminders' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: meal.hour,
        minute: meal.minute,
      },
    });
  }
}

/**
 * Schedule a daily streak reminder at 7:00 PM.
 * Reminds the user to log a meal if they haven't yet today.
 */
export async function scheduleStreakReminder(): Promise<void> {
  await cancelStreakReminder();

  await Notifications.scheduleNotificationAsync({
    identifier: 'streak-reminder',
    content: {
      title: 'Keep Your Streak Alive!',
      body: "You haven't logged a meal today. Log one now to maintain your streak!",
      sound: 'default',
      data: { screen: 'LogMeal', type: 'streak-reminder' },
      ...(Platform.OS === 'android' && { channelId: 'streak-reminders' }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 19,
      minute: 0,
    },
  });
}

/**
 * Cancel only meal reminder notifications.
 */
async function cancelMealReminders(): Promise<void> {
  const identifiers = ['breakfast-reminder', 'lunch-reminder', 'dinner-reminder'];
  for (const id of identifiers) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
}

/**
 * Cancel only the streak reminder notification.
 */
async function cancelStreakReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('streak-reminder');
}

/**
 * Cancel all scheduled notifications.
 */
export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Send an immediate local notification.
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      data: data ?? {},
    },
    trigger: null, // Fires immediately
  });
}

/**
 * Save notification preferences to AsyncStorage.
 */
export async function saveNotificationPreferences(
  prefs: NotificationPreferences,
): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
}

/**
 * Load notification preferences from AsyncStorage.
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const data = await AsyncStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Return defaults on error
  }
  return DEFAULT_PREFS;
}

/**
 * Initialize the full notification system.
 * Call this once on app start. Registers for push notifications,
 * then schedules reminders based on saved preferences.
 */
export async function initializeNotifications(): Promise<void> {
  await registerForPushNotifications();

  const prefs = await getNotificationPreferences();

  if (prefs.notificationsEnabled) {
    if (prefs.mealRemindersEnabled) {
      await scheduleMealReminders();
    }
    await scheduleStreakReminder();
  } else {
    await cancelAllReminders();
  }
}

/**
 * Update notification scheduling based on changed preferences.
 * Saves preferences and reschedules or cancels as needed.
 */
export async function updateNotificationSettings(
  prefs: NotificationPreferences,
): Promise<void> {
  await saveNotificationPreferences(prefs);

  if (!prefs.notificationsEnabled) {
    // All notifications off
    await cancelAllReminders();
    return;
  }

  // Notifications are enabled - always schedule streak reminder
  await scheduleStreakReminder();

  if (prefs.mealRemindersEnabled) {
    await scheduleMealReminders();
  } else {
    await cancelMealReminders();
  }
}

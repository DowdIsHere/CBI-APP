import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { FastingSchedule, Settings } from '../data/types';
import { logger } from './logger';

const DAY_INDEX: Record<string, number> = {
  Sun: 1,
  Mon: 2,
  Tue: 3,
  Wed: 4,
  Thu: 5,
  Fri: 6,
  Sat: 7,
};

// Stable identifier prefixes so we can replace just one category at a time.
const ID_PREFIX = {
  meal: 'mido.meal.',
  fastStart: 'mido.fastStart.',
  fastEnd: 'mido.fastEnd.',
  streak: 'mido.streak',
};

// Default times for daily meal reminders. Could be made user-configurable later.
const DEFAULT_MEAL_TIMES: Array<{ hour: number; minute: number; label: string; key: string }> = [
  { hour: 9, minute: 0, label: 'breakfast', key: 'b' },
  { hour: 13, minute: 0, label: 'lunch', key: 'l' },
  { hour: 19, minute: 0, label: 'dinner', key: 'd' },
];

const STREAK_REMINDER = { hour: 20, minute: 0 };

let handlerConfigured = false;

export function configureNotificationHandler() {
  if (handlerConfigured) return;
  handlerConfigured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const existing = await Notifications.getPermissionsAsync();
    if (existing.granted) return true;
    if (!existing.canAskAgain) return false;

    const result = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: false, allowSound: true },
    });
    return !!result.granted;
  } catch (error) {
    logger.captureException(error, { source: 'requestNotificationPermissions' });
    return false;
  }
}

async function cancelByPrefix(prefix: string) {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      scheduled
        .filter((n) => n.identifier.startsWith(prefix))
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
    );
  } catch (error) {
    logger.captureException(error, { source: 'cancelByPrefix', prefix });
  }
}

export async function cancelAllAppNotifications() {
  await Promise.all([
    cancelByPrefix(ID_PREFIX.meal),
    cancelByPrefix(ID_PREFIX.fastStart),
    cancelByPrefix(ID_PREFIX.fastEnd),
    cancelByPrefix(ID_PREFIX.streak),
  ]);
}

async function scheduleDaily(
  identifier: string,
  hour: number,
  minute: number,
  title: string,
  body: string,
  weekday?: number,
) {
  try {
    const trigger: Notifications.NotificationTriggerInput =
      weekday !== undefined
        ? {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            hour,
            minute,
            weekday,
          }
        : {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
          };

    await Notifications.scheduleNotificationAsync({
      identifier,
      content: { title, body, sound: true },
      trigger,
    });
  } catch (error) {
    logger.captureException(error, { source: 'scheduleDaily', identifier });
  }
}

async function scheduleMealReminders(enabled: boolean) {
  await cancelByPrefix(ID_PREFIX.meal);
  if (!enabled) return;

  for (const slot of DEFAULT_MEAL_TIMES) {
    await scheduleDaily(
      `${ID_PREFIX.meal}${slot.key}`,
      slot.hour,
      slot.minute,
      `Time to log ${slot.label}`,
      'A quick snap or note keeps your streak alive.',
    );
  }
}

async function scheduleFastingReminders(schedule: FastingSchedule | undefined) {
  await cancelByPrefix(ID_PREFIX.fastStart);
  await cancelByPrefix(ID_PREFIX.fastEnd);
  if (!schedule || !schedule.enabled || schedule.days.length === 0) return;

  const [startH, startM] = schedule.startTime.split(':').map((n) => parseInt(n, 10));
  const [endH, endM] = schedule.endTime.split(':').map((n) => parseInt(n, 10));

  for (const day of schedule.days) {
    const weekday = DAY_INDEX[day];
    if (!weekday) continue;
    await scheduleDaily(
      `${ID_PREFIX.fastStart}${day}`,
      startH,
      startM,
      'Fasting window starting',
      `Eating window closes at ${schedule.startTime}. Log anything before then.`,
      weekday,
    );
    await scheduleDaily(
      `${ID_PREFIX.fastEnd}${day}`,
      endH,
      endM,
      'Fast complete',
      `You can break your fast now (${schedule.endTime}). Plan a gentle first meal.`,
      weekday,
    );
  }
}

async function scheduleStreakReminder(enabled: boolean, hasLoggedToday: boolean, streak: number) {
  await cancelByPrefix(ID_PREFIX.streak);
  if (!enabled || hasLoggedToday || streak < 2) return;

  const now = new Date();
  const fireAt = new Date();
  fireAt.setHours(STREAK_REMINDER.hour, STREAK_REMINDER.minute, 0, 0);
  if (fireAt.getTime() <= now.getTime()) return;

  try {
    await Notifications.scheduleNotificationAsync({
      identifier: ID_PREFIX.streak,
      content: {
        title: `Don't lose your ${streak}-day streak`,
        body: 'Log one item before midnight to keep it going.',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireAt,
      },
    });
  } catch (error) {
    logger.captureException(error, { source: 'scheduleStreakReminder' });
  }
}

export interface SyncNotificationsArgs {
  settings: Settings;
  hasLoggedToday: boolean;
  streak: number;
}

// Single entry point: reconcile all scheduled notifications to current settings.
// Call whenever settings, today's log status, or streak changes.
export async function syncNotifications({ settings, hasLoggedToday, streak }: SyncNotificationsArgs) {
  if (Platform.OS === 'web') return;

  if (!settings.notificationsEnabled) {
    await cancelAllAppNotifications();
    return;
  }

  const granted = await requestNotificationPermissions();
  if (!granted) {
    await cancelAllAppNotifications();
    return;
  }

  await scheduleMealReminders(settings.remindersEnabled);
  await scheduleFastingReminders(settings.fastingSchedule);
  await scheduleStreakReminder(settings.remindersEnabled, hasLoggedToday, streak);
}

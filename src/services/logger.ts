import Constants from 'expo-constants';

// Sentry-shaped facade. When a Sentry DSN is wired in, swap the implementations
// in this file for @sentry/react-native calls; nothing else in the app needs to change.

type Level = 'debug' | 'info' | 'warning' | 'error' | 'fatal';

interface Breadcrumb {
  category: string;
  message: string;
  level?: Level;
  data?: Record<string, unknown>;
}

interface UserContext {
  id?: string;
  email?: string;
}

let initialized = false;
let userContext: UserContext | null = null;

export function init() {
  if (initialized) return;
  initialized = true;

  const dsn = Constants.expoConfig?.extra?.sentryDsn;
  if (dsn) {
    // Placeholder: real wiring pending Sentry DSN/account.
    // Sentry.init({ dsn, enableAutoSessionTracking: true, ... })
    console.info('[logger] DSN detected; Sentry wiring pending');
  }
}

export function setUser(user: UserContext | null) {
  userContext = user;
}

export function addBreadcrumb(crumb: Breadcrumb) {
  if (__DEV__) {
    console.log(`[breadcrumb:${crumb.category}] ${crumb.message}`, crumb.data ?? '');
  }
}

export function captureMessage(message: string, level: Level = 'info') {
  if (__DEV__) {
    console.log(`[logger:${level}] ${message}`);
  }
}

export function captureException(error: unknown, context?: Record<string, unknown>) {
  const err = error instanceof Error ? error : new Error(String(error));
  console.error('[logger:exception]', err.message, {
    user: userContext,
    context,
    stack: err.stack,
  });
}

export const logger = {
  init,
  setUser,
  addBreadcrumb,
  captureMessage,
  captureException,
};

export default logger;

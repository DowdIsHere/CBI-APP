import { Alert, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { logger } from './logger';

// Error types for categorization
export enum ErrorType {
  NETWORK = 'network',
  API = 'api',
  PERMISSION = 'permission',
  STORAGE = 'storage',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

// Standard error response
export interface AppError {
  type: ErrorType;
  message: string;
  userMessage: string;
  originalError?: Error;
  recoverable: boolean;
}

// Create standardized app error
export function createAppError(
  type: ErrorType,
  message: string,
  userMessage: string,
  originalError?: Error,
  recoverable = true
): AppError {
  return {
    type,
    message,
    userMessage,
    originalError,
    recoverable,
  };
}

// Check network connectivity
export async function checkNetworkConnection(): Promise<boolean> {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  } catch {
    return true; // Assume connected if check fails
  }
}

// Show user-friendly error alert
export function showErrorAlert(
  error: AppError | string,
  onRetry?: () => void
): void {
  const message = typeof error === 'string' ? error : error.userMessage;
  const title = typeof error === 'string' ? 'Error' : getErrorTitle(error.type);

  const buttons: Array<{ text: string; onPress?: () => void; style?: 'cancel' | 'default' | 'destructive' }> = [
    { text: 'OK', style: 'cancel' },
  ];

  if (onRetry && (typeof error === 'string' || error.recoverable)) {
    buttons.unshift({ text: 'Retry', onPress: onRetry });
  }

  Alert.alert(title, message, buttons);
}

// Get error title based on type
function getErrorTitle(type: ErrorType): string {
  switch (type) {
    case ErrorType.NETWORK:
      return 'Connection Error';
    case ErrorType.API:
      return 'Service Error';
    case ErrorType.PERMISSION:
      return 'Permission Required';
    case ErrorType.STORAGE:
      return 'Storage Error';
    case ErrorType.VALIDATION:
      return 'Invalid Input';
    default:
      return 'Something Went Wrong';
  }
}

// Parse common errors into AppError
export function parseError(error: unknown): AppError {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Network errors
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('connection')
    ) {
      return createAppError(
        ErrorType.NETWORK,
        error.message,
        'Unable to connect. Please check your internet connection and try again.',
        error
      );
    }

    // API errors
    if (message.includes('api') || message.includes('401') || message.includes('403')) {
      return createAppError(
        ErrorType.API,
        error.message,
        'There was a problem with the service. Please try again later.',
        error
      );
    }

    // Permission errors
    if (message.includes('permission') || message.includes('denied')) {
      return createAppError(
        ErrorType.PERMISSION,
        error.message,
        'Permission is required to use this feature. Please enable it in Settings.',
        error,
        false
      );
    }

    // Storage errors
    if (message.includes('storage') || message.includes('asyncstorage')) {
      return createAppError(
        ErrorType.STORAGE,
        error.message,
        'Unable to save data. Please try again.',
        error
      );
    }

    // Default error
    return createAppError(
      ErrorType.UNKNOWN,
      error.message,
      'Something went wrong. Please try again.',
      error
    );
  }

  // Unknown error type
  return createAppError(
    ErrorType.UNKNOWN,
    String(error),
    'An unexpected error occurred. Please try again.'
  );
}

// Wrapper for async operations with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  options?: {
    showAlert?: boolean;
    onError?: (error: AppError) => void;
    onRetry?: () => void;
    fallbackValue?: T;
  }
): Promise<{ success: boolean; data?: T; error?: AppError }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (err) {
    const appError = parseError(err);

    logger.captureException(appError.originalError ?? err, {
      type: appError.type,
      userMessage: appError.userMessage,
    });

    if (options?.onError) {
      options.onError(appError);
    }

    if (options?.showAlert !== false) {
      showErrorAlert(appError, options?.onRetry);
    }

    if (options?.fallbackValue !== undefined) {
      return { success: false, data: options.fallbackValue, error: appError };
    }

    return { success: false, error: appError };
  }
}

// Format error for logging
export function formatErrorForLog(error: AppError): string {
  return `[${error.type.toUpperCase()}] ${error.message}${
    error.originalError ? `\nStack: ${error.originalError.stack}` : ''
  }`;
}

// Common error messages
export const ErrorMessages = {
  NETWORK_OFFLINE: 'You appear to be offline. Please check your connection.',
  API_UNAVAILABLE: 'The service is temporarily unavailable. Please try again later.',
  PHOTO_PERMISSION: 'Camera or photo access is required to analyze meals.',
  SAVE_FAILED: 'Unable to save your changes. Please try again.',
  LOAD_FAILED: 'Unable to load data. Pull down to refresh.',
  EXPORT_FAILED: 'Unable to export data. Please try again.',
  ANALYSIS_FAILED: 'Unable to analyze the photo. Please try again or enter food manually.',
  INVALID_INPUT: 'Please check your input and try again.',
};

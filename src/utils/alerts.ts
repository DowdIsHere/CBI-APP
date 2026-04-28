import { Alert, Platform } from 'react-native';

// React Native's Alert.alert is unreliable on react-native-web — single-button
// alerts and multi-button confirmations often no-op or render without their
// buttons. These helpers fall back to window.alert / window.confirm on web so
// errors and confirmations actually surface to the user.

export function alertMessage(title: string, message?: string, onOk?: () => void): void {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && typeof window.alert === 'function') {
      window.alert(message ? `${title}\n\n${message}` : title);
    }
    onOk?.();
    return;
  }
  Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
}

export function alertConfirm(
  title: string,
  message: string | undefined,
  onConfirm: () => void,
  options?: { confirmLabel?: string; cancelLabel?: string; destructive?: boolean; onCancel?: () => void }
): void {
  const confirmLabel = options?.confirmLabel ?? 'OK';
  const cancelLabel = options?.cancelLabel ?? 'Cancel';

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      const confirmed = window.confirm(message ? `${title}\n\n${message}` : title);
      if (confirmed) onConfirm();
      else options?.onCancel?.();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel', onPress: options?.onCancel },
    {
      text: confirmLabel,
      style: options?.destructive ? 'destructive' : 'default',
      onPress: onConfirm,
    },
  ]);
}

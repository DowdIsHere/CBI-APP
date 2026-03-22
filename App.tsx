import 'react-native-url-polyfill/auto';
import { useEffect, useState, useCallback, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { AppProvider } from './src/data/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthScreen from './src/screens/AuthScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { initializeNotifications } from './src/services/notifications';

const ONBOARDING_KEY = 'cbi_onboarding_complete';

function RootNavigator() {
  const { user, loading } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const notificationResponseListener = useRef<Notifications.Subscription>(null);

  useEffect(() => {
    if (user) {
      AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
        setOnboardingComplete(value === 'true');
      });
    } else {
      setOnboardingComplete(null);
    }
  }, [user]);

  // Initialize notifications when a user is authenticated (native only)
  useEffect(() => {
    if (!user || Platform.OS === 'web') return;

    initializeNotifications().catch((err) =>
      console.warn('Failed to initialize notifications:', err),
    );
  }, [user]);

  // Handle notification taps - navigate to the appropriate screen (native only)
  useEffect(() => {
    if (!user || Platform.OS === 'web') return;

    notificationResponseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        const screen = data?.screen as string | undefined;

        if (screen && navigationRef.current?.isReady()) {
          navigationRef.current.navigate(screen);
        }
      });

    return () => {
      if (notificationResponseListener.current) {
        notificationResponseListener.current.remove();
      }
    };
  }, [user]);

  const handleOnboardingComplete = useCallback(() => {
    setOnboardingComplete(true);
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (onboardingComplete === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!onboardingComplete) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
});

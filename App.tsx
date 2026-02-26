import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import { AppProvider, useAppData } from './src/data/AppContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { ToastProvider } from './src/contexts/ToastContext';
import OfflineBanner from './src/components/OfflineBanner';

function AppContent() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { isLoading: dataLoading, hasCompletedOnboarding } = useAppData();
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Show loading while checking auth
  if (authLoading || dataLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e3a8a' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Show auth screen if not signed in
  if (!isAuthenticated) {
    return (
      <>
        <AuthScreen />
        <StatusBar style="dark" />
      </>
    );
  }

  // Show onboarding for new users
  if (!hasCompletedOnboarding && showOnboarding) {
    return (
      <>
        <OnboardingScreen onComplete={() => setShowOnboarding(false)} />
        <StatusBar style="dark" />
      </>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
      <OfflineBanner />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

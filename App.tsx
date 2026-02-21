import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { AppProvider, useAppData } from './src/data/AppContext';

function AppContent() {
  const { isLoading, hasCompletedOnboarding } = useAppData();
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e3a8a' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
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
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

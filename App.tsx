import React from 'react';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  console.log('=== CBI APP STARTING ===');

  return (
    <>
      <HomeScreen navigation={{ navigate: () => {} }} />
      <StatusBar style="light" />
    </>
  );
}

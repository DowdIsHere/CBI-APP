import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import ChallengeScreen from './src/screens/ChallengeScreen';
import MealEntryScreen from './src/screens/MealEntryScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import EducationScreen from './src/screens/EducationScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  const renderScreen = () => {
    const mockNavigation = { navigate: setActiveTab };

    switch (activeTab) {
      case 'Home':
        return <HomeScreen navigation={mockNavigation} />;
      case 'Challenge':
        return <ChallengeScreen />;
      case 'LogMeal':
        return <MealEntryScreen navigation={mockNavigation} />;
      case 'Progress':
        return <ProgressScreen />;
      case 'Learn':
        return <EducationScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen navigation={mockNavigation} />;
    }
  };

  const tabs = [
    { name: 'Home', label: 'Dashboard', icon: 'home', iconOutline: 'home-outline' },
    { name: 'Challenge', label: '30-Day', icon: 'calendar', iconOutline: 'calendar-outline' },
    { name: 'LogMeal', label: 'Log Meal', icon: 'add-circle', iconOutline: 'add-circle-outline' },
    { name: 'Progress', label: 'Progress', icon: 'trending-up', iconOutline: 'trending-up-outline' },
    { name: 'Learn', label: 'Education', icon: 'book', iconOutline: 'book-outline' },
    { name: 'Profile', label: 'Profile', icon: 'person', iconOutline: 'person-outline' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab.name)}
          >
            <Ionicons
              name={activeTab === tab.name ? tab.icon : tab.iconOutline}
              size={24}
              color={activeTab === tab.name ? '#2563eb' : 'gray'}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === tab.name ? '#2563eb' : 'gray' },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
});

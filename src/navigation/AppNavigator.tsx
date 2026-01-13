import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import MealEntryScreen from '../screens/MealEntryScreen';
import ProgressScreen from '../screens/ProgressScreen';
import EducationScreen from '../screens/EducationScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Custom tab bar button for the center Log button
const LogTabButton = ({ onPress }: { onPress?: () => void }) => (
  <TouchableOpacity
    style={styles.logButtonContainer}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.logButton}>
      <Ionicons name="camera" size={32} color="white" />
    </View>
    <Text style={styles.logButtonLabel}>Log</Text>
  </TouchableOpacity>
);

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return (
              <Ionicons
                name={focused ? 'trending-up' : 'trending-up-outline'}
                size={24}
                color={color}
              />
            );
          } else if (route.name === 'You') {
            return (
              <View style={[styles.avatarIcon, focused && styles.avatarIconFocused]}>
                <Text style={[styles.avatarText, focused && styles.avatarTextFocused]}>
                  RD
                </Text>
              </View>
            );
          }
          return null;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="LogMeal"
        component={MealEntryScreen}
        options={{
          tabBarButton: (props) => <LogTabButton onPress={props.onPress} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="You"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'You',
        }}
      />
      {/* Hidden screens accessible via navigation */}
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Learn"
        component={EducationScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    height: 80,
    paddingTop: 8,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  logButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -20,
  },
  logButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  logButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
    marginTop: 4,
  },
  avatarIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIconFocused: {
    backgroundColor: '#dbeafe',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  avatarTextFocused: {
    color: '#2563eb',
  },
});

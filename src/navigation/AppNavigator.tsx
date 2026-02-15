import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import LogScreen from '../screens/LogScreen';
import YouScreen from '../screens/YouScreen';
import EducationScreen from '../screens/EducationScreen';
import ModuleScreen from '../screens/ModuleScreen';
import LessonScreen from '../screens/LessonScreen';
import ArticleScreen from '../screens/ArticleScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom Log Button Component
const LogButton = ({ onPress, accessibilityState }: any) => {
  const focused = accessibilityState?.selected;

  return (
    <TouchableOpacity
      style={styles.logButtonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.logButton, focused && styles.logButtonFocused]}>
        <Ionicons name="camera" size={28} color="white" />
        <Text style={styles.logButtonText}>LOG</Text>
      </View>
    </TouchableOpacity>
  );
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Log') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'You') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1e3a8a',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: {
          backgroundColor: '#1e3a8a',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Log"
        component={LogScreen}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarButton: (props) => <LogButton {...props} />,
        }}
      />
      <Tab.Screen
        name="You"
        component={YouScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'You',
        }}
      />
    </Tab.Navigator>
  );
}

const headerOptions = {
  headerStyle: {
    backgroundColor: '#1e3a8a',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold' as const,
  },
};

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Learn"
        component={EducationScreen}
        options={{ title: 'Education' }}
      />
      <Stack.Screen
        name="Module"
        component={ModuleScreen}
        options={({ route }: any) => ({
          title: route.params?.moduleTitle || 'Module',
        })}
      />
      <Stack.Screen
        name="Lesson"
        component={LessonScreen}
        options={{ title: 'Lesson' }}
      />
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }: any) => ({
          title: route.params?.articleTitle || 'Article',
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 90,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  logButtonContainer: {
    position: 'relative',
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  logButtonFocused: {
    backgroundColor: '#059669',
  },
  logButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

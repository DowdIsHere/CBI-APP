import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import LogScreen from '../screens/LogScreen';
import YouScreen from '../screens/YouScreen';
import ProgressScreen from '../screens/ProgressScreen';
import EducationScreen from '../screens/EducationScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator for the You tab to include sub-screens
function YouStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="YouMain" component={YouScreen} />
      <Stack.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          headerShown: true,
          title: 'Progress',
          headerStyle: { backgroundColor: '#1e3a8a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="Learn"
        component={EducationScreen}
        options={{
          headerShown: true,
          title: 'Education',
          headerStyle: { backgroundColor: '#1e3a8a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
}

// Stack navigator for Home to access Learn
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="Learn"
        component={EducationScreen}
        options={{
          headerShown: true,
          title: 'Education',
          headerStyle: { backgroundColor: '#1e3a8a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
}

// Custom center button component for elevated LOG button
function LogTabButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.logButton} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.logButtonInner}>
        <Ionicons name="camera" size={28} color="white" />
      </View>
      <Text style={styles.logButtonText}>LOG</Text>
    </TouchableOpacity>
  );
}

export default function AppNavigator() {
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
        tabBarStyle: {
          height: 88,
          paddingBottom: 28,
          paddingTop: 12,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="Log"
        component={LogScreen}
        options={{
          title: 'LOG',
          tabBarButton: (props) => (
            <LogTabButton onPress={() => props.onPress && props.onPress()} />
          ),
        }}
      />
      <Tab.Screen
        name="You"
        component={YouStack}
        options={{
          title: 'You',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  logButton: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -30,
  },
  logButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  logButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 6,
  },
});

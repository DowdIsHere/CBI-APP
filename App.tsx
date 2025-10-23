import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function App() {
  console.log('=== APP IS LOADING ===');

  try {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>CBI APP</Text>
          <Text style={styles.subtitle}>LOADING SUCCESS</Text>
          <Text style={styles.info}>If you see this, React Native works!</Text>
        </View>
      </SafeAreaView>
    );
  } catch (error) {
    console.error('ERROR IN APP:', error);
    return (
      <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 20 }}>ERROR OCCURRED</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: '#bfdbfe',
    textAlign: 'center',
  },
});

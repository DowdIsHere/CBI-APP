import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const translateY = React.useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const offline = !state.isConnected;
      setIsOffline(offline);

      if (offline) {
        setShowBanner(true);
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }).start();
      } else if (showBanner) {
        // Show "back online" briefly then hide
        setTimeout(() => {
          Animated.timing(translateY, {
            toValue: -50,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setShowBanner(false));
        }, 2000);
      }
    });

    return () => unsubscribe();
  }, [showBanner]);

  if (!showBanner) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        isOffline ? styles.offline : styles.online,
        { transform: [{ translateY }] },
      ]}
    >
      <Ionicons
        name={isOffline ? 'cloud-offline' : 'cloud-done'}
        size={18}
        color="white"
      />
      <Text style={styles.text}>
        {isOffline ? 'No internet connection' : 'Back online'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingTop: 48, // Account for status bar
    gap: 8,
    zIndex: 1000,
  },
  offline: {
    backgroundColor: '#ef4444',
  },
  online: {
    backgroundColor: '#10b981',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});

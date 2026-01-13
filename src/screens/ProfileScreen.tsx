import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }: any) {
  const userData = {
    initials: 'RD',
    triggers: {
      confirmed: 5,
      testing: 2,
      safe: 12
    }
  };

  const menuItems = [
    {
      id: 'triggers',
      title: 'Trigger List',
      subtitle: `${userData.triggers.confirmed} confirmed triggers`,
      icon: 'alert-circle',
      iconBg: '#ef4444',
      borderColor: '#fecaca',
      onPress: () => {},
    },
    {
      id: 'progress',
      title: 'Progress',
      subtitle: 'View charts & trends',
      icon: 'trending-up',
      iconBg: '#3b82f6',
      borderColor: '#bfdbfe',
      onPress: () => navigation.navigate('Progress'),
    },
    {
      id: 'education',
      title: 'Education',
      subtitle: 'Learn the protocol',
      icon: 'book',
      iconBg: '#10b981',
      borderColor: '#a7f3d0',
      onPress: () => navigation.navigate('Learn'),
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Preferences & account',
      icon: 'settings',
      iconBg: '#6b7280',
      borderColor: '#d1d5db',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>CBI</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>CBI</Text>
            <Text style={styles.headerSubtitle}>Cellular Biology Intelligence</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="white" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>Your Profile</Text>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, { borderColor: item.borderColor }]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <View style={[styles.menuIconContainer, { backgroundColor: item.iconBg }]}>
                    <Ionicons name={item.icon as any} size={24} color="white" />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Trigger Summary Card */}
          <View style={styles.triggerSummaryCard}>
            <Text style={styles.triggerSummaryTitle}>Trigger Summary</Text>
            <View style={styles.triggerStats}>
              <View style={styles.triggerStatItem}>
                <View style={[styles.triggerStatDot, { backgroundColor: '#ef4444' }]} />
                <Text style={styles.triggerStatLabel}>Confirmed</Text>
                <Text style={styles.triggerStatValue}>{userData.triggers.confirmed}</Text>
              </View>
              <View style={styles.triggerStatItem}>
                <View style={[styles.triggerStatDot, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.triggerStatLabel}>Testing</Text>
                <Text style={styles.triggerStatValue}>{userData.triggers.testing}</Text>
              </View>
              <View style={styles.triggerStatItem}>
                <View style={[styles.triggerStatDot, { backgroundColor: '#10b981' }]} />
                <Text style={styles.triggerStatLabel}>Safe</Text>
                <Text style={styles.triggerStatValue}>{userData.triggers.safe}</Text>
              </View>
            </View>
          </View>

          {/* App Info */}
          <View style={styles.appInfoSection}>
            <Text style={styles.appInfoText}>CBI App v1.0.0</Text>
            <Text style={styles.appInfoText}>The Dowd Protocol</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#93c5fd',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  menuContainer: {
    gap: 12,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    gap: 2,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  // Trigger Summary
  triggerSummaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  triggerSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  triggerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  triggerStatItem: {
    alignItems: 'center',
    gap: 8,
  },
  triggerStatDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  triggerStatLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  triggerStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  // App Info
  appInfoSection: {
    marginTop: 32,
    alignItems: 'center',
    gap: 4,
  },
  appInfoText: {
    fontSize: 13,
    color: '#9ca3af',
  },
});

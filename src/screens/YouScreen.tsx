import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  iconColor: string;
  badge?: number;
  onPress: () => void;
}

export default function YouScreen({ navigation }: any) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const userProfile = {
    name: 'John Doe',
    email: 'john@example.com',
    condition: 'Multiple Sclerosis',
    joinDate: 'Jan 2025',
    totalMeals: 45,
    streak: 7,
  };

  const triggerCount = 5;

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Your Data',
      items: [
        {
          id: 'triggers',
          title: 'Trigger List',
          subtitle: `${triggerCount} items being tracked`,
          icon: 'warning',
          iconColor: '#ef4444',
          badge: triggerCount,
          onPress: () => {},
        },
        {
          id: 'progress',
          title: 'Progress & Charts',
          subtitle: 'View your weekly stats',
          icon: 'trending-up',
          iconColor: '#10b981',
          onPress: () => navigation.navigate('Progress'),
        },
        {
          id: 'achievements',
          title: 'Achievements',
          subtitle: '3 of 12 unlocked',
          icon: 'trophy',
          iconColor: '#f59e0b',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Learn',
      items: [
        {
          id: 'education',
          title: 'Education Hub',
          subtitle: 'Continue your journey',
          icon: 'book',
          iconColor: '#8b5cf6',
          onPress: () => navigation.navigate('Learn'),
        },
        {
          id: 'articles',
          title: 'Quick Reads',
          subtitle: 'Latest research & tips',
          icon: 'document-text',
          iconColor: '#3b82f6',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Health Profile',
      items: [
        {
          id: 'condition',
          title: 'Primary Condition',
          subtitle: userProfile.condition,
          icon: 'medical',
          iconColor: '#ef4444',
          onPress: () => {},
        },
        {
          id: 'restrictions',
          title: 'Dietary Restrictions',
          subtitle: 'Allergies & sensitivities',
          icon: 'nutrition',
          iconColor: '#f59e0b',
          onPress: () => {},
        },
        {
          id: 'fasting',
          title: 'Fasting Schedule',
          subtitle: 'Not configured',
          icon: 'time',
          iconColor: '#10b981',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          id: 'export',
          title: 'Export Data',
          icon: 'download',
          iconColor: '#6b7280',
          onPress: () => {},
        },
        {
          id: 'help',
          title: 'Help & Support',
          icon: 'help-circle',
          iconColor: '#6b7280',
          onPress: () => {},
        },
        {
          id: 'about',
          title: 'About CBI',
          icon: 'information-circle',
          iconColor: '#6b7280',
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userProfile.name.charAt(0)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={18} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile.totalMeals}</Text>
            <Text style={styles.statLabel}>Meals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile.joinDate}</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.notificationsCard}>
          <View style={styles.notificationRow}>
            <View style={styles.notificationInfo}>
              <View style={[styles.notificationIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="notifications" size={18} color="#3b82f6" />
              </View>
              <Text style={styles.notificationLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={notificationsEnabled ? '#3b82f6' : '#f3f4f6'}
            />
          </View>
          <View style={styles.notificationDivider} />
          <View style={styles.notificationRow}>
            <View style={styles.notificationInfo}>
              <View style={[styles.notificationIcon, { backgroundColor: '#ede9fe' }]}>
                <Ionicons name="alarm" size={18} color="#8b5cf6" />
              </View>
              <Text style={styles.notificationLabel}>Meal Reminders</Text>
            </View>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
              thumbColor={remindersEnabled ? '#8b5cf6' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
                    <View
                      style={[
                        styles.menuIcon,
                        { backgroundColor: item.iconColor + '15' },
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={item.iconColor}
                      />
                    </View>
                    <View style={styles.menuContent}>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      {item.subtitle && (
                        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>
                    {item.badge && (
                      <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                  {idx < section.items.length - 1 && (
                    <View style={styles.menuDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>CBI - The Dowd Protocol</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 2,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  notificationsCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  notificationDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 14,
  },
  menuSection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  badgeContainer: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 66,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  footerVersion: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

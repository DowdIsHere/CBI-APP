import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Panel from '../components/panels/Panel';
import { useAppData } from '../data/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function YouScreen({ navigation }: any) {
  const [triggersOpen, setTriggersOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { data, getWeeklyStats, removeTrigger, updateSettings } = useAppData();
  const { user, stats, triggers, settings } = data;

  const weeklyData = getWeeklyStats();
  const maxScore = Math.max(...weeklyData.map((d) => d.score), 1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalMeals}</Text>
              <Text style={styles.statLabel}>Meals</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.joinDate}</Text>
              <Text style={styles.statLabel}>Member Since</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {/* Trigger List */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setTriggersOpen(true)}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="warning" size={22} color="#ef4444" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Trigger List</Text>
              <Text style={styles.menuSubtitle}>Foods to avoid</Text>
            </View>
            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>{triggers.length}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Progress/Charts */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setProgressOpen(true)}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="trending-up" size={22} color="#3b82f6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Progress</Text>
              <Text style={styles.menuSubtitle}>Charts & analytics</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Education */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Learn')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#ede9fe' }]}>
              <Ionicons name="book" size={22} color="#8b5cf6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Education</Text>
              <Text style={styles.menuSubtitle}>Learn the protocol</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setSettingsOpen(true)}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#f3f4f6' }]}>
              <Ionicons name="settings" size={22} color="#6b7280" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Settings</Text>
              <Text style={styles.menuSubtitle}>Preferences & account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="download" size={20} color="#3b82f6" />
            <Text style={styles.quickActionText}>Export Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="help-circle" size={20} color="#3b82f6" />
            <Text style={styles.quickActionText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>CBI - The Dowd Protocol</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Triggers Panel */}
      <Panel
        isOpen={triggersOpen}
        onClose={() => setTriggersOpen(false)}
        title="Your Triggers"
      >
        <Text style={styles.panelSubtitle}>
          Foods and ingredients that may cause symptoms
        </Text>

        {triggers.map((trigger, idx) => (
          <View key={idx} style={styles.triggerItem}>
            <View style={styles.triggerInfo}>
              <View
                style={[
                  styles.triggerSeverity,
                  {
                    backgroundColor:
                      trigger.severity === 'high' ? '#fee2e2' : '#fef3c7',
                  },
                ]}
              >
                <Ionicons
                  name={trigger.severity === 'high' ? 'alert-circle' : 'warning'}
                  size={16}
                  color={trigger.severity === 'high' ? '#ef4444' : '#f59e0b'}
                />
              </View>
              <View>
                <Text style={styles.triggerName}>{trigger.name}</Text>
                <Text style={styles.triggerCategory}>{trigger.category}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="close-circle" size={22} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addTriggerButton}>
          <Ionicons name="add" size={20} color="#3b82f6" />
          <Text style={styles.addTriggerText}>Add Trigger</Text>
        </TouchableOpacity>
      </Panel>

      {/* Progress Panel */}
      <Panel
        isOpen={progressOpen}
        onClose={() => setProgressOpen(false)}
        title="Your Progress"
      >
        {/* Stats Grid */}
        <View style={styles.progressStatsGrid}>
          <View style={styles.progressStat}>
            <Ionicons name="flame" size={24} color="#f59e0b" />
            <Text style={styles.progressStatValue}>{stats.streak}</Text>
            <Text style={styles.progressStatLabel}>Day Streak</Text>
          </View>
          <View style={styles.progressStat}>
            <Ionicons name="restaurant" size={24} color="#3b82f6" />
            <Text style={styles.progressStatValue}>{stats.totalMeals}</Text>
            <Text style={styles.progressStatLabel}>Total Meals</Text>
          </View>
          <View style={styles.progressStat}>
            <Ionicons name="trending-up" size={24} color="#10b981" />
            <Text style={styles.progressStatValue}>+{stats.weekAverage}</Text>
            <Text style={styles.progressStatLabel}>Avg Score</Text>
          </View>
          <View style={styles.progressStat}>
            <Ionicons name="trophy" size={24} color="#8b5cf6" />
            <Text style={styles.progressStatValue}>+{stats.bestDay}</Text>
            <Text style={styles.progressStatLabel}>Best Day</Text>
          </View>
        </View>

        {/* Weekly Chart */}
        <Text style={styles.chartTitle}>This Week</Text>
        <View style={styles.chart}>
          {weeklyData.map((data, idx) => (
            <View key={idx} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${(data.score / maxScore) * 100}%`,
                      backgroundColor:
                        data.score >= 12
                          ? '#10b981'
                          : data.score >= 8
                          ? '#3b82f6'
                          : '#f59e0b',
                    },
                  ]}
                />
              </View>
              <Text style={styles.barScore}>+{data.score}</Text>
              <Text style={styles.barLabel}>{data.day}</Text>
            </View>
          ))}
        </View>
      </Panel>

      {/* Settings Panel */}
      <Panel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Settings"
      >
        {/* Health Profile */}
        <Text style={styles.settingsSectionTitle}>Health Profile</Text>
        <TouchableOpacity style={styles.settingsCard}>
          <Ionicons name="medical" size={22} color="#ef4444" />
          <View style={styles.settingsCardContent}>
            <Text style={styles.settingsCardLabel}>Primary Condition</Text>
            <Text style={styles.settingsCardValue}>{user.condition}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Notifications */}
        <Text style={styles.settingsSectionTitle}>Notifications</Text>
        <View style={styles.settingsToggleCard}>
          <View style={styles.settingToggle}>
            <View style={styles.settingToggleInfo}>
              <Ionicons name="notifications" size={20} color="#3b82f6" />
              <Text style={styles.settingToggleLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(value) => updateSettings({ notificationsEnabled: value })}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={settings.notificationsEnabled ? '#3b82f6' : '#f3f4f6'}
            />
          </View>
          <View style={styles.settingsDivider} />
          <View style={styles.settingToggle}>
            <View style={styles.settingToggleInfo}>
              <Ionicons name="alarm" size={20} color="#8b5cf6" />
              <Text style={styles.settingToggleLabel}>Meal Reminders</Text>
            </View>
            <Switch
              value={settings.remindersEnabled}
              onValueChange={(value) => updateSettings({ remindersEnabled: value })}
              trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
              thumbColor={settings.remindersEnabled ? '#8b5cf6' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Account Actions */}
        <Text style={styles.settingsSectionTitle}>Account</Text>
        <TouchableOpacity style={styles.settingsMenuItem}>
          <Ionicons name="calendar" size={20} color="#6b7280" />
          <Text style={styles.settingsMenuText}>Fasting Schedule</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsMenuItem}>
          <Ionicons name="information-circle" size={20} color="#6b7280" />
          <Text style={styles.settingsMenuText}>About CBI</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingsMenuItem, styles.logoutItem]}>
          <Ionicons name="log-out" size={20} color="#ef4444" />
          <Text style={[styles.settingsMenuText, styles.logoutText]}>Log Out</Text>
        </TouchableOpacity>
      </Panel>
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
    backgroundColor: '#1e3a8a',
    padding: 32,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  menuSection: {
    padding: 16,
    gap: 12,
  },
  menuItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  menuBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  menuBadgeText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 8,
  },
  quickAction: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  footer: {
    alignItems: 'center',
    padding: 32,
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
  // Panel Styles
  panelSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  triggerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  triggerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  triggerSeverity: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  triggerCategory: {
    fontSize: 13,
    color: '#6b7280',
  },
  addTriggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderStyle: 'dashed',
    borderRadius: 10,
    marginTop: 10,
    gap: 8,
  },
  addTriggerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b82f6',
  },
  // Progress Panel Styles
  progressStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  progressStat: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  progressStatValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: '70%',
    height: 100,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barScore: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  barLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  // Settings Panel Styles
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 8,
  },
  settingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 10,
    gap: 12,
    marginBottom: 16,
  },
  settingsCardContent: {
    flex: 1,
  },
  settingsCardLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  settingsCardValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  settingsToggleCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  settingToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  settingToggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingToggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
  settingsDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 12,
  },
  settingsMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 10,
    gap: 12,
    marginBottom: 8,
  },
  settingsMenuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
  logoutItem: {
    marginTop: 8,
  },
  logoutText: {
    color: '#ef4444',
  },
});

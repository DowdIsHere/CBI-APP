import React from 'react';
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

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [remindersEnabled, setRemindersEnabled] = React.useState(true);

  const userProfile = {
    name: 'John Doe',
    email: 'john@example.com',
    condition: 'Multiple Sclerosis',
    joinDate: 'Jan 2025',
    totalMeals: 45,
    streak: 7,
  };

  const allergies = ['Shellfish', 'Tree Nuts'];
  const sensitivities = ['Nightshades', 'Dairy', 'Gluten'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userProfile.name.charAt(0)}
            </Text>
          </View>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userEmail}>{userProfile.email}</Text>
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
        </View>

        {/* Health Condition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Profile</Text>
          <TouchableOpacity style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Ionicons name="medical" size={24} color="#ef4444" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Primary Condition</Text>
                <Text style={styles.infoValue}>{userProfile.condition}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Allergies & Sensitivities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Restrictions</Text>

          <View style={styles.restrictionsCard}>
            <View style={styles.restrictionSection}>
              <Text style={styles.restrictionTitle}>Allergies</Text>
              <View style={styles.tagsContainer}>
                {allergies.map((allergy, idx) => (
                  <View key={idx} style={[styles.tag, styles.allergyTag]}>
                    <Text style={styles.allergyTagText}>{allergy}</Text>
                    <Ionicons name="close-circle" size={16} color="#dc2626" />
                  </View>
                ))}
                <TouchableOpacity style={styles.addTag}>
                  <Ionicons name="add" size={16} color="#6b7280" />
                  <Text style={styles.addTagText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.restrictionSection}>
              <Text style={styles.restrictionTitle}>Sensitivities</Text>
              <View style={styles.tagsContainer}>
                {sensitivities.map((sensitivity, idx) => (
                  <View key={idx} style={[styles.tag, styles.sensitivityTag]}>
                    <Text style={styles.sensitivityTagText}>
                      {sensitivity}
                    </Text>
                    <Ionicons name="close-circle" size={16} color="#ea580c" />
                  </View>
                ))}
                <TouchableOpacity style={styles.addTag}>
                  <Ionicons name="add" size={16} color="#6b7280" />
                  <Text style={styles.addTagText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={20} color="#3b82f6" />
                <Text style={styles.settingLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={notificationsEnabled ? '#3b82f6' : '#f3f4f6'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="alarm" size={20} color="#8b5cf6" />
                <Text style={styles.settingLabel}>Meal Reminders</Text>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={setRemindersEnabled}
                trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                thumbColor={remindersEnabled ? '#8b5cf6' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="calendar" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Fasting Schedule</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="download" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Export Data</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>About CBI</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
            <Ionicons name="log-out" size={20} color="#ef4444" />
            <Text style={[styles.menuItemText, styles.logoutText]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  restrictionsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  restrictionSection: {
    gap: 12,
  },
  restrictionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  allergyTag: {
    backgroundColor: '#fee2e2',
  },
  allergyTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#dc2626',
  },
  sensitivityTag: {
    backgroundColor: '#ffedd5',
  },
  sensitivityTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ea580c',
  },
  addTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    gap: 4,
  },
  addTagText: {
    fontSize: 13,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  settingsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  menuItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  logoutItem: {
    marginTop: 16,
  },
  logoutText: {
    color: '#ef4444',
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
});

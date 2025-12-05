import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const { stats } = useApp();

  const handleToggleNotifications = async (value: boolean) => {
    await updateProfile({ notificationsEnabled: value });
  };

  const handleToggleReminders = async (value: boolean) => {
    await updateProfile({ remindersEnabled: value });
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleAddAllergy = () => {
    Alert.prompt(
      'Add Allergy',
      'Enter the allergy to add:',
      async (text) => {
        if (text && user) {
          const allergies = [...(user.allergies || []), text];
          await updateProfile({ allergies });
        }
      }
    );
  };

  const handleAddSensitivity = () => {
    Alert.prompt(
      'Add Sensitivity',
      'Enter the food sensitivity to add:',
      async (text) => {
        if (text && user) {
          const sensitivities = [...(user.sensitivities || []), text];
          await updateProfile({ sensitivities });
        }
      }
    );
  };

  const handleRemoveAllergy = async (allergy: string) => {
    if (user) {
      const allergies = user.allergies.filter((a) => a !== allergy);
      await updateProfile({ allergies });
    }
  };

  const handleRemoveSensitivity = async (sensitivity: string) => {
    if (user) {
      const sensitivities = user.sensitivities.filter((s) => s !== sensitivity);
      await updateProfile({ sensitivities });
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
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
              <Text style={styles.statValue}>{user.joinDate?.split('-')[0] || 'N/A'}</Text>
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
                <Text style={styles.infoValue}>
                  {user.condition || 'Not specified'}
                </Text>
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
                {user.allergies && user.allergies.length > 0 ? (
                  user.allergies.map((allergy, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.tag, styles.allergyTag]}
                      onPress={() => handleRemoveAllergy(allergy)}
                    >
                      <Text style={styles.allergyTagText}>{allergy}</Text>
                      <Ionicons name="close-circle" size={16} color="#dc2626" />
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noItemsText}>No allergies added</Text>
                )}
                <TouchableOpacity style={styles.addTag} onPress={handleAddAllergy}>
                  <Ionicons name="add" size={16} color="#6b7280" />
                  <Text style={styles.addTagText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.restrictionSection}>
              <Text style={styles.restrictionTitle}>Sensitivities</Text>
              <View style={styles.tagsContainer}>
                {user.sensitivities && user.sensitivities.length > 0 ? (
                  user.sensitivities.map((sensitivity, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.tag, styles.sensitivityTag]}
                      onPress={() => handleRemoveSensitivity(sensitivity)}
                    >
                      <Text style={styles.sensitivityTagText}>
                        {sensitivity}
                      </Text>
                      <Ionicons name="close-circle" size={16} color="#ea580c" />
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noItemsText}>No sensitivities added</Text>
                )}
                <TouchableOpacity style={styles.addTag} onPress={handleAddSensitivity}>
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
                value={user.notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={user.notificationsEnabled ? '#3b82f6' : '#f3f4f6'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="alarm" size={20} color="#8b5cf6" />
                <Text style={styles.settingLabel}>Meal Reminders</Text>
              </View>
              <Switch
                value={user.remindersEnabled}
                onValueChange={handleToggleReminders}
                trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                thumbColor={user.remindersEnabled ? '#8b5cf6' : '#f3f4f6'}
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

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center',
  },
  noItemsText: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
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

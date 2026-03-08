import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getProfile, saveProfile, getMeals, getStreak } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    condition: '',
    joinDate: '',
    allergies: [],
    sensitivities: [],
  });
  const [totalMeals, setTotalMeals] = useState(0);
  const [streak, setStreakCount] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<'name' | 'email' | 'condition' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [addTagModal, setAddTagModal] = useState<'allergies' | 'sensitivities' | null>(null);
  const [newTagValue, setNewTagValue] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const p = await getProfile();
    setProfile(p);

    const meals = await getMeals();
    setTotalMeals(meals.length);

    const s = await getStreak();
    setStreakCount(s);
  };

  const openEditModal = (field: 'name' | 'email' | 'condition') => {
    setEditField(field);
    setEditValue(profile[field]);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (!editField) return;
    const updated = { ...profile, [editField]: editValue.trim() };
    await saveProfile(updated);
    setProfile(updated);
    setEditModalVisible(false);
  };

  const addTag = async () => {
    if (!addTagModal || !newTagValue.trim()) return;
    const updated = {
      ...profile,
      [addTagModal]: [...profile[addTagModal], newTagValue.trim()],
    };
    await saveProfile(updated);
    setProfile(updated);
    setNewTagValue('');
    setAddTagModal(null);
  };

  const removeTag = async (type: 'allergies' | 'sensitivities', index: number) => {
    const updated = {
      ...profile,
      [type]: profile[type].filter((_, i) => i !== index),
    };
    await saveProfile(updated);
    setProfile(updated);
  };

  const displayName = profile.name || 'Set Your Name';
  const displayEmail = profile.email || 'Set your email';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => openEditModal('name')}>
            <Text style={styles.userName}>{displayName}</Text>
            {!profile.name && (
              <Text style={styles.tapToEdit}>Tap to set</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openEditModal('email')}>
            <Text style={styles.userEmail}>{displayEmail}</Text>
          </TouchableOpacity>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalMeals}</Text>
              <Text style={styles.statLabel}>Meals</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.joinDate || '-'}</Text>
              <Text style={styles.statLabel}>Member Since</Text>
            </View>
          </View>
        </View>

        {/* Health Condition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Profile</Text>
          <TouchableOpacity
            style={styles.infoCard}
            onPress={() => openEditModal('condition')}
          >
            <View style={styles.infoContent}>
              <Ionicons name="medical" size={24} color="#ef4444" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Primary Condition</Text>
                <Text style={styles.infoValue}>
                  {profile.condition || 'Tap to set'}
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
                {profile.allergies.map((allergy, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.tag, styles.allergyTag]}
                    onPress={() => {
                      Alert.alert('Remove Allergy', `Remove "${allergy}"?`, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Remove', style: 'destructive', onPress: () => removeTag('allergies', idx) },
                      ]);
                    }}
                  >
                    <Text style={styles.allergyTagText}>{allergy}</Text>
                    <Ionicons name="close-circle" size={16} color="#dc2626" />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.addTag}
                  onPress={() => setAddTagModal('allergies')}
                >
                  <Ionicons name="add" size={16} color="#6b7280" />
                  <Text style={styles.addTagText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.restrictionSection}>
              <Text style={styles.restrictionTitle}>Sensitivities</Text>
              <View style={styles.tagsContainer}>
                {profile.sensitivities.map((sensitivity, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.tag, styles.sensitivityTag]}
                    onPress={() => {
                      Alert.alert('Remove Sensitivity', `Remove "${sensitivity}"?`, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Remove', style: 'destructive', onPress: () => removeTag('sensitivities', idx) },
                      ]);
                    }}
                  >
                    <Text style={styles.sensitivityTagText}>
                      {sensitivity}
                    </Text>
                    <Ionicons name="close-circle" size={16} color="#ea580c" />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.addTag}
                  onPress={() => setAddTagModal('sensitivities')}
                >
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
        </View>

        {/* Cloud Status */}
        {user && (
          <View style={styles.section}>
            <View style={styles.cloudStatusCard}>
              <Ionicons name="cloud-done" size={20} color="#10b981" />
              <View style={{ flex: 1 }}>
                <Text style={styles.cloudStatusText}>Cloud Sync Active</Text>
                <Text style={styles.cloudStatusEmail}>{user.email}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => {
              Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: signOut },
              ]);
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>CBI - The Dowd Protocol</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Field Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editField === 'name' ? 'Your Name' : editField === 'email' ? 'Email Address' : 'Health Condition'}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={
                editField === 'name' ? 'Enter your name' :
                editField === 'email' ? 'Enter your email' :
                'e.g., IBS, Multiple Sclerosis, General Wellness'
              }
              placeholderTextColor="#9ca3af"
              autoFocus
              keyboardType={editField === 'email' ? 'email-address' : 'default'}
              autoCapitalize={editField === 'email' ? 'none' : 'words'}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={saveEdit}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Tag Modal */}
      <Modal visible={addTagModal !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Add {addTagModal === 'allergies' ? 'Allergy' : 'Sensitivity'}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={newTagValue}
              onChangeText={setNewTagValue}
              placeholder={
                addTagModal === 'allergies'
                  ? 'e.g., Shellfish, Peanuts'
                  : 'e.g., Dairy, Gluten, Nightshades'
              }
              placeholderTextColor="#9ca3af"
              autoFocus
              autoCapitalize="words"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => { setAddTagModal(null); setNewTagValue(''); }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={addTag}>
                <Text style={styles.modalSaveText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    textAlign: 'center',
  },
  tapToEdit: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
    textAlign: 'center',
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
  cloudStatusCard: {
    backgroundColor: '#ecfdf5',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  cloudStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#047857',
  },
  cloudStatusEmail: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  signOutButton: {
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 8,
    fontSize: 15,
    color: '#1f2937',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalSaveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});

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
  Share,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile, saveProfile, getMeals, getStreak } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types';
import {
  getNotificationPreferences,
  updateNotificationSettings,
  NotificationPreferences,
} from '../services/notifications';

const FASTING_SCHEDULE_KEY = 'cbi_fasting_schedule';

const FASTING_WINDOWS = [
  {
    id: '12:12',
    label: '12:12',
    eating: '12 hours',
    fasting: '12 hours',
    description:
      'Beginner-friendly. Eat within a 12-hour window (e.g., 7 AM - 7 PM). Allows overnight gut repair and gentle autophagy activation.',
    difficulty: 'Easy',
  },
  {
    id: '14:10',
    label: '14:10',
    eating: '10 hours',
    fasting: '14 hours',
    description:
      'Moderate schedule. Eat within a 10-hour window (e.g., 8 AM - 6 PM). Improved fat burning and enhanced gut lining repair.',
    difficulty: 'Easy',
  },
  {
    id: '16:8',
    label: '16:8',
    eating: '8 hours',
    fasting: '16 hours',
    description:
      'Most popular. Eat within an 8-hour window (e.g., 10 AM - 6 PM). Significant autophagy, improved insulin sensitivity, and reduced inflammation.',
    difficulty: 'Moderate',
  },
  {
    id: '18:6',
    label: '18:6',
    eating: '6 hours',
    fasting: '18 hours',
    description:
      'Advanced schedule. Eat within a 6-hour window (e.g., 12 PM - 6 PM). Deep autophagy, enhanced mitochondrial function, and strong anti-inflammatory effects.',
    difficulty: 'Advanced',
  },
  {
    id: '20:4',
    label: '20:4',
    eating: '4 hours',
    fasting: '20 hours',
    description:
      'Warrior diet. Eat within a 4-hour window (e.g., 2 PM - 6 PM). Maximum cellular cleanup but requires careful nutrient planning.',
    difficulty: 'Expert',
  },
];

const FAQ_ITEMS = [
  {
    question: 'How do I log a meal?',
    answer:
      'Tap the "+" button on the home screen or go to the Meal Entry tab. You can use Photo AI, Barcode Scanner, Batch Scan, or Manual Entry to log your meals.',
  },
  {
    question: 'What do the scores mean?',
    answer:
      'Each food is scored from -3 to +3 based on its impact on your ENS (gut), CNS (brain), and mitochondria. Positive scores are beneficial; negative scores indicate inflammatory or harmful foods. Aim for +10 or higher per day.',
  },
  {
    question: 'How does photo analysis work?',
    answer:
      'Our AI analyzes your meal photo to identify individual food items, estimate portions, and calculate inflammation scores based on the Dowd Protocol database.',
  },
  {
    question: 'Can I edit or delete a logged meal?',
    answer:
      'Yes. Go to your Progress tab, find the meal you want to modify, and swipe left to delete it or tap to view details.',
  },
  {
    question: 'What is the Dowd Protocol?',
    answer:
      'The Dowd Protocol is a science-based nutritional framework developed by Dr. Dowd that scores foods based on their impact on your three biological intelligence systems: Enteric Nervous System (gut), Central Nervous System (brain), and Cellular energy (mitochondria).',
  },
  {
    question: 'Is my data private?',
    answer:
      'Yes. Your meal data is stored securely and is only accessible to you. We use Supabase with row-level security to ensure your data is protected.',
  },
];

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

  // Menu modal states
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [fastingModalVisible, setFastingModalVisible] = useState(false);
  const [selectedFastingWindow, setSelectedFastingWindow] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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

    const notifPrefs = await getNotificationPreferences();
    setNotificationsEnabled(notifPrefs.notificationsEnabled);
    setRemindersEnabled(notifPrefs.mealRemindersEnabled);

    // Load saved fasting schedule
    try {
      const saved = await AsyncStorage.getItem(FASTING_SCHEDULE_KEY);
      if (saved) setSelectedFastingWindow(saved);
    } catch {}
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

  const handleToggleNotifications = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    const newPrefs: NotificationPreferences = {
      notificationsEnabled: enabled,
      mealRemindersEnabled: enabled ? remindersEnabled : false,
    };
    if (!enabled) {
      setRemindersEnabled(false);
    }
    await updateNotificationSettings(newPrefs);
  };

  const handleToggleReminders = async (enabled: boolean) => {
    setRemindersEnabled(enabled);
    const newPrefs: NotificationPreferences = {
      notificationsEnabled: notificationsEnabled,
      mealRemindersEnabled: enabled,
    };
    await updateNotificationSettings(newPrefs);
  };

  const handleExportData = async () => {
    try {
      const meals = await getMeals();
      if (meals.length === 0) {
        Alert.alert('No Data', 'You have no meal history to export yet.');
        return;
      }

      const exportData = {
        exported_at: new Date().toISOString(),
        profile: {
          name: profile.name,
          condition: profile.condition,
          allergies: profile.allergies,
          sensitivities: profile.sensitivities,
        },
        total_meals: meals.length,
        meals: meals.map((meal) => ({
          name: meal.name,
          date: meal.date,
          time: meal.time,
          score: meal.totalScore,
          method: meal.method,
          items: meal.items,
        })),
      };

      const jsonString = JSON.stringify(exportData, null, 2);

      await Share.share({
        message: jsonString,
        title: 'CBI Meal History Export',
      });
    } catch (error) {
      if ((error as Error).message !== 'User did not share') {
        Alert.alert('Export Failed', 'Could not export your data. Please try again.');
      }
    }
  };

  const handleSelectFastingWindow = async (windowId: string) => {
    setSelectedFastingWindow(windowId);
    try {
      await AsyncStorage.setItem(FASTING_SCHEDULE_KEY, windowId);
    } catch {}
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
                onValueChange={handleToggleNotifications}
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
                onValueChange={handleToggleReminders}
                disabled={!notificationsEnabled}
                trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                thumbColor={remindersEnabled ? '#8b5cf6' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setFastingModalVisible(true)}
          >
            <Ionicons name="calendar" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Fasting Schedule</Text>
            {selectedFastingWindow && (
              <Text style={styles.menuItemBadge}>{selectedFastingWindow}</Text>
            )}
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleExportData}
          >
            <Ionicons name="download" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Export Data</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setExpandedFaq(null);
              setHelpModalVisible(true);
            }}
          >
            <Ionicons name="help-circle" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setAboutModalVisible(true)}
          >
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

      {/* About CBI Modal */}
      <Modal
        visible={aboutModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.fullModalContainer}>
          <View style={styles.fullModalHeader}>
            <TouchableOpacity onPress={() => setAboutModalVisible(false)}>
              <Ionicons name="close" size={28} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.fullModalHeaderTitle}>About CBI</Text>
            <View style={{ width: 28 }} />
          </View>
          <ScrollView style={styles.fullModalContent}>
            <View style={styles.aboutLogoSection}>
              <View style={styles.aboutLogoCircle}>
                <Text style={styles.aboutLogoText}>CBI</Text>
              </View>
              <Text style={styles.aboutAppName}>CBI - The Dowd Protocol</Text>
              <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>What is CBI?</Text>
              <Text style={styles.aboutParagraph}>
                Cellular Biology Intelligence (CBI) is a revolutionary approach
                to nutrition that scores foods based on their impact on your
                three biological intelligence systems:
              </Text>
              <View style={styles.aboutSystemRow}>
                <View style={[styles.aboutSystemDot, { backgroundColor: '#3b82f6' }]} />
                <Text style={styles.aboutSystemText}>
                  Enteric Nervous System (ENS) - Your gut's "second brain"
                </Text>
              </View>
              <View style={styles.aboutSystemRow}>
                <View style={[styles.aboutSystemDot, { backgroundColor: '#8b5cf6' }]} />
                <Text style={styles.aboutSystemText}>
                  Central Nervous System (CNS) - Your brain and cognition
                </Text>
              </View>
              <View style={styles.aboutSystemRow}>
                <View style={[styles.aboutSystemDot, { backgroundColor: '#10b981' }]} />
                <Text style={styles.aboutSystemText}>
                  Mitochondria - Your cellular energy producers
                </Text>
              </View>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>The Dowd Protocol</Text>
              <Text style={styles.aboutParagraph}>
                Developed by Dr. Dowd, the protocol provides a science-based
                framework for understanding how every food you eat either
                enhances or impairs your body's natural intelligence systems.
                Unlike calorie counting, CBI focuses on the biological impact
                of food at the cellular level.
              </Text>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>Links</Text>
              <TouchableOpacity
                style={styles.aboutLinkRow}
                onPress={() => Linking.openURL('https://thedowdprotocol.com')}
              >
                <Ionicons name="globe-outline" size={20} color="#3b82f6" />
                <Text style={styles.aboutLinkText}>Visit Our Website</Text>
                <Ionicons name="open-outline" size={16} color="#9ca3af" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.aboutLinkRow}
                onPress={() => Linking.openURL('https://thedowdprotocol.com/privacy')}
              >
                <Ionicons name="shield-outline" size={20} color="#3b82f6" />
                <Text style={styles.aboutLinkText}>Privacy Policy</Text>
                <Ionicons name="open-outline" size={16} color="#9ca3af" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.aboutLinkRow}
                onPress={() => Linking.openURL('https://thedowdprotocol.com/terms')}
              >
                <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
                <Text style={styles.aboutLinkText}>Terms of Service</Text>
                <Ionicons name="open-outline" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Help & Support Modal */}
      <Modal
        visible={helpModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.fullModalContainer}>
          <View style={styles.fullModalHeader}>
            <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
              <Ionicons name="close" size={28} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.fullModalHeaderTitle}>Help & Support</Text>
            <View style={{ width: 28 }} />
          </View>
          <ScrollView style={styles.fullModalContent}>
            <Text style={styles.helpSectionTitle}>Frequently Asked Questions</Text>
            {FAQ_ITEMS.map((faq, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.helpFaqCard}
                onPress={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                activeOpacity={0.7}
              >
                <View style={styles.helpFaqHeader}>
                  <Text style={styles.helpFaqQuestion}>{faq.question}</Text>
                  <Ionicons
                    name={expandedFaq === idx ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#6b7280"
                  />
                </View>
                {expandedFaq === idx && (
                  <Text style={styles.helpFaqAnswer}>{faq.answer}</Text>
                )}
              </TouchableOpacity>
            ))}

            <View style={styles.helpContactSection}>
              <Text style={styles.helpSectionTitle}>Still need help?</Text>
              <Text style={styles.helpContactDescription}>
                Our support team is here to assist you with any questions or
                issues you may have.
              </Text>
              <TouchableOpacity
                style={styles.helpContactButton}
                onPress={() =>
                  Linking.openURL(
                    'mailto:support@thedowdprotocol.com?subject=CBI%20App%20Support%20Request'
                  )
                }
              >
                <Ionicons name="mail" size={20} color="white" />
                <Text style={styles.helpContactButtonText}>Contact Us</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Fasting Schedule Modal */}
      <Modal
        visible={fastingModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.fullModalContainer}>
          <View style={styles.fullModalHeader}>
            <TouchableOpacity onPress={() => setFastingModalVisible(false)}>
              <Ionicons name="close" size={28} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.fullModalHeaderTitle}>Fasting Schedule</Text>
            <View style={{ width: 28 }} />
          </View>
          <ScrollView style={styles.fullModalContent}>
            <Text style={styles.fastingIntro}>
              Time-restricted eating gives your ENS time to rest and repair.
              Select your preferred fasting window below.
            </Text>

            {FASTING_WINDOWS.map((window) => {
              const isSelected = selectedFastingWindow === window.id;
              return (
                <TouchableOpacity
                  key={window.id}
                  style={[
                    styles.fastingCard,
                    isSelected && styles.fastingCardSelected,
                  ]}
                  onPress={() => handleSelectFastingWindow(window.id)}
                >
                  <View style={styles.fastingCardHeader}>
                    <View style={styles.fastingCardTitleRow}>
                      <Text
                        style={[
                          styles.fastingCardTitle,
                          isSelected && styles.fastingCardTitleSelected,
                        ]}
                      >
                        {window.label}
                      </Text>
                      <View
                        style={[
                          styles.fastingDifficultyBadge,
                          {
                            backgroundColor:
                              window.difficulty === 'Easy'
                                ? '#d1fae5'
                                : window.difficulty === 'Moderate'
                                ? '#dbeafe'
                                : window.difficulty === 'Advanced'
                                ? '#fef3c7'
                                : '#fee2e2',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.fastingDifficultyText,
                            {
                              color:
                                window.difficulty === 'Easy'
                                  ? '#047857'
                                  : window.difficulty === 'Moderate'
                                  ? '#1e40af'
                                  : window.difficulty === 'Advanced'
                                  ? '#92400e'
                                  : '#dc2626',
                            },
                          ]}
                        >
                          {window.difficulty}
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                    )}
                  </View>
                  <View style={styles.fastingTimesRow}>
                    <Text style={styles.fastingTimeLabel}>
                      Eating: {window.eating}
                    </Text>
                    <Text style={styles.fastingTimeSeparator}>|</Text>
                    <Text style={styles.fastingTimeLabel}>
                      Fasting: {window.fasting}
                    </Text>
                  </View>
                  <Text style={styles.fastingDescription}>
                    {window.description}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
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
  menuItemBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3b82f6',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
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
  // Inline edit modal styles
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
  // Full-screen modal styles
  fullModalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  fullModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  fullModalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  fullModalContent: {
    flex: 1,
    padding: 20,
  },
  // About CBI styles
  aboutLogoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  aboutLogoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  aboutLogoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  aboutAppName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    color: '#6b7280',
  },
  aboutSection: {
    marginBottom: 24,
  },
  aboutSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  aboutParagraph: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
    marginBottom: 12,
  },
  aboutSystemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    paddingLeft: 4,
  },
  aboutSystemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  aboutSystemText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  aboutLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  aboutLinkText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  // Help & Support styles
  helpSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  helpFaqCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  helpFaqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpFaqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  helpFaqAnswer: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  helpContactSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  helpContactDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  helpContactButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  helpContactButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  // Fasting Schedule styles
  fastingIntro: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
    marginBottom: 20,
  },
  fastingCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  fastingCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  fastingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fastingCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fastingCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  fastingCardTitleSelected: {
    color: '#1e40af',
  },
  fastingDifficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  fastingDifficultyText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  fastingTimesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  fastingTimeLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  fastingTimeSeparator: {
    fontSize: 13,
    color: '#d1d5db',
  },
  fastingDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
});

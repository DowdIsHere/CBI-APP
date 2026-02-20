import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Panel from '../components/panels/Panel';
import { useAppData } from '../data/AppContext';
import { Trigger, FastingSchedule } from '../data/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CONDITIONS = [
  'Multiple Sclerosis',
  'Crohn\'s Disease',
  'Ulcerative Colitis',
  'Rheumatoid Arthritis',
  'Psoriasis',
  'Hashimoto\'s Thyroiditis',
  'Lupus',
  'General Wellness',
  'Other',
];

// Common trigger suggestions
const TRIGGER_SUGGESTIONS = [
  { name: 'Gluten', category: 'Food Group' as const },
  { name: 'Dairy', category: 'Food Group' as const },
  { name: 'Nightshades', category: 'Food Group' as const },
  { name: 'Eggs', category: 'Food Group' as const },
  { name: 'Soy', category: 'Food Group' as const },
  { name: 'Corn', category: 'Food Group' as const },
  { name: 'Peanuts', category: 'Allergy' as const },
  { name: 'Tree Nuts', category: 'Allergy' as const },
  { name: 'Shellfish', category: 'Allergy' as const },
  { name: 'Fish', category: 'Allergy' as const },
  { name: 'Sulfites', category: 'Sensitivity' as const },
  { name: 'Histamines', category: 'Sensitivity' as const },
  { name: 'FODMAPs', category: 'Sensitivity' as const },
  { name: 'Caffeine', category: 'Sensitivity' as const },
];

export default function YouScreen({ navigation }: any) {
  const [triggersOpen, setTriggersOpen] = useState(false);
  const [addTriggerOpen, setAddTriggerOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [fastingOpen, setFastingOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Trigger form state
  const [customTriggerName, setCustomTriggerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Trigger['category']>('Food Group');
  const [selectedSeverity, setSelectedSeverity] = useState<Trigger['severity']>('medium');

  // Profile form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCondition, setEditCondition] = useState('');

  // Fasting form state
  const [fastingEnabled, setFastingEnabled] = useState(false);
  const [fastingStart, setFastingStart] = useState('20:00');
  const [fastingEnd, setFastingEnd] = useState('12:00');
  const [fastingDays, setFastingDays] = useState<string[]>([]);

  const { data, getWeeklyStats, addTrigger, removeTrigger, updateProfile, updateSettings } = useAppData();
  const { user, stats, triggers, settings } = data;

  const weeklyData = getWeeklyStats();
  const maxScore = Math.max(...weeklyData.map((d) => d.score), 1);

  // Sync profile form when opening
  useEffect(() => {
    if (editProfileOpen) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditCondition(user.condition);
    }
  }, [editProfileOpen]);

  // Sync fasting form when opening
  useEffect(() => {
    if (fastingOpen && settings.fastingSchedule) {
      setFastingEnabled(settings.fastingSchedule.enabled);
      setFastingStart(settings.fastingSchedule.startTime);
      setFastingEnd(settings.fastingSchedule.endTime);
      setFastingDays(settings.fastingSchedule.days);
    }
  }, [fastingOpen]);

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }
    updateProfile({
      name: editName.trim(),
      email: editEmail.trim(),
      condition: editCondition,
    });
    setEditProfileOpen(false);
    Alert.alert('Profile Updated', 'Your profile has been saved.');
  };

  const handleSaveFasting = () => {
    updateSettings({
      fastingSchedule: {
        enabled: fastingEnabled,
        startTime: fastingStart,
        endTime: fastingEnd,
        days: fastingDays,
      },
    });
    setFastingOpen(false);
    Alert.alert('Fasting Schedule Updated', 'Your fasting schedule has been saved.');
  };

  const toggleFastingDay = (day: string) => {
    if (fastingDays.includes(day)) {
      setFastingDays(fastingDays.filter(d => d !== day));
    } else {
      setFastingDays([...fastingDays, day]);
    }
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const calculateFastingHours = (): number => {
    const [startH] = fastingStart.split(':').map(Number);
    const [endH] = fastingEnd.split(':').map(Number);
    let hours = endH - startH;
    if (hours < 0) hours += 24;
    return 24 - hours; // Eating window is endH - startH, fasting is the rest
  };

  const handleRemoveTrigger = (triggerId: string, triggerName: string) => {
    Alert.alert(
      'Remove Trigger',
      `Are you sure you want to remove "${triggerName}" from your trigger list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeTrigger(triggerId),
        },
      ]
    );
  };

  const handleAddSuggestion = (suggestion: typeof TRIGGER_SUGGESTIONS[0]) => {
    // Check if already exists
    if (triggers.some(t => t.name.toLowerCase() === suggestion.name.toLowerCase())) {
      Alert.alert('Already Added', `${suggestion.name} is already in your trigger list.`);
      return;
    }

    addTrigger({
      name: suggestion.name,
      category: suggestion.category,
      severity: 'medium',
    });
    setAddTriggerOpen(false);
  };

  const handleAddCustomTrigger = () => {
    const name = customTriggerName.trim();
    if (!name) {
      Alert.alert('Enter Name', 'Please enter a trigger name.');
      return;
    }

    if (triggers.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      Alert.alert('Already Added', `${name} is already in your trigger list.`);
      return;
    }

    addTrigger({
      name,
      category: selectedCategory,
      severity: selectedSeverity,
    });
    setCustomTriggerName('');
    setAddTriggerOpen(false);
  };

  // Filter out already-added suggestions
  const availableSuggestions = TRIGGER_SUGGESTIONS.filter(
    s => !triggers.some(t => t.name.toLowerCase() === s.name.toLowerCase())
  );

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
          <Text style={styles.footerText}>JD Mercer Protocol</Text>
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

        {triggers.length === 0 ? (
          <View style={styles.emptyTriggers}>
            <Ionicons name="shield-checkmark-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyTriggersText}>No triggers added yet</Text>
            <Text style={styles.emptyTriggersSubtext}>
              Add foods that cause you symptoms
            </Text>
          </View>
        ) : (
          triggers.map((trigger) => (
            <View key={trigger.id} style={styles.triggerItem}>
              <View style={styles.triggerInfo}>
                <View
                  style={[
                    styles.triggerSeverity,
                    {
                      backgroundColor:
                        trigger.severity === 'high'
                          ? '#fee2e2'
                          : trigger.severity === 'medium'
                          ? '#fef3c7'
                          : '#d1fae5',
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      trigger.severity === 'high'
                        ? 'alert-circle'
                        : trigger.severity === 'medium'
                        ? 'warning'
                        : 'information-circle'
                    }
                    size={16}
                    color={
                      trigger.severity === 'high'
                        ? '#ef4444'
                        : trigger.severity === 'medium'
                        ? '#f59e0b'
                        : '#10b981'
                    }
                  />
                </View>
                <View>
                  <Text style={styles.triggerName}>{trigger.name}</Text>
                  <Text style={styles.triggerCategory}>{trigger.category}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveTrigger(trigger.id, trigger.name)}
              >
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.addTriggerButton}
          onPress={() => {
            setTriggersOpen(false);
            setTimeout(() => setAddTriggerOpen(true), 300);
          }}
        >
          <Ionicons name="add" size={20} color="#3b82f6" />
          <Text style={styles.addTriggerText}>Add Trigger</Text>
        </TouchableOpacity>
      </Panel>

      {/* Add Trigger Panel */}
      <Panel
        isOpen={addTriggerOpen}
        onClose={() => setAddTriggerOpen(false)}
        title="Add Trigger"
      >
        {/* Quick Add Suggestions */}
        <Text style={styles.addTriggerSectionTitle}>Quick Add</Text>
        <View style={styles.suggestionGrid}>
          {availableSuggestions.slice(0, 8).map((suggestion, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.suggestionChip}
              onPress={() => handleAddSuggestion(suggestion)}
            >
              <Text style={styles.suggestionChipText}>{suggestion.name}</Text>
              <Ionicons name="add-circle" size={18} color="#3b82f6" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Trigger */}
        <Text style={styles.addTriggerSectionTitle}>Custom Trigger</Text>
        <TextInput
          style={styles.triggerInput}
          placeholder="Enter trigger name..."
          placeholderTextColor="#9ca3af"
          value={customTriggerName}
          onChangeText={setCustomTriggerName}
        />

        {/* Category Selection */}
        <Text style={styles.addTriggerLabel}>Category</Text>
        <View style={styles.categoryButtons}>
          {(['Food Group', 'Allergy', 'Sensitivity'] as const).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === cat && styles.categoryButtonTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Severity Selection */}
        <Text style={styles.addTriggerLabel}>Severity</Text>
        <View style={styles.severityButtons}>
          {([
            { value: 'low', label: 'Low', color: '#10b981' },
            { value: 'medium', label: 'Medium', color: '#f59e0b' },
            { value: 'high', label: 'High', color: '#ef4444' },
          ] as const).map((sev) => (
            <TouchableOpacity
              key={sev.value}
              style={[
                styles.severityButton,
                selectedSeverity === sev.value && {
                  backgroundColor: sev.color,
                  borderColor: sev.color,
                },
              ]}
              onPress={() => setSelectedSeverity(sev.value)}
            >
              <Text
                style={[
                  styles.severityButtonText,
                  selectedSeverity === sev.value && styles.severityButtonTextActive,
                ]}
              >
                {sev.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={[
            styles.addCustomButton,
            !customTriggerName.trim() && styles.addCustomButtonDisabled,
          ]}
          onPress={handleAddCustomTrigger}
          disabled={!customTriggerName.trim()}
        >
          <Text style={styles.addCustomButtonText}>Add Trigger</Text>
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
        <TouchableOpacity
          style={styles.settingsCard}
          onPress={() => {
            setSettingsOpen(false);
            setTimeout(() => setEditProfileOpen(true), 300);
          }}
        >
          <Ionicons name="person" size={22} color="#3b82f6" />
          <View style={styles.settingsCardContent}>
            <Text style={styles.settingsCardLabel}>Edit Profile</Text>
            <Text style={styles.settingsCardValue}>{user.name}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsCard}>
          <Ionicons name="medical" size={22} color="#ef4444" />
          <View style={styles.settingsCardContent}>
            <Text style={styles.settingsCardLabel}>Primary Condition</Text>
            <Text style={styles.settingsCardValue}>{user.condition}</Text>
          </View>
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
        <TouchableOpacity
          style={styles.settingsMenuItem}
          onPress={() => {
            setSettingsOpen(false);
            setTimeout(() => setFastingOpen(true), 300);
          }}
        >
          <Ionicons name="time" size={20} color="#10b981" />
          <Text style={styles.settingsMenuText}>Fasting Schedule</Text>
          <View style={styles.settingsMenuBadge}>
            <Text style={styles.settingsMenuBadgeText}>
              {settings.fastingSchedule?.enabled ? 'ON' : 'OFF'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsMenuItem}
          onPress={() => {
            setSettingsOpen(false);
            setTimeout(() => setAboutOpen(true), 300);
          }}
        >
          <Ionicons name="information-circle" size={20} color="#6b7280" />
          <Text style={styles.settingsMenuText}>About JD Mercer Protocol</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingsMenuItem, styles.logoutItem]}
          onPress={() => {
            Alert.alert(
              'Log Out',
              'Are you sure you want to log out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: () => {
                  // In a real app, this would clear auth and navigate to login
                  Alert.alert('Logged Out', 'You have been logged out.');
                }},
              ]
            );
          }}
        >
          <Ionicons name="log-out" size={20} color="#ef4444" />
          <Text style={[styles.settingsMenuText, styles.logoutText]}>Log Out</Text>
        </TouchableOpacity>
      </Panel>

      {/* Edit Profile Panel */}
      <Panel
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        title="Edit Profile"
      >
        <Text style={styles.formLabel}>Name</Text>
        <TextInput
          style={styles.formInput}
          value={editName}
          onChangeText={setEditName}
          placeholder="Your name"
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.formLabel}>Email</Text>
        <TextInput
          style={styles.formInput}
          value={editEmail}
          onChangeText={setEditEmail}
          placeholder="your@email.com"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.formLabel}>Primary Condition</Text>
        <View style={styles.conditionGrid}>
          {CONDITIONS.map((condition) => (
            <TouchableOpacity
              key={condition}
              style={[
                styles.conditionChip,
                editCondition === condition && styles.conditionChipActive,
              ]}
              onPress={() => setEditCondition(condition)}
            >
              <Text
                style={[
                  styles.conditionChipText,
                  editCondition === condition && styles.conditionChipTextActive,
                ]}
              >
                {condition}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </Panel>

      {/* Fasting Schedule Panel */}
      <Panel
        isOpen={fastingOpen}
        onClose={() => setFastingOpen(false)}
        title="Fasting Schedule"
      >
        <View style={styles.fastingToggleRow}>
          <View>
            <Text style={styles.fastingToggleLabel}>Intermittent Fasting</Text>
            <Text style={styles.fastingToggleSubtext}>
              {fastingEnabled ? `${calculateFastingHours()}:${24 - calculateFastingHours()} fasting protocol` : 'Currently disabled'}
            </Text>
          </View>
          <Switch
            value={fastingEnabled}
            onValueChange={setFastingEnabled}
            trackColor={{ false: '#d1d5db', true: '#6ee7b7' }}
            thumbColor={fastingEnabled ? '#10b981' : '#f3f4f6'}
          />
        </View>

        {fastingEnabled && (
          <>
            <View style={styles.fastingTimeSection}>
              <Text style={styles.formLabel}>Eating Window</Text>
              <View style={styles.fastingTimeRow}>
                <View style={styles.fastingTimeBox}>
                  <Text style={styles.fastingTimeLabel}>Start Eating</Text>
                  <View style={styles.timePickerRow}>
                    {['08:00', '10:00', '12:00', '14:00'].map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[
                          styles.timeChip,
                          fastingEnd === time && styles.timeChipActive,
                        ]}
                        onPress={() => setFastingEnd(time)}
                      >
                        <Text
                          style={[
                            styles.timeChipText,
                            fastingEnd === time && styles.timeChipTextActive,
                          ]}
                        >
                          {formatTime(time)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.fastingTimeBox}>
                  <Text style={styles.fastingTimeLabel}>Stop Eating</Text>
                  <View style={styles.timePickerRow}>
                    {['18:00', '19:00', '20:00', '21:00'].map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[
                          styles.timeChip,
                          fastingStart === time && styles.timeChipActive,
                        ]}
                        onPress={() => setFastingStart(time)}
                      >
                        <Text
                          style={[
                            styles.timeChipText,
                            fastingStart === time && styles.timeChipTextActive,
                          ]}
                        >
                          {formatTime(time)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.formLabel}>Active Days</Text>
            <View style={styles.daysRow}>
              {DAYS_OF_WEEK.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayChip,
                    fastingDays.includes(day) && styles.dayChipActive,
                  ]}
                  onPress={() => toggleFastingDay(day)}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      fastingDays.includes(day) && styles.dayChipTextActive,
                    ]}
                  >
                    {day.charAt(0)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.fastingSummary}>
              <Ionicons name="time-outline" size={20} color="#10b981" />
              <Text style={styles.fastingSummaryText}>
                Fast for {calculateFastingHours()} hours, eat within {24 - calculateFastingHours()} hours
              </Text>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveFasting}>
          <Text style={styles.saveButtonText}>Save Schedule</Text>
        </TouchableOpacity>
      </Panel>

      {/* About Panel */}
      <Panel
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        title="About"
      >
        <View style={styles.aboutHeader}>
          <View style={styles.aboutLogo}>
            <Text style={styles.aboutLogoText}>JDM</Text>
          </View>
          <Text style={styles.aboutTitle}>JD Mercer Protocol</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutSectionTitle}>The Protocol</Text>
          <Text style={styles.aboutText}>
            The JD Mercer Protocol is a science-based dietary approach focused on optimizing
            cellular biology and supporting the enteric nervous system (ENS) — your "second brain."
          </Text>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutSectionTitle}>Key Principles</Text>
          <View style={styles.aboutList}>
            <View style={styles.aboutListItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              <Text style={styles.aboutListText}>Prioritize ENS-supporting foods</Text>
            </View>
            <View style={styles.aboutListItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              <Text style={styles.aboutListText}>Eliminate inflammatory triggers</Text>
            </View>
            <View style={styles.aboutListItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              <Text style={styles.aboutListText}>Optimize omega-3 to omega-6 ratio</Text>
            </View>
            <View style={styles.aboutListItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              <Text style={styles.aboutListText}>Support mitochondrial function</Text>
            </View>
          </View>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutSectionTitle}>Learn More</Text>
          <TouchableOpacity
            style={styles.aboutLink}
            onPress={() => {
              setAboutOpen(false);
              navigation.navigate('Learn');
            }}
          >
            <Ionicons name="book" size={20} color="#3b82f6" />
            <Text style={styles.aboutLinkText}>Explore the Education Center</Text>
            <Ionicons name="chevron-forward" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        <Text style={styles.aboutFooter}>
          Made with 💙 for cellular health
        </Text>
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
  emptyTriggers: {
    alignItems: 'center',
    padding: 32,
    gap: 8,
  },
  emptyTriggersText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  emptyTriggersSubtext: {
    fontSize: 14,
    color: '#9ca3af',
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
  // Add Trigger Panel Styles
  addTriggerSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 8,
  },
  suggestionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  suggestionChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e40af',
  },
  triggerInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 16,
  },
  addTriggerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  severityButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  severityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  severityButtonTextActive: {
    color: 'white',
  },
  addCustomButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addCustomButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  addCustomButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
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
  settingsMenuBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  settingsMenuBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
  },
  // Form Styles
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  formInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1f2937',
  },
  conditionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  conditionChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  conditionChipActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  conditionChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  conditionChipTextActive: {
    color: '#1d4ed8',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  // Fasting Panel Styles
  fastingToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  fastingToggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  fastingToggleSubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  fastingTimeSection: {
    marginBottom: 16,
  },
  fastingTimeRow: {
    gap: 16,
  },
  fastingTimeBox: {
    marginBottom: 16,
  },
  fastingTimeLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  timePickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeChipActive: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  timeChipTextActive: {
    color: '#059669',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  dayChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayChipActive: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  dayChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  dayChipTextActive: {
    color: '#059669',
  },
  fastingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  fastingSummaryText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  // About Panel Styles
  aboutHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  aboutLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutLogoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    color: '#6b7280',
  },
  aboutSection: {
    marginBottom: 20,
  },
  aboutSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  aboutList: {
    gap: 10,
  },
  aboutListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aboutListText: {
    fontSize: 14,
    color: '#4b5563',
  },
  aboutLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 14,
    borderRadius: 10,
    gap: 10,
  },
  aboutLinkText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#3b82f6',
  },
  aboutFooter: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
});

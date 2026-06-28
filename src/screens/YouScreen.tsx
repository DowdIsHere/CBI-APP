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
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Panel from '../components/panels/Panel';
import { useAppData } from '../data/AppContext';
import { Trigger, FastingSchedule } from '../data/types';
import { exportAndShare, getExportSummary, ExportFormat, ExportScope } from '../services/dataExport';

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

const HEALTH_GOALS = [
  'Reduce inflammation',
  'Increase energy',
  'Better sleep',
  'Weight loss',
  'Gut health',
  'Mental clarity',
  'Pain reduction',
  'Immune support',
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
  const [exportOpen, setExportOpen] = useState(false);

  // Progress view state
  const [progressTimeView, setProgressTimeView] = useState<'week' | 'month' | 'all'>('week');

  // Export state
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
  const [exportScope, setExportScope] = useState<ExportScope>('all');
  const [isExporting, setIsExporting] = useState(false);

  // Trigger form state
  const [customTriggerName, setCustomTriggerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Trigger['category']>('Food Group');
  const [selectedSeverity, setSelectedSeverity] = useState<Trigger['severity']>('medium');

  // Profile form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCondition, setEditCondition] = useState('');
  const [editAvatar, setEditAvatar] = useState<string | undefined>();
  const [editWeight, setEditWeight] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [editGoalWeight, setEditGoalWeight] = useState('');
  const [editHealthGoals, setEditHealthGoals] = useState<string[]>([]);

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
      setEditAvatar(user.avatar);
      setEditWeight(user.weight?.toString() || '');
      setEditHeight(user.height?.toString() || '');
      setEditGoalWeight(user.goalWeight?.toString() || '');
      setEditHealthGoals(user.healthGoals || []);
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
      avatar: editAvatar,
      weight: editWeight ? parseFloat(editWeight) : undefined,
      height: editHeight ? parseFloat(editHeight) : undefined,
      goalWeight: editGoalWeight ? parseFloat(editGoalWeight) : undefined,
      healthGoals: editHealthGoals,
    });
    setEditProfileOpen(false);
    Alert.alert('Profile Updated', 'Your profile has been saved.');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditAvatar(result.assets[0].uri);
    }
  };

  const toggleHealthGoal = (goal: string) => {
    if (editHealthGoals.includes(goal)) {
      setEditHealthGoals(editHealthGoals.filter(g => g !== goal));
    } else {
      setEditHealthGoals([...editHealthGoals, goal]);
    }
  };

  const formatHeightDisplay = (inches: number): string => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
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

  // Get monthly data for calendar heatmap (last 28 days)
  const getMonthlyData = (): { date: string; score: number; dayOfWeek: number }[] => {
    const result: { date: string; score: number; dayOfWeek: number }[] = [];
    for (let i = 27; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayMeals = data.meals.filter(m => m.date === dateStr);
      const dayStats = data.dailyStats.find(s => s.date === dateStr);
      const score = dayStats?.totalScore || dayMeals.reduce((sum, m) => sum + m.totalScore, 0);
      result.push({ date: dateStr, score, dayOfWeek: date.getDay() });
    }
    return result;
  };

  // Get comparison data (this week vs last week)
  const getComparisonData = () => {
    const thisWeek = weeklyData.reduce((sum, d) => sum + d.score, 0);
    const lastWeekData: number[] = [];
    for (let i = 13; i >= 7; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayMeals = data.meals.filter(m => m.date === dateStr);
      const dayStats = data.dailyStats.find(s => s.date === dateStr);
      lastWeekData.push(dayStats?.totalScore || dayMeals.reduce((sum, m) => sum + m.totalScore, 0));
    }
    const lastWeek = lastWeekData.reduce((sum, s) => sum + s, 0);
    const change = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;
    return { thisWeek, lastWeek, change };
  };

  // Get trigger frequency in meals
  const getTriggerStats = () => {
    const triggerCounts: Record<string, number> = {};
    data.meals.forEach(meal => {
      meal.items.forEach(item => {
        item.warnings.forEach(warning => {
          triggers.forEach(trigger => {
            if (warning.toLowerCase().includes(trigger.name.toLowerCase())) {
              triggerCounts[trigger.name] = (triggerCounts[trigger.name] || 0) + 1;
            }
          });
        });
      });
    });
    return Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  // Get all-time stats
  const getAllTimeStats = () => {
    const totalDays = data.dailyStats.length || 1;
    const totalScore = data.dailyStats.reduce((sum, d) => sum + d.totalScore, 0);
    const avgDaily = Math.round(totalScore / totalDays);
    const bestDay = Math.max(...data.dailyStats.map(d => d.totalScore), 0);
    const activeDays = data.dailyStats.filter(d => d.mealsLogged > 0).length;
    return { totalDays, avgDaily, bestDay, activeDays };
  };

  // Get heatmap color based on score
  const getHeatmapColor = (score: number): string => {
    if (score === 0) return '#f3f4f6';
    if (score < 5) return '#fef3c7';
    if (score < 10) return '#fde68a';
    if (score < 15) return '#86efac';
    return '#22c55e';
  };

  const monthlyData = getMonthlyData();
  const comparisonData = getComparisonData();
  const allTimeStats = getAllTimeStats();

  const handleExport = async () => {
    setIsExporting(true);
    const result = await exportAndShare(data, {
      format: exportFormat,
      scope: exportScope,
    });
    setIsExporting(false);

    if (result.success) {
      setExportOpen(false);
    } else {
      Alert.alert('Export Failed', result.error || 'Unable to export data');
    }
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
          <TouchableOpacity
            style={styles.avatarTouchable}
            onPress={() => setEditProfileOpen(true)}
          >
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
              </View>
            )}
            <View style={styles.avatarEditBadge}>
              <Ionicons name="camera" size={12} color="white" />
            </View>
          </TouchableOpacity>
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

        <View style={styles.contentWrap}>
        <Text style={styles.sectionHeading}>Manage</Text>
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
        <Text style={styles.sectionHeading}>Quick actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => setExportOpen(true)}
            activeOpacity={0.85}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="download" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.quickActionText}>Export Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Learn')}
            activeOpacity={0.85}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#ede9fe' }]}>
              <Ionicons name="help-circle" size={20} color="#8b5cf6" />
            </View>
            <Text style={styles.quickActionText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Mido</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
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
        {/* Time View Toggle */}
        <View style={styles.timeViewToggle}>
          {(['week', 'month', 'all'] as const).map((view) => (
            <TouchableOpacity
              key={view}
              style={[
                styles.timeViewButton,
                progressTimeView === view && styles.timeViewButtonActive,
              ]}
              onPress={() => setProgressTimeView(view)}
            >
              <Text
                style={[
                  styles.timeViewButtonText,
                  progressTimeView === view && styles.timeViewButtonTextActive,
                ]}
              >
                {view === 'week' ? 'Week' : view === 'month' ? 'Month' : 'All Time'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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

        {/* Week View */}
        {progressTimeView === 'week' && (
          <>
            {/* Comparison Banner */}
            <View style={[
              styles.comparisonBanner,
              { backgroundColor: comparisonData.change >= 0 ? '#f0fdf4' : '#fef2f2' }
            ]}>
              <Ionicons
                name={comparisonData.change >= 0 ? 'trending-up' : 'trending-down'}
                size={20}
                color={comparisonData.change >= 0 ? '#10b981' : '#ef4444'}
              />
              <Text style={[
                styles.comparisonText,
                { color: comparisonData.change >= 0 ? '#059669' : '#dc2626' }
              ]}>
                {comparisonData.change >= 0 ? '+' : ''}{comparisonData.change}% vs last week
              </Text>
              <Text style={styles.comparisonDetail}>
                {comparisonData.thisWeek} pts vs {comparisonData.lastWeek} pts
              </Text>
            </View>

            {/* Weekly Chart */}
            <Text style={styles.chartTitle}>This Week</Text>
            <View style={styles.chart}>
              {weeklyData.map((dayData, idx) => (
                <View key={idx} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${(dayData.score / maxScore) * 100}%`,
                          backgroundColor:
                            dayData.score >= 12
                              ? '#10b981'
                              : dayData.score >= 8
                              ? '#3b82f6'
                              : '#f59e0b',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barScore}>+{dayData.score}</Text>
                  <Text style={styles.barLabel}>{dayData.day}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Month View - Calendar Heatmap */}
        {progressTimeView === 'month' && (
          <>
            <Text style={styles.chartTitle}>Last 28 Days</Text>
            <View style={styles.heatmapContainer}>
              <View style={styles.heatmapDayLabels}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <Text key={idx} style={styles.heatmapDayLabel}>{day}</Text>
                ))}
              </View>
              <View style={styles.heatmapGrid}>
                {monthlyData.map((day, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.heatmapCell,
                      { backgroundColor: getHeatmapColor(day.score) },
                    ]}
                  >
                    {day.score > 0 && (
                      <Text style={styles.heatmapCellText}>
                        {day.score > 99 ? '99' : day.score}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
              <View style={styles.heatmapLegend}>
                <Text style={styles.heatmapLegendLabel}>Less</Text>
                {['#f3f4f6', '#fef3c7', '#fde68a', '#86efac', '#22c55e'].map((color, idx) => (
                  <View key={idx} style={[styles.heatmapLegendBox, { backgroundColor: color }]} />
                ))}
                <Text style={styles.heatmapLegendLabel}>More</Text>
              </View>
            </View>

            {/* Monthly Summary */}
            <View style={styles.monthlySummary}>
              <View style={styles.monthlySummaryItem}>
                <Text style={styles.monthlySummaryValue}>
                  {monthlyData.filter(d => d.score > 0).length}
                </Text>
                <Text style={styles.monthlySummaryLabel}>Active Days</Text>
              </View>
              <View style={styles.monthlySummaryItem}>
                <Text style={styles.monthlySummaryValue}>
                  {Math.round(monthlyData.reduce((sum, d) => sum + d.score, 0) / 28)}
                </Text>
                <Text style={styles.monthlySummaryLabel}>Daily Avg</Text>
              </View>
              <View style={styles.monthlySummaryItem}>
                <Text style={styles.monthlySummaryValue}>
                  {Math.max(...monthlyData.map(d => d.score))}
                </Text>
                <Text style={styles.monthlySummaryLabel}>Best Day</Text>
              </View>
            </View>
          </>
        )}

        {/* All Time View */}
        {progressTimeView === 'all' && (
          <>
            <Text style={styles.chartTitle}>All Time Stats</Text>
            <View style={styles.allTimeGrid}>
              <View style={styles.allTimeStat}>
                <View style={[styles.allTimeIcon, { backgroundColor: '#dbeafe' }]}>
                  <Ionicons name="calendar" size={24} color="#3b82f6" />
                </View>
                <Text style={styles.allTimeValue}>{allTimeStats.activeDays}</Text>
                <Text style={styles.allTimeLabel}>Active Days</Text>
              </View>
              <View style={styles.allTimeStat}>
                <View style={[styles.allTimeIcon, { backgroundColor: '#d1fae5' }]}>
                  <Ionicons name="stats-chart" size={24} color="#10b981" />
                </View>
                <Text style={styles.allTimeValue}>{allTimeStats.avgDaily}</Text>
                <Text style={styles.allTimeLabel}>Daily Average</Text>
              </View>
              <View style={styles.allTimeStat}>
                <View style={[styles.allTimeIcon, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="trophy" size={24} color="#f59e0b" />
                </View>
                <Text style={styles.allTimeValue}>{allTimeStats.bestDay}</Text>
                <Text style={styles.allTimeLabel}>Best Single Day</Text>
              </View>
              <View style={styles.allTimeStat}>
                <View style={[styles.allTimeIcon, { backgroundColor: '#ede9fe' }]}>
                  <Ionicons name="school" size={24} color="#8b5cf6" />
                </View>
                <Text style={styles.allTimeValue}>{data.completedLessonIds.length}</Text>
                <Text style={styles.allTimeLabel}>Lessons Done</Text>
              </View>
            </View>

            {/* Achievements Progress */}
            <Text style={styles.chartTitle}>Achievements</Text>
            <View style={styles.achievementsRow}>
              {data.achievements.slice(0, 6).map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementBadge,
                    !achievement.unlocked && styles.achievementBadgeLocked,
                  ]}
                >
                  <Ionicons
                    name={achievement.icon as any}
                    size={24}
                    color={achievement.unlocked ? achievement.color : '#d1d5db'}
                  />
                </View>
              ))}
            </View>
            <Text style={styles.achievementsCount}>
              {data.achievements.filter(a => a.unlocked).length} of {data.achievements.length} unlocked
            </Text>
          </>
        )}

        {/* Trigger Insights - Show in all views */}
        {triggers.length > 0 && (
          <>
            <Text style={[styles.chartTitle, { marginTop: 20 }]}>Trigger Exposure</Text>
            <View style={styles.triggerInsights}>
              {getTriggerStats().length > 0 ? (
                getTriggerStats().map(([name, count], idx) => (
                  <View key={idx} style={styles.triggerInsightRow}>
                    <View style={styles.triggerInsightInfo}>
                      <Ionicons name="warning" size={16} color="#f59e0b" />
                      <Text style={styles.triggerInsightName}>{name}</Text>
                    </View>
                    <Text style={styles.triggerInsightCount}>{count}x detected</Text>
                  </View>
                ))
              ) : (
                <View style={styles.noTriggersDetected}>
                  <Ionicons name="shield-checkmark" size={24} color="#10b981" />
                  <Text style={styles.noTriggersText}>No trigger exposures detected!</Text>
                </View>
              )}
            </View>
          </>
        )}
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
          <Text style={styles.settingsMenuText}>About Mido</Text>
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
        {/* Avatar Picker */}
        <View style={styles.avatarPickerSection}>
          <TouchableOpacity style={styles.avatarPickerButton} onPress={pickImage}>
            {editAvatar ? (
              <Image source={{ uri: editAvatar }} style={styles.avatarPickerImage} />
            ) : (
              <View style={styles.avatarPickerPlaceholder}>
                <Text style={styles.avatarPickerInitial}>{editName?.charAt(0) || 'U'}</Text>
              </View>
            )}
            <View style={styles.avatarPickerOverlay}>
              <Ionicons name="camera" size={20} color="white" />
              <Text style={styles.avatarPickerText}>Change Photo</Text>
            </View>
          </TouchableOpacity>
        </View>

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

        {/* Body Metrics */}
        <Text style={styles.profileSectionTitle}>Body Metrics</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricInput}>
            <Text style={styles.metricLabel}>Weight (lbs)</Text>
            <TextInput
              style={styles.metricField}
              value={editWeight}
              onChangeText={setEditWeight}
              placeholder="175"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.metricInput}>
            <Text style={styles.metricLabel}>Height (in)</Text>
            <TextInput
              style={styles.metricField}
              value={editHeight}
              onChangeText={setEditHeight}
              placeholder="70"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
            {editHeight && (
              <Text style={styles.metricHelper}>
                {formatHeightDisplay(parseInt(editHeight) || 0)}
              </Text>
            )}
          </View>
          <View style={styles.metricInput}>
            <Text style={styles.metricLabel}>Goal (lbs)</Text>
            <TextInput
              style={styles.metricField}
              value={editGoalWeight}
              onChangeText={setEditGoalWeight}
              placeholder="165"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Health Goals */}
        <Text style={styles.profileSectionTitle}>Health Goals</Text>
        <Text style={styles.profileSectionSubtext}>Select all that apply</Text>
        <View style={styles.healthGoalsGrid}>
          {HEALTH_GOALS.map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.healthGoalChip,
                editHealthGoals.includes(goal) && styles.healthGoalChipActive,
              ]}
              onPress={() => toggleHealthGoal(goal)}
            >
              <Ionicons
                name={editHealthGoals.includes(goal) ? 'checkmark-circle' : 'add-circle-outline'}
                size={18}
                color={editHealthGoals.includes(goal) ? '#10b981' : '#9ca3af'}
              />
              <Text
                style={[
                  styles.healthGoalText,
                  editHealthGoals.includes(goal) && styles.healthGoalTextActive,
                ]}
              >
                {goal}
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
          <Image
            source={require('../../assets/logo.png')}
            style={styles.aboutLogoImage}
            resizeMode="contain"
          />
          <Text style={styles.aboutTitle}>Mido</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutSectionTitle}>The Protocol</Text>
          <Text style={styles.aboutText}>
            Mido is a science-based dietary approach focused on optimizing
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

      {/* Export Panel */}
      <Panel
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        title="Export Data"
      >
        <Text style={styles.exportDescription}>
          Export your Mido data to share or backup.
        </Text>

        {/* Format Selection */}
        <Text style={styles.formLabel}>Format</Text>
        <View style={styles.exportFormatRow}>
          <TouchableOpacity
            style={[
              styles.exportFormatOption,
              exportFormat === 'json' && styles.exportFormatOptionActive,
            ]}
            onPress={() => setExportFormat('json')}
          >
            <Ionicons
              name="code-slash"
              size={24}
              color={exportFormat === 'json' ? '#3b82f6' : '#9ca3af'}
            />
            <Text
              style={[
                styles.exportFormatText,
                exportFormat === 'json' && styles.exportFormatTextActive,
              ]}
            >
              JSON
            </Text>
            <Text style={styles.exportFormatSubtext}>Full data backup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.exportFormatOption,
              exportFormat === 'csv' && styles.exportFormatOptionActive,
            ]}
            onPress={() => setExportFormat('csv')}
          >
            <Ionicons
              name="grid"
              size={24}
              color={exportFormat === 'csv' ? '#3b82f6' : '#9ca3af'}
            />
            <Text
              style={[
                styles.exportFormatText,
                exportFormat === 'csv' && styles.exportFormatTextActive,
              ]}
            >
              CSV
            </Text>
            <Text style={styles.exportFormatSubtext}>Spreadsheet format</Text>
          </TouchableOpacity>
        </View>

        {/* Scope Selection */}
        <Text style={styles.formLabel}>What to Export</Text>
        <View style={styles.exportScopeList}>
          {([
            { value: 'all', label: 'Everything', icon: 'archive', desc: 'Complete data backup' },
            { value: 'meals', label: 'Meals Only', icon: 'restaurant', desc: getExportSummary(data, 'meals') },
            { value: 'triggers', label: 'Triggers Only', icon: 'warning', desc: getExportSummary(data, 'triggers') },
            { value: 'progress', label: 'Progress & Stats', icon: 'trending-up', desc: getExportSummary(data, 'progress') },
          ] as const).map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.exportScopeOption,
                exportScope === option.value && styles.exportScopeOptionActive,
              ]}
              onPress={() => setExportScope(option.value)}
            >
              <View
                style={[
                  styles.exportScopeIcon,
                  exportScope === option.value && styles.exportScopeIconActive,
                ]}
              >
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={exportScope === option.value ? '#3b82f6' : '#6b7280'}
                />
              </View>
              <View style={styles.exportScopeContent}>
                <Text
                  style={[
                    styles.exportScopeLabel,
                    exportScope === option.value && styles.exportScopeLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
                <Text style={styles.exportScopeDesc}>{option.desc}</Text>
              </View>
              {exportScope === option.value && (
                <Ionicons name="checkmark-circle" size={22} color="#3b82f6" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Export Button */}
        <TouchableOpacity
          style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
          onPress={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="share-outline" size={20} color="white" />
              <Text style={styles.exportButtonText}>Export & Share</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.exportHint}>
          Your data will be saved and you can share it via email, cloud storage, or other apps.
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
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 6,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  avatarTouchable: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
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
    justifyContent: 'center',
    gap: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
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
  contentWrap: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 22,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuSection: {
    gap: 12,
  },
  menuItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
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
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
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
  // Time View Toggle
  timeViewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  timeViewButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeViewButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeViewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  timeViewButtonTextActive: {
    color: '#3b82f6',
  },
  // Comparison Banner
  comparisonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  comparisonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  comparisonDetail: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 'auto',
  },
  // Heatmap Styles
  heatmapContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  heatmapDayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  heatmapDayLabel: {
    fontSize: 11,
    color: '#9ca3af',
    width: 36,
    textAlign: 'center',
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  heatmapCell: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heatmapCellText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1f2937',
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 4,
  },
  heatmapLegendLabel: {
    fontSize: 10,
    color: '#9ca3af',
    marginHorizontal: 4,
  },
  heatmapLegendBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  // Monthly Summary
  monthlySummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  monthlySummaryItem: {
    alignItems: 'center',
  },
  monthlySummaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  monthlySummaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  // All Time Stats
  allTimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  allTimeStat: {
    width: '47%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  allTimeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  allTimeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  allTimeLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  // Achievements
  achievementsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  achievementBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementBadgeLocked: {
    backgroundColor: '#f3f4f6',
    shadowOpacity: 0,
    elevation: 0,
  },
  achievementsCount: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
  },
  // Trigger Insights
  triggerInsights: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 14,
  },
  triggerInsightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  triggerInsightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  triggerInsightName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  triggerInsightCount: {
    fontSize: 13,
    color: '#f59e0b',
    fontWeight: '600',
  },
  noTriggersDetected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 8,
  },
  noTriggersText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
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
  aboutLogoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
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
  // Export Panel Styles
  exportDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  exportFormatRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  exportFormatOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    gap: 6,
  },
  exportFormatOptionActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  exportFormatText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  exportFormatTextActive: {
    color: '#1d4ed8',
  },
  exportFormatSubtext: {
    fontSize: 11,
    color: '#9ca3af',
  },
  exportScopeList: {
    gap: 10,
    marginBottom: 20,
  },
  exportScopeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    gap: 12,
  },
  exportScopeOptionActive: {
    backgroundColor: '#eff6ff',
  },
  exportScopeIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportScopeIconActive: {
    backgroundColor: '#dbeafe',
  },
  exportScopeContent: {
    flex: 1,
  },
  exportScopeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  exportScopeLabelActive: {
    color: '#1d4ed8',
  },
  exportScopeDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  exportButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  exportHint: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
  // Avatar Picker Styles
  avatarPickerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPickerButton: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatarPickerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPickerPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPickerInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  avatarPickerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  avatarPickerText: {
    fontSize: 10,
    color: 'white',
    marginTop: 2,
  },
  // Profile Section Styles
  profileSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 4,
  },
  profileSectionSubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  // Body Metrics Styles
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  metricInput: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 6,
  },
  metricField: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  metricHelper: {
    fontSize: 11,
    color: '#3b82f6',
    textAlign: 'center',
    marginTop: 4,
  },
  // Health Goals Styles
  healthGoalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  healthGoalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    gap: 6,
  },
  healthGoalChipActive: {
    backgroundColor: '#d1fae5',
  },
  healthGoalText: {
    fontSize: 13,
    color: '#6b7280',
  },
  healthGoalTextActive: {
    color: '#059669',
    fontWeight: '500',
  },
});

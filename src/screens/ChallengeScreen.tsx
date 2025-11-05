import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHALLENGE_KEY = '@dowd_30day_challenge';

interface ChallengeData {
  startDate: string;
  completedDays: number[];
  currentDay: number;
  lastCheckIn: string | null;
}

export default function ChallengeScreen() {
  const [challengeData, setChallengeData] = useState<ChallengeData>({
    startDate: new Date().toISOString(),
    completedDays: [],
    currentDay: 1,
    lastCheckIn: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallengeData();
  }, []);

  const loadChallengeData = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHALLENGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Calculate current day based on start date
        const startDate = new Date(data.startDate);
        const today = new Date();
        const daysPassed = Math.floor(
          (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        data.currentDay = Math.min(daysPassed + 1, 30);
        setChallengeData(data);
      }
    } catch (error) {
      console.error('Failed to load challenge data:', error);
    }
    setLoading(false);
  };

  const saveChallengeData = async (data: ChallengeData) => {
    try {
      await AsyncStorage.setItem(CHALLENGE_KEY, JSON.stringify(data));
      setChallengeData(data);
    } catch (error) {
      console.error('Failed to save challenge data:', error);
    }
  };

  const startChallenge = () => {
    Alert.alert(
      'Start 30-Day Challenge?',
      'Commit to 30 days of the Dowd Protocol. Check in daily to track your progress!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Challenge',
          onPress: () => {
            const newData: ChallengeData = {
              startDate: new Date().toISOString(),
              completedDays: [],
              currentDay: 1,
              lastCheckIn: null,
            };
            saveChallengeData(newData);
          },
        },
      ]
    );
  };

  const resetChallenge = () => {
    Alert.alert(
      'Reset Challenge?',
      'This will clear your current progress and start over.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const newData: ChallengeData = {
              startDate: new Date().toISOString(),
              completedDays: [],
              currentDay: 1,
              lastCheckIn: null,
            };
            saveChallengeData(newData);
          },
        },
      ]
    );
  };

  const checkInToday = () => {
    const today = new Date().toDateString();

    if (challengeData.lastCheckIn === today) {
      Alert.alert('Already Checked In', 'You've already checked in today!');
      return;
    }

    if (challengeData.currentDay > 30) {
      Alert.alert('Challenge Complete!', 'Congratulations on completing the 30-day challenge!');
      return;
    }

    const newData = {
      ...challengeData,
      completedDays: [...challengeData.completedDays, challengeData.currentDay],
      lastCheckIn: today,
    };

    saveChallengeData(newData);

    if (challengeData.currentDay === 30) {
      setTimeout(() => {
        Alert.alert(
          '🎉 Challenge Complete!',
          'Congratulations! You've completed the 30-Day Dowd Protocol Challenge!',
          [{ text: 'Amazing!', style: 'default' }]
        );
      }, 500);
    } else {
      Alert.alert(
        '✅ Day Complete!',
        `Great job! You've completed day ${challengeData.currentDay}.`,
        [{ text: 'Awesome!', style: 'default' }]
      );
    }
  };

  const getDailyTip = (day: number): string => {
    const tips = [
      'Focus on anti-inflammatory foods today',
      'Add wild-caught salmon to your meals',
      'Remember to include cruciferous vegetables',
      'Stay hydrated with quality water',
      'Avoid processed seed oils',
      'Include fermented foods for gut health',
      'Get morning sunlight for circadian rhythm',
      'Practice mindful eating today',
      'Track your energy levels',
      'Add omega-3 rich foods',
      'Focus on quality sleep tonight',
      'Include dark leafy greens',
      'Avoid nightshades if sensitive',
      'Add bone broth for gut healing',
      'Include probiotic-rich foods',
      'Practice stress reduction',
      'Focus on whole, unprocessed foods',
      'Add herbs and spices for flavor',
      'Stay consistent with meal timing',
      'Track your symptoms',
      'Celebrate your progress!',
      'Include healthy fats',
      'Avoid inflammatory triggers',
      'Add variety to your meals',
      'Stay committed to your goals',
      'Include sulfur-rich vegetables',
      'Practice gratitude',
      'Focus on nutrient density',
      'Trust the process',
      'Finish strong - you\'re almost there!',
    ];
    return tips[day - 1] || tips[0];
  };

  const completionPercentage = Math.round(
    (challengeData.completedDays.length / 30) * 100
  );
  const currentStreak = challengeData.completedDays.length;
  const isCheckedInToday = challengeData.lastCheckIn === new Date().toDateString();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading challenge...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (challengeData.completedDays.length === 0 && challengeData.currentDay === 1) {
    // Show welcome screen
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeIcon}>🎯</Text>
            <Text style={styles.welcomeTitle}>30-Day Dowd Protocol Challenge</Text>
            <Text style={styles.welcomeSubtitle}>
              Transform your health in 30 days
            </Text>

            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsTitle}>What You'll Achieve:</Text>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Build lasting healthy habits</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Reduce inflammation</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Boost energy levels</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Support gut health</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Track your progress daily</Text>
              </View>
            </View>

            <View style={styles.rulesCard}>
              <Text style={styles.rulesTitle}>Challenge Rules:</Text>
              <Text style={styles.ruleText}>
                • Check in daily by logging at least one meal{'\n'}
                • Follow Dowd Protocol guidelines{'\n'}
                • Track your energy and symptoms{'\n'}
                • Stay consistent for all 30 days{'\n'}
                • Celebrate your progress!
              </Text>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startChallenge}>
              <Text style={styles.startButtonText}>Start Challenge</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>30-Day Challenge</Text>
            <Text style={styles.headerSubtitle}>
              Day {challengeData.currentDay} of 30
            </Text>
          </View>
          <TouchableOpacity onPress={resetChallenge}>
            <Ionicons name="refresh" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressPercentage}>{completionPercentage}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${completionPercentage}%` }]}
            />
          </View>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Ionicons name="flame" size={20} color="#f59e0b" />
              <Text style={styles.progressStatValue}>{currentStreak}</Text>
              <Text style={styles.progressStatLabel}>Days</Text>
            </View>
            <View style={styles.progressStat}>
              <Ionicons name="trophy" size={20} color="#8b5cf6" />
              <Text style={styles.progressStatValue}>
                {30 - challengeData.completedDays.length}
              </Text>
              <Text style={styles.progressStatLabel}>To Go</Text>
            </View>
            <View style={styles.progressStat}>
              <Ionicons name="calendar" size={20} color="#3b82f6" />
              <Text style={styles.progressStatValue}>{challengeData.currentDay}</Text>
              <Text style={styles.progressStatLabel}>Current</Text>
            </View>
          </View>
        </View>

        {/* Check-in Button */}
        {!isCheckedInToday && challengeData.currentDay <= 30 && (
          <TouchableOpacity style={styles.checkInButton} onPress={checkInToday}>
            <Ionicons name="checkmark-circle" size={32} color="white" />
            <View style={styles.checkInContent}>
              <Text style={styles.checkInTitle}>Check In for Today</Text>
              <Text style={styles.checkInSubtitle}>
                Mark Day {challengeData.currentDay} as complete
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        )}

        {isCheckedInToday && (
          <View style={styles.checkedInCard}>
            <Ionicons name="checkmark-circle" size={32} color="#10b981" />
            <View style={styles.checkedInContent}>
              <Text style={styles.checkedInTitle}>✅ Checked In!</Text>
              <Text style={styles.checkedInSubtitle}>
                Great job today! Come back tomorrow.
              </Text>
            </View>
          </View>
        )}

        {/* Daily Tip */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color="#f59e0b" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Today's Focus</Text>
            <Text style={styles.tipText}>{getDailyTip(challengeData.currentDay)}</Text>
          </View>
        </View>

        {/* Calendar Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Challenge Calendar</Text>
          <View style={styles.calendarGrid}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isCompleted = challengeData.completedDays.includes(day);
              const isCurrent = day === challengeData.currentDay;
              const isFuture = day > challengeData.currentDay;

              return (
                <View
                  key={day}
                  style={[
                    styles.calendarDay,
                    isCompleted && styles.calendarDayCompleted,
                    isCurrent && !isCompleted && styles.calendarDayCurrent,
                    isFuture && styles.calendarDayFuture,
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarDayText,
                      isCompleted && styles.calendarDayTextCompleted,
                      isCurrent && !isCompleted && styles.calendarDayTextCurrent,
                      isFuture && styles.calendarDayTextFuture,
                    ]}
                  >
                    {day}
                  </Text>
                  {isCompleted && (
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color="white"
                      style={styles.calendarDayCheck}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Motivational Message */}
        {completionPercentage >= 50 && (
          <View style={styles.motivationCard}>
            <Text style={styles.motivationIcon}>🌟</Text>
            <Text style={styles.motivationTitle}>You're Halfway There!</Text>
            <Text style={styles.motivationText}>
              Amazing progress! Keep up the great work. Your body is already benefiting
              from these positive changes.
            </Text>
          </View>
        )}
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
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  welcomeContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  welcomeIcon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 32,
  },
  benefitsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    color: '#374151',
  },
  rulesCard: {
    backgroundColor: '#eff6ff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
  },
  ruleText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  progressCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 6,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  checkInButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  checkInContent: {
    flex: 1,
    marginLeft: 16,
  },
  checkInTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  checkInSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  checkedInCard: {
    backgroundColor: '#d1fae5',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  checkedInContent: {
    flex: 1,
    marginLeft: 16,
  },
  checkedInTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#047857',
  },
  checkedInSubtitle: {
    fontSize: 14,
    color: '#047857',
    marginTop: 2,
  },
  tipCard: {
    backgroundColor: '#fffbeb',
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  calendarDay: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  calendarDayCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  calendarDayCurrent: {
    borderColor: '#3b82f6',
    borderWidth: 3,
  },
  calendarDayFuture: {
    backgroundColor: '#f3f4f6',
    opacity: 0.6,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  calendarDayTextCompleted: {
    color: 'white',
  },
  calendarDayTextCurrent: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  calendarDayTextFuture: {
    color: '#9ca3af',
  },
  calendarDayCheck: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  motivationCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  motivationIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  motivationText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

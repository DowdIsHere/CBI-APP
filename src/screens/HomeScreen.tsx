import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScoreCard from '../components/home/ScoreCard';
import LearningCard from '../components/home/LearningCard';
import InsightTeaser from '../components/home/InsightTeaser';
import AchievementTeaser from '../components/home/AchievementTeaser';
import ScoreDetailPanel from '../components/panels/ScoreDetailPanel';
import InsightsPanel from '../components/panels/InsightsPanel';

export default function HomeScreen({ navigation }: any) {
  const [scoreDetailOpen, setScoreDetailOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);

  const userStats = {
    todayScore: 14,
    weekAverage: 11,
    streak: 7,
    energyLevel: 8,
    weightChange: -2.5,
  };

  const recentMeals = [
    { name: 'Breakfast', time: '8:30 AM', score: 8, items: 3 },
    { name: 'Lunch', time: '12:45 PM', score: 12, items: 4 },
    { name: 'Snack', time: '3:15 PM', score: 4, items: 2 },
  ];

  const insights = [
    {
      type: 'success' as const,
      message: 'Your energy levels are up 60% this week!',
      icon: 'flash',
    },
    {
      type: 'tip' as const,
      message: 'Add more sulforaphane - only 1 cruciferous serving yesterday',
      icon: 'bulb',
    },
    {
      type: 'warning' as const,
      message: 'Detected nightshades in 2 meals - may trigger symptoms',
      icon: 'warning',
    },
  ];

  const achievements = [
    { id: 1, name: '7-Day Streak', icon: '🔥', unlocked: true },
    { id: 2, name: 'ENS Optimizer', icon: '🧠', unlocked: true },
    { id: 3, name: 'Omega-3 Master', icon: '🐟', unlocked: true },
    { id: 4, name: 'Sugar-Free Week', icon: '🚫', unlocked: false },
  ];

  const learningProgress = {
    currentModule: 'Week 1: Foundation',
    currentLesson: 'Meet Your Enteric Nervous System',
    progress: 75,
    timeEstimate: '5 min',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>CBI</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greeting}>Good morning!</Text>
              <Text style={styles.subtitle}>
                Your ENS is thanking you today
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Score Card - Tap to expand */}
          <ScoreCard
            todayScore={userStats.todayScore}
            weekAverage={userStats.weekAverage}
            streak={userStats.streak}
            onPress={() => setScoreDetailOpen(true)}
          />

          {/* Continue Learning Card */}
          <View style={styles.section}>
            <LearningCard
              currentModule={learningProgress.currentModule}
              currentLesson={learningProgress.currentLesson}
              progress={learningProgress.progress}
              timeEstimate={learningProgress.timeEstimate}
              onPress={() => navigation.navigate('Learn')}
            />
          </View>

          {/* Teasers Section */}
          <View style={styles.teasers}>
            <InsightTeaser
              insights={insights}
              onPress={() => setInsightsOpen(true)}
            />
            <View style={styles.teaserSpacer} />
            <AchievementTeaser
              achievements={achievements}
              onPress={() => navigation.navigate('You')}
            />
          </View>

          {/* Quick Tip */}
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="leaf" size={20} color="#10b981" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Daily Tip</Text>
              <Text style={styles.tipText}>
                Try adding wild-caught salmon or sardines to your next meal for
                an omega-3 boost!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Score Detail Panel */}
      <ScoreDetailPanel
        isOpen={scoreDetailOpen}
        onClose={() => setScoreDetailOpen(false)}
        stats={userStats}
        meals={recentMeals}
      />

      {/* Insights Panel */}
      <InsightsPanel
        isOpen={insightsOpen}
        onClose={() => setInsightsOpen(false)}
        insights={insights}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 44,
    height: 44,
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginTop: 20,
  },
  teasers: {
    marginTop: 20,
  },
  teaserSpacer: {
    height: 12,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#ecfdf5',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  tipIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#d1fae5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#047857',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#065f46',
    lineHeight: 18,
  },
});

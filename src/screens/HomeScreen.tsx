import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [expandedScore, setExpandedScore] = useState(false);
  const [expandedInsights, setExpandedInsights] = useState(false);

  // User data
  const userData = {
    todayScore: 14,
    todayProgress: 82,
    weekAverage: 11,
    streak: 7,
    energy: 8,
    weight: -2.5,
    insights: [
      { type: 'success', message: 'Energy levels up 60% this week!', icon: 'flash' },
      { type: 'tip', message: 'Add more sulforaphane - only 1 cruciferous serving yesterday', icon: 'alert-circle' }
    ],
    achievements: { recent: 1, total: 12 },
    todayMeals: [
      { name: 'Breakfast', score: 8, time: '8:30 AM' },
      { name: 'Lunch', score: 12, time: '12:45 PM' },
      { name: 'Snack', score: -6, time: '3:15 PM' }
    ],
  };

  // Score Detail Panel
  const ScoreDetailPanel = () => (
    <Modal
      visible={expandedScore}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setExpandedScore(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setExpandedScore(false)}
      >
        <View style={styles.bottomSheet}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Today's Breakdown</Text>
              <TouchableOpacity
                onPress={() => setExpandedScore(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Score Summary */}
            <View style={styles.scoreSummaryCard}>
              <Text style={styles.scoreSummaryLabel}>Total Score</Text>
              <Text style={styles.scoreSummaryValue}>+{userData.todayScore}</Text>
              <View style={styles.scoreSummaryStats}>
                <View style={styles.summaryStatRow}>
                  <Text style={styles.summaryStatLabel}>Week Average</Text>
                  <Text style={styles.summaryStatValue}>+{userData.weekAverage}</Text>
                </View>
                <View style={styles.summaryStatRow}>
                  <Text style={styles.summaryStatLabel}>Streak</Text>
                  <Text style={styles.summaryStatValue}>{userData.streak} days 🔥</Text>
                </View>
                <View style={styles.summaryStatRow}>
                  <Text style={styles.summaryStatLabel}>Energy Level</Text>
                  <Text style={styles.summaryStatValue}>{userData.energy}/10</Text>
                </View>
                <View style={styles.summaryStatRow}>
                  <Text style={styles.summaryStatLabel}>Weight Change</Text>
                  <Text style={styles.summaryStatValue}>{userData.weight} lbs</Text>
                </View>
              </View>
            </View>

            {/* Meal Breakdown */}
            <Text style={styles.mealBreakdownTitle}>Meals Today</Text>
            {userData.todayMeals.map((meal, idx) => (
              <View key={idx} style={styles.mealBreakdownItem}>
                <View>
                  <Text style={styles.mealBreakdownName}>{meal.name}</Text>
                  <Text style={styles.mealBreakdownTime}>{meal.time}</Text>
                </View>
                <Text style={[
                  styles.mealBreakdownScore,
                  { color: meal.score > 0 ? '#059669' : '#dc2626' }
                ]}>
                  {meal.score > 0 ? '+' : ''}{meal.score}
                </Text>
              </View>
            ))}

            {/* View Full Stats Button */}
            <TouchableOpacity
              style={styles.fullStatsButton}
              onPress={() => {
                setExpandedScore(false);
                navigation.navigate('Progress');
              }}
            >
              <Text style={styles.fullStatsButtonText}>View Full Statistics</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Insights Panel
  const InsightsPanel = () => (
    <Modal
      visible={expandedInsights}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setExpandedInsights(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setExpandedInsights(false)}
      >
        <View style={[styles.bottomSheet, { maxHeight: '60%' }]}>
          <View style={styles.handleBar} />

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Today's Insights</Text>
            <TouchableOpacity
              onPress={() => setExpandedInsights(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {userData.insights.map((insight, idx) => (
            <View
              key={idx}
              style={[
                styles.insightItem,
                {
                  backgroundColor: insight.type === 'success' ? '#ecfdf5' : '#eff6ff',
                  borderLeftColor: insight.type === 'success' ? '#10b981' : '#3b82f6'
                }
              ]}
            >
              <Ionicons
                name={insight.icon as any}
                size={24}
                color={insight.type === 'success' ? '#059669' : '#2563eb'}
              />
              <Text style={styles.insightItemText}>{insight.message}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>CBI</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>CBI</Text>
            <Text style={styles.headerSubtitle}>Cellular Biology Intelligence</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="white" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* PRIMARY: Today's Score Card */}
          <TouchableOpacity
            style={styles.scoreCard}
            onPress={() => setExpandedScore(true)}
            activeOpacity={0.9}
          >
            <Text style={styles.scoreLabel}>Today's Score</Text>
            <View style={styles.scoreRow}>
              <View>
                <Text style={styles.scoreValue}>+{userData.todayScore}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${userData.todayProgress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{userData.todayProgress}%</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={32} color="rgba(255,255,255,0.75)" />
            </View>
            <Text style={styles.scoreTapHint}>Tap for full breakdown</Text>
          </TouchableOpacity>

          {/* PRIMARY: Continue Learning */}
          <View style={styles.learningCard}>
            <View style={styles.learningIconContainer}>
              <Text style={styles.learningIcon}>📚</Text>
            </View>
            <Text style={styles.learningTitle}>Continue Learning</Text>
            <Text style={styles.learningSubtitle}>Next lesson ready</Text>

            <View style={styles.lessonPreview}>
              <Text style={styles.lessonTitle}>Understanding Net Carbs</Text>
              <Text style={styles.lessonMeta}>Module 3 of 12 • 8 minutes</Text>
              <View style={styles.lessonProgress}>
                <View style={styles.lessonProgressBar}>
                  <View style={[styles.lessonProgressFill, { width: '60%' }]} />
                </View>
                <Text style={styles.lessonProgressText}>60%</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => navigation.navigate('Learn')}
            >
              <Text style={styles.continueButtonText}>Continue Lesson →</Text>
            </TouchableOpacity>
          </View>

          {/* SECONDARY: Quick Teasers */}
          <View style={styles.teasersContainer}>
            {/* Insights Teaser */}
            <TouchableOpacity
              style={styles.teaserButton}
              onPress={() => setExpandedInsights(true)}
            >
              <View style={[styles.teaserIcon, { backgroundColor: '#8b5cf6' }]}>
                <Text style={styles.teaserIconText}>{userData.insights.length}</Text>
              </View>
              <Text style={styles.teaserText}>New insights available</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            {/* Achievement Teaser */}
            <TouchableOpacity style={[styles.teaserButton, styles.achievementTeaser]}>
              <View style={[styles.teaserIcon, { backgroundColor: '#f97316' }]}>
                <Ionicons name="trophy" size={20} color="white" />
              </View>
              <Text style={styles.teaserText}>Achievement unlocked!</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <ScoreDetailPanel />
      <InsightsPanel />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#93c5fd',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
    gap: 20,
  },
  // Score Card
  scoreCard: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  scoreLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: 120,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  scoreTapHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 12,
  },
  // Learning Card
  learningCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9d5ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  learningIconContainer: {
    width: 72,
    height: 72,
    backgroundColor: '#8b5cf6',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  learningIcon: {
    fontSize: 40,
  },
  learningTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  learningSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  lessonPreview: {
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#581c87',
    marginBottom: 4,
  },
  lessonMeta: {
    fontSize: 13,
    color: '#7c3aed',
    marginBottom: 12,
  },
  lessonProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lessonProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e9d5ff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  lessonProgressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 4,
  },
  lessonProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  continueButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  // Teasers
  teasersContainer: {
    gap: 12,
  },
  teaserButton: {
    backgroundColor: '#faf5ff',
    borderWidth: 2,
    borderColor: '#e9d5ff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementTeaser: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },
  teaserIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teaserIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  teaserText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  handleBar: {
    width: 48,
    height: 5,
    backgroundColor: '#d1d5db',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Score Summary
  scoreSummaryCard: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  scoreSummaryLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  scoreSummaryValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  scoreSummaryStats: {
    gap: 8,
  },
  summaryStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryStatLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  summaryStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  // Meal Breakdown
  mealBreakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  mealBreakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  mealBreakdownName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  mealBreakdownTime: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  mealBreakdownScore: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fullStatsButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  fullStatsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  // Insight Items
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  insightItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
});

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
import Panel from '../components/panels/Panel';
import { useAppData } from '../data/AppContext';

export default function HomeScreen({ navigation }: any) {
  const [scoreDetailOpen, setScoreDetailOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);

  const { data, getTodaysMeals } = useAppData();
  const { stats, insights, achievements, currentLesson } = data;
  const todaysMeals = getTodaysMeals();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>M</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Mido</Text>
              <Text style={styles.headerSubtitle}>Enteric Nervous System Support</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* 1. Score Card - Tappable to expand */}
          <TouchableOpacity
            style={styles.scoreCard}
            onPress={() => setScoreDetailOpen(true)}
            activeOpacity={0.9}
          >
            <View style={styles.scoreCardContent}>
              <View>
                <Text style={styles.scoreLabel}>Today's Score</Text>
                <Text style={styles.scoreValue}>+{stats.todayScore}</Text>
              </View>
              <View style={styles.scoreRight}>
                <View style={styles.streakBadge}>
                  <Ionicons name="flame" size={16} color="#f59e0b" />
                  <Text style={styles.streakText}>{stats.streak} days</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
              </View>
            </View>
            <Text style={styles.scoreTapHint}>Tap for details</Text>
          </TouchableOpacity>

          {/* 2. Continue Learning Card */}
          <TouchableOpacity
            style={styles.learningCard}
            onPress={() => navigation.navigate('Learn')}
            activeOpacity={0.9}
          >
            <View style={styles.learningHeader}>
              <View style={styles.learningIcon}>
                <Ionicons name="book" size={24} color="white" />
              </View>
              <View style={styles.learningInfo}>
                <Text style={styles.learningLabel}>{currentLesson.week}</Text>
                <Text style={styles.learningTitle}>{currentLesson.title}</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${currentLesson.progress}%` }]} />
            </View>
            <View style={styles.learningFooter}>
              <Text style={styles.progressText}>{currentLesson.progress}% complete</Text>
              <View style={styles.continueRow}>
                <Text style={styles.timeEstimate}>{currentLesson.timeEstimate}</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Teasers Section */}
          <View style={styles.teasersSection}>
            {/* 3. Insights Teaser */}
            <TouchableOpacity
              style={styles.teaser}
              onPress={() => setInsightsOpen(true)}
              activeOpacity={0.8}
            >
              <View style={styles.teaserContent}>
                <View style={[styles.teaserIcon, { backgroundColor: '#dbeafe' }]}>
                  <Ionicons name="bulb" size={20} color="#3b82f6" />
                </View>
                <View style={styles.teaserText}>
                  <Text style={styles.teaserTitle}>Insights</Text>
                  <Text style={styles.teaserSubtitle}>
                    {insights.length > 0 ? `${insights.length} tips for you today` : 'No insights yet'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            {/* 4. Achievements Teaser */}
            <TouchableOpacity
              style={styles.teaser}
              onPress={() => setAchievementsOpen(true)}
              activeOpacity={0.8}
            >
              <View style={styles.teaserContent}>
                <View style={[styles.teaserIcon, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="trophy" size={20} color="#f59e0b" />
                </View>
                <View style={styles.teaserText}>
                  <Text style={styles.teaserTitle}>Achievements</Text>
                  <Text style={styles.teaserSubtitle}>
                    {achievements.filter(a => a.unlocked).length} unlocked
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Score Detail Panel */}
      <Panel
        isOpen={scoreDetailOpen}
        onClose={() => setScoreDetailOpen(false)}
        title="Today's Details"
      >
        {/* Stats Grid */}
        <View style={styles.panelStatsGrid}>
          <View style={styles.panelStat}>
            <Text style={styles.panelStatValue}>+{stats.todayScore}</Text>
            <Text style={styles.panelStatLabel}>Today</Text>
          </View>
          <View style={styles.panelStat}>
            <Text style={styles.panelStatValue}>+{stats.weekAverage}</Text>
            <Text style={styles.panelStatLabel}>Week Avg</Text>
          </View>
          <View style={styles.panelStat}>
            <Text style={styles.panelStatValue}>{stats.streak}</Text>
            <Text style={styles.panelStatLabel}>Streak</Text>
          </View>
          <View style={styles.panelStat}>
            <Text style={styles.panelStatValue}>{stats.energyLevel}/10</Text>
            <Text style={styles.panelStatLabel}>Energy</Text>
          </View>
        </View>

        {/* Today's Meals */}
        <Text style={styles.panelSectionTitle}>Today's Meals</Text>
        {todaysMeals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={32} color="#9ca3af" />
            <Text style={styles.emptyStateText}>No meals logged today</Text>
          </View>
        ) : (
          todaysMeals.map((meal) => (
            <View key={meal.id} style={styles.mealItem}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
                <Text style={styles.mealItems}>
                  {meal.items.map(i => i.name).join(', ')}
                </Text>
              </View>
              <View style={[
                styles.mealScore,
                { backgroundColor: meal.totalScore >= 10 ? '#d1fae5' : meal.totalScore >= 5 ? '#dbeafe' : '#fef3c7' }
              ]}>
                <Text style={[
                  styles.mealScoreText,
                  { color: meal.totalScore >= 10 ? '#047857' : meal.totalScore >= 5 ? '#1e40af' : '#92400e' }
                ]}>
                  +{meal.totalScore}
                </Text>
              </View>
            </View>
          ))
        )}

        {/* Weight Change */}
        <View style={styles.weightCard}>
          <Ionicons name="scale" size={24} color="#8b5cf6" />
          <View style={styles.weightInfo}>
            <Text style={styles.weightLabel}>Weight Change</Text>
            <Text style={styles.weightValue}>{stats.weightChange} lbs</Text>
          </View>
          <View style={styles.onTrackBadge}>
            <Ionicons name="checkmark" size={14} color="#047857" />
            <Text style={styles.onTrackText}>On Track</Text>
          </View>
        </View>
      </Panel>

      {/* Insights Panel */}
      <Panel
        isOpen={insightsOpen}
        onClose={() => setInsightsOpen(false)}
        title="Today's Insights"
      >
        {insights.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bulb-outline" size={32} color="#9ca3af" />
            <Text style={styles.emptyStateText}>Log more meals to get insights</Text>
          </View>
        ) : (
          insights.map((insight) => (
            <View key={insight.id} style={[styles.insightCard, { borderLeftColor: insight.color }]}>
              <Ionicons name={insight.icon as any} size={24} color={insight.color} />
              <Text style={styles.insightText}>{insight.message}</Text>
            </View>
          ))
        )}
      </Panel>

      {/* Achievements Panel */}
      <Panel
        isOpen={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
        title="Achievements"
      >
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                !achievement.unlocked && styles.achievementLocked,
              ]}
            >
              <View style={[
                styles.achievementIcon,
                { backgroundColor: achievement.unlocked ? achievement.color : '#e5e7eb' }
              ]}>
                <Ionicons
                  name={achievement.icon as any}
                  size={28}
                  color={achievement.unlocked ? 'white' : '#9ca3af'}
                />
              </View>
              <Text style={[
                styles.achievementName,
                !achievement.unlocked && styles.achievementNameLocked
              ]}>
                {achievement.name}
              </Text>
              {achievement.unlocked && (
                <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              )}
            </View>
          ))}
        </View>
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
  header: {
    backgroundColor: '#1e3a8a',
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#bfdbfe',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  scoreCard: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scoreCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreRight: {
    alignItems: 'flex-end',
    gap: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  streakText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  scoreTapHint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 12,
    textAlign: 'center',
  },
  learningCard: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  learningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  learningIcon: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learningInfo: {
    flex: 1,
  },
  learningLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  learningFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  continueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeEstimate: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  teasersSection: {
    gap: 12,
  },
  teaser: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  teaserContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teaserIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teaserText: {
    gap: 2,
  },
  teaserTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  teaserSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  panelStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  panelStat: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  panelStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  panelStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  panelSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  mealTime: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  mealItems: {
    fontSize: 12,
    color: '#9ca3af',
  },
  mealScore: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  mealScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
  },
  weightInfo: {
    flex: 1,
  },
  weightLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  weightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  onTrackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  onTrackText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    marginBottom: 12,
    gap: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 22,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  achievementNameLocked: {
    color: '#9ca3af',
  },
});

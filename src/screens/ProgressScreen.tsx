import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const [timeRange, setTimeRange] = useState('week');

  const stats = {
    currentStreak: 7,
    totalMeals: 45,
    avgScore: 11,
    bestDay: 18,
    energyImprovement: 60,
    weightChange: -2.5,
  };

  const weeklyData = [
    { day: 'Mon', score: 12 },
    { day: 'Tue', score: 9 },
    { day: 'Wed', score: 15 },
    { day: 'Thu', score: 11 },
    { day: 'Fri', score: 13 },
    { day: 'Sat', score: 10 },
    { day: 'Sun', score: 14 },
  ];

  const achievements = [
    { id: 1, name: '7-Day Streak', icon: '🔥', unlocked: true },
    { id: 2, name: 'ENS Optimizer', icon: '🧠', unlocked: true },
    { id: 3, name: 'Omega-3 Master', icon: '🐟', unlocked: true },
    { id: 4, name: 'Sugar-Free Week', icon: '🚫', unlocked: false },
  ];

  const maxScore = Math.max(...weeklyData.map((d) => d.score));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Time Range Selector */}
        <View style={styles.timeRangeSelector}>
          {['week', 'month', 'year'].map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === range && styles.timeRangeTextActive,
                ]}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={32} color="#f59e0b" />
            <Text style={styles.statValue}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="restaurant" size={32} color="#3b82f6" />
            <Text style={styles.statValue}>{stats.totalMeals}</Text>
            <Text style={styles.statLabel}>Total Meals</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={32} color="#10b981" />
            <Text style={styles.statValue}>+{stats.avgScore}</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={32} color="#8b5cf6" />
            <Text style={styles.statValue}>+{stats.bestDay}</Text>
            <Text style={styles.statLabel}>Best Day</Text>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Score</Text>
          <View style={styles.chartCard}>
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
          </View>
        </View>

        {/* Health Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Metrics</Text>
          <View style={styles.metricsCard}>
            <View style={styles.metricRow}>
              <View style={styles.metricInfo}>
                <Ionicons name="flash" size={24} color="#f59e0b" />
                <Text style={styles.metricLabel}>Energy Level</Text>
              </View>
              <View style={styles.metricValue}>
                <Text style={styles.metricNumber}>8/10</Text>
                <View style={styles.improvementBadge}>
                  <Ionicons name="arrow-up" size={12} color="#10b981" />
                  <Text style={styles.improvementText}>
                    +{stats.energyImprovement}%
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricInfo}>
                <Ionicons name="scale" size={24} color="#8b5cf6" />
                <Text style={styles.metricLabel}>Weight Change</Text>
              </View>
              <View style={styles.metricValue}>
                <Text style={styles.metricNumber}>
                  {stats.weightChange} lbs
                </Text>
                <View style={styles.improvementBadge}>
                  <Ionicons name="checkmark" size={12} color="#10b981" />
                  <Text style={styles.improvementText}>On Track</Text>
                </View>
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricInfo}>
                <Ionicons name="happy" size={24} color="#ec4899" />
                <Text style={styles.metricLabel}>Mood</Text>
              </View>
              <View style={styles.metricValue}>
                <Text style={styles.metricNumber}>Excellent</Text>
                <View style={styles.improvementBadge}>
                  <Ionicons name="arrow-up" size={12} color="#10b981" />
                  <Text style={styles.improvementText}>+40%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.achievementCardLocked,
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={styles.achievementName}>{achievement.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightCard}>
            <Ionicons name="analytics" size={24} color="#3b82f6" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>
                Your top performing foods this week:
              </Text>
              <Text style={styles.insightText}>
                Wild salmon (+18), Broccoli (+14), Blueberries (+12)
              </Text>
            </View>
          </View>
          <View style={styles.insightCard}>
            <Ionicons name="bulb" size={24} color="#f59e0b" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Tip for next week:</Text>
              <Text style={styles.insightText}>
                Try adding more fermented foods like sauerkraut or kimchi to
                boost gut bacteria diversity.
              </Text>
            </View>
          </View>
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
  timeRangeSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: '#3b82f6',
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  timeRangeTextActive: {
    color: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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
  chartCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: '80%',
    height: 150,
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
    marginTop: 4,
  },
  metricsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  metricValue: {
    alignItems: 'flex-end',
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  improvementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  improvementText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  achievementCardLocked: {
    backgroundColor: '#e5e7eb',
    borderColor: '#d1d5db',
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1f2937',
  },
  insightCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
});

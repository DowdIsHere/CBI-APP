import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ProgressScreen() {
  const { userStats, weeklyData, monthlyData, yearlyData, meals } = useApp();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Get display data based on time range
  const displayData = useMemo(() => {
    switch (timeRange) {
      case 'week':
        return weeklyData.map(d => ({ label: d.day, score: d.score }));
      case 'month':
        return monthlyData.map(d => ({ label: d.week, score: d.score }));
      case 'year':
        return yearlyData.map(d => ({ label: d.month, score: d.score }));
      default:
        return weeklyData.map(d => ({ label: d.day, score: d.score }));
    }
  }, [timeRange, weeklyData, monthlyData, yearlyData]);

  // Get stats based on time range
  const rangeStats = useMemo(() => {
    switch (timeRange) {
      case 'week':
        return {
          avgScore: userStats.weekAverage,
          label: 'This Week',
        };
      case 'month':
        return {
          avgScore: userStats.monthAverage,
          label: 'This Month',
        };
      case 'year':
        return {
          avgScore: userStats.yearAverage,
          label: 'This Year',
        };
      default:
        return {
          avgScore: userStats.weekAverage,
          label: 'This Week',
        };
    }
  }, [timeRange, userStats]);

  const achievements = [
    { id: 1, name: '7-Day Streak', icon: '🔥', unlocked: userStats.streak >= 7 },
    { id: 2, name: 'ENS Optimizer', icon: '🧠', unlocked: userStats.totalMeals >= 20 },
    { id: 3, name: 'Omega-3 Master', icon: '🐟', unlocked: userStats.weekAverage >= 10 },
    { id: 4, name: 'Sugar-Free Week', icon: '🚫', unlocked: false },
  ];

  const maxScore = Math.max(...displayData.map((d) => d.score), 1);

  const getChartTitle = () => {
    switch (timeRange) {
      case 'week':
        return 'Weekly Score';
      case 'month':
        return 'Monthly Score (Weekly Avg)';
      case 'year':
        return 'Yearly Score (Monthly Avg)';
      default:
        return 'Weekly Score';
    }
  };

  // Calculate top performing foods
  const topFoods = useMemo(() => {
    const foodScores: { [key: string]: number } = {};
    meals.forEach(meal => {
      meal.foods?.forEach(food => {
        if (!foodScores[food.name]) foodScores[food.name] = 0;
        foodScores[food.name] += food.score;
      });
    });
    return Object.entries(foodScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, score]) => `${name} (+${score})`);
  }, [meals]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Time Range Selector */}
        <View style={styles.timeRangeSelector}>
          {(['week', 'month', 'year'] as const).map((range) => (
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
            <Text style={styles.statValue}>{userStats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="restaurant" size={32} color="#3b82f6" />
            <Text style={styles.statValue}>{userStats.totalMeals}</Text>
            <Text style={styles.statLabel}>Total Meals</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={32} color="#10b981" />
            <Text style={styles.statValue}>+{rangeStats.avgScore}</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={32} color="#8b5cf6" />
            <Text style={styles.statValue}>+{userStats.bestDay}</Text>
            <Text style={styles.statLabel}>Best Day</Text>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{getChartTitle()}</Text>
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {displayData.map((data, idx) => (
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
                              : data.score > 0
                              ? '#f59e0b'
                              : '#e5e7eb',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barScore}>
                    {data.score > 0 ? `+${data.score}` : data.score}
                  </Text>
                  <Text style={styles.barLabel}>{data.label}</Text>
                </View>
              ))}
            </View>
            {displayData.every(d => d.score === 0) && (
              <View style={styles.noDataOverlay}>
                <Text style={styles.noDataText}>No data for this period yet</Text>
                <Text style={styles.noDataSubtext}>Start logging meals to see your progress!</Text>
              </View>
            )}
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
                <Text style={styles.metricNumber}>{userStats.energyLevel}/10</Text>
                {userStats.energyImprovement > 0 && (
                  <View style={styles.improvementBadge}>
                    <Ionicons name="arrow-up" size={12} color="#10b981" />
                    <Text style={styles.improvementText}>
                      +{userStats.energyImprovement}%
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricInfo}>
                <Ionicons name="scale" size={24} color="#8b5cf6" />
                <Text style={styles.metricLabel}>Weight Change</Text>
              </View>
              <View style={styles.metricValue}>
                <Text style={styles.metricNumber}>
                  {userStats.weightChange} lbs
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
                <Text style={styles.metricNumber}>
                  {userStats.energyLevel >= 8 ? 'Excellent' : userStats.energyLevel >= 6 ? 'Good' : 'Fair'}
                </Text>
                {userStats.weekAverage > 5 && (
                  <View style={styles.improvementBadge}>
                    <Ionicons name="arrow-up" size={12} color="#10b981" />
                    <Text style={styles.improvementText}>Improving</Text>
                  </View>
                )}
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
          {topFoods.length > 0 ? (
            <View style={styles.insightCard}>
              <Ionicons name="analytics" size={24} color="#3b82f6" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>
                  Your top performing foods {rangeStats.label.toLowerCase()}:
                </Text>
                <Text style={styles.insightText}>
                  {topFoods.join(', ')}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.insightCard}>
              <Ionicons name="analytics" size={24} color="#3b82f6" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>
                  Start logging meals to see insights
                </Text>
                <Text style={styles.insightText}>
                  Track your food to discover which items give you the best CBI scores.
                </Text>
              </View>
            </View>
          )}
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

        {/* Bottom Spacing */}
        <View style={{ height: 24 }} />
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
    position: 'relative',
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
    minHeight: 4,
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
  noDataOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  noDataSubtext: {
    fontSize: 13,
    color: '#9ca3af',
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

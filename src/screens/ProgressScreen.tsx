import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getMeals, getWeekMeals, getStreak, getDayScores } from '../utils/storage';
import { Meal } from '../types';

export default function ProgressScreen() {
  const [timeRange, setTimeRange] = useState('week');
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [weekMeals, setWeekMeals] = useState<Meal[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState<{ day: string; score: number; date: string }[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const all = await getMeals();
    setAllMeals(all);

    const week = await getWeekMeals();
    setWeekMeals(week);

    const s = await getStreak();
    setStreakCount(s);

    const dayData = getDayScores(all);
    setWeeklyData(dayData);
  };

  const totalMeals = allMeals.length;
  const avgScore = weekMeals.length > 0
    ? Math.round(weekMeals.reduce((s, m) => s + m.totalScore, 0) / new Set(weekMeals.map(m => m.date)).size)
    : 0;
  const bestDay = weeklyData.length > 0 ? Math.max(...weeklyData.map(d => d.score)) : 0;
  const maxScore = Math.max(...weeklyData.map((d) => d.score), 1);

  const topFoods = (() => {
    const foodScores: Record<string, number> = {};
    weekMeals.forEach((meal) => {
      meal.items.forEach((item) => {
        if ('items' in item && item.items) {
          item.items.forEach((sub: any) => {
            foodScores[sub.name] = (foodScores[sub.name] || 0) + (sub.score || 0);
          });
        } else if ('score' in item) {
          foodScores[item.name] = (foodScores[item.name] || 0) + item.score;
        }
      });
    });
    return Object.entries(foodScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  })();

  const achievements = [
    { id: 1, name: '7-Day Streak', icon: 'flame', unlocked: streakCount >= 7 },
    { id: 2, name: 'First Meal', icon: 'restaurant', unlocked: totalMeals >= 1 },
    { id: 3, name: '10 Meals', icon: 'trophy', unlocked: totalMeals >= 10 },
    { id: 4, name: 'Week Warrior', icon: 'shield-checkmark', unlocked: totalMeals >= 21 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Time Range Selector */}
        <View style={styles.timeRangeSelector}>
          {['week', 'month', 'all'].map((range) => (
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
                {range === 'all' ? 'All Time' : range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={32} color="#f59e0b" />
            <Text style={styles.statValue}>{streakCount}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="restaurant" size={32} color="#3b82f6" />
            <Text style={styles.statValue}>{totalMeals}</Text>
            <Text style={styles.statLabel}>Total Meals</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={32} color="#10b981" />
            <Text style={styles.statValue}>{avgScore >= 0 ? '+' : ''}{avgScore}</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={32} color="#8b5cf6" />
            <Text style={styles.statValue}>{bestDay >= 0 ? '+' : ''}{bestDay}</Text>
            <Text style={styles.statLabel}>Best Day</Text>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Score</Text>
          <View style={styles.chartCard}>
            {weeklyData.every(d => d.score === 0) ? (
              <View style={styles.emptyChart}>
                <Ionicons name="bar-chart-outline" size={48} color="#d1d5db" />
                <Text style={styles.emptyChartText}>
                  Log meals to see your weekly chart
                </Text>
              </View>
            ) : (
              <View style={styles.chart}>
                {weeklyData.map((data, idx) => (
                  <View key={idx} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: `${maxScore > 0 ? (data.score / maxScore) * 100 : 0}%`,
                            backgroundColor:
                              data.score >= 10
                                ? '#10b981'
                                : data.score >= 5
                                ? '#3b82f6'
                                : data.score > 0
                                ? '#f59e0b'
                                : '#e5e7eb',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barScore}>
                      {data.score > 0 ? `+${data.score}` : data.score || '-'}
                    </Text>
                    <Text style={styles.barLabel}>{data.day}</Text>
                  </View>
                ))}
              </View>
            )}
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
                <Ionicons
                  name={achievement.icon as any}
                  size={32}
                  color={achievement.unlocked ? '#8b5cf6' : '#9ca3af'}
                />
                <Text style={styles.achievementName}>{achievement.name}</Text>
                {achievement.unlocked && (
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                )}
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
                  Your top performing foods this week:
                </Text>
                <Text style={styles.insightText}>
                  {topFoods.map(([name, score]) => `${name} (+${score})`).join(', ')}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.insightCard}>
              <Ionicons name="analytics" size={24} color="#3b82f6" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>
                  Start logging meals to see your top foods
                </Text>
                <Text style={styles.insightText}>
                  The more you log, the better insights we can provide.
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
  emptyChart: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyChartText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 12,
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
    minHeight: 2,
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
    gap: 4,
  },
  achievementCardLocked: {
    backgroundColor: '#e5e7eb',
    borderColor: '#d1d5db',
    opacity: 0.5,
  },
  achievementName: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1f2937',
    marginTop: 4,
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

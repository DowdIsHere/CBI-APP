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
import { getTodayMeals, getWeekMeals, getStreak, getProfile } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import { Meal } from '../types';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [notifications] = useState(0);
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [todayScore, setTodayScore] = useState(0);
  const [weekAverage, setWeekAverage] = useState(0);
  const [streak, setStreakCount] = useState(0);
  const [userName, setUserName] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const meals = await getTodayMeals();
    setTodayMeals(meals);

    const score = meals.reduce((sum, m) => sum + m.totalScore, 0);
    setTodayScore(score);

    const weekMeals = await getWeekMeals();
    const days = new Set(weekMeals.map((m) => m.date)).size;
    setWeekAverage(days > 0 ? Math.round(weekMeals.reduce((s, m) => s + m.totalScore, 0) / days) : 0);

    const s = await getStreak();
    setStreakCount(s);

    const profile = await getProfile();
    setUserName(profile.name || user?.user_metadata?.full_name || '');
  };

  const quickActions = [
    {
      id: 'photo',
      name: 'Photo',
      description: 'Snap & analyze',
      icon: 'camera',
      color: '#3b82f6',
    },
    {
      id: 'batch',
      name: 'Batch',
      description: 'Multiple meals',
      icon: 'cube',
      color: '#8b5cf6',
    },
    {
      id: 'barcode',
      name: 'Scan',
      description: 'Packaged foods',
      icon: 'scan',
      color: '#10b981',
    },
    {
      id: 'manual',
      name: 'Type',
      description: 'Text entry',
      icon: 'create',
      color: '#f59e0b',
    },
  ];

  const getInsights = () => {
    const insights: { type: string; message: string; icon: string }[] = [];

    if (streak >= 7) {
      insights.push({
        type: 'success',
        message: `Amazing ${streak}-day streak! Keep it up!`,
        icon: 'flash',
      });
    } else if (streak >= 3) {
      insights.push({
        type: 'success',
        message: `${streak}-day streak! You're building momentum.`,
        icon: 'flash',
      });
    }

    if (todayScore >= 10) {
      insights.push({
        type: 'success',
        message: `Great day! Your score of +${todayScore} is excellent for ENS support.`,
        icon: 'checkmark-circle',
      });
    } else if (todayMeals.length > 0) {
      insights.push({
        type: 'tip',
        message: 'Add more omega-3 rich foods like salmon or sardines to boost your score.',
        icon: 'bulb',
      });
    }

    if (todayMeals.length === 0) {
      insights.push({
        type: 'tip',
        message: "You haven't logged any meals today. Start logging to track your ENS health!",
        icon: 'bulb',
      });
    }

    insights.push({
      type: 'tip',
      message: 'Try adding cruciferous vegetables for sulforaphane - great for cellular repair.',
      icon: 'leaf',
    });

    return insights;
  };

  const insights = getInsights();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>CBI</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>
                {userName ? `Welcome, ${userName}` : 'Cellular Biology Intelligence'}
              </Text>
              <Text style={styles.headerSubtitle}>
                Enteric Nervous System Support
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="white" />
            {notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#10b981' }]}>
            <Text style={styles.statLabel}>Today's Score</Text>
            <Text style={styles.statValue}>
              {todayScore >= 0 ? '+' : ''}{todayScore}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#3b82f6' }]}>
            <Text style={styles.statLabel}>Week Average</Text>
            <Text style={styles.statValue}>
              {weekAverage >= 0 ? '+' : ''}{weekAverage}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{streak} days</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#8b5cf6' }]}>
            <Text style={styles.statLabel}>Meals Today</Text>
            <Text style={styles.statValue}>{todayMeals.length}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log a Meal</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.actionCard,
                  { borderColor: action.color + '40' },
                ]}
                onPress={() => navigation.navigate('LogMeal', { method: action.id })}
              >
                <Ionicons
                  name={action.icon as any}
                  size={32}
                  color={action.color}
                />
                <Text style={styles.actionName}>{action.name}</Text>
                <Text style={styles.actionDescription}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Insights</Text>
          {insights.map((insight, idx) => (
            <View
              key={idx}
              style={[
                styles.insightCard,
                {
                  borderLeftColor:
                    insight.type === 'success'
                      ? '#10b981'
                      : insight.type === 'tip'
                      ? '#3b82f6'
                      : '#f59e0b',
                },
              ]}
            >
              <Ionicons
                name={insight.icon as any}
                size={20}
                color={
                  insight.type === 'success'
                    ? '#10b981'
                    : insight.type === 'tip'
                    ? '#3b82f6'
                    : '#f59e0b'
                }
              />
              <Text style={styles.insightText}>{insight.message}</Text>
            </View>
          ))}
        </View>

        {/* Recent Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          {todayMeals.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>
                No meals logged today yet
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Tap below to start tracking
              </Text>
            </View>
          ) : (
            todayMeals.map((meal) => (
              <TouchableOpacity key={meal.id} style={styles.mealCard}>
                <View>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealDetails}>
                    {meal.time} - {meal.items.length} item{meal.items.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View
                  style={[
                    styles.scoreBadge,
                    {
                      backgroundColor:
                        meal.totalScore >= 5
                          ? '#d1fae5'
                          : meal.totalScore >= 0
                          ? '#dbeafe'
                          : '#fee2e2',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreBadgeText,
                      {
                        color:
                          meal.totalScore >= 5
                            ? '#047857'
                            : meal.totalScore >= 0
                            ? '#1e40af'
                            : '#dc2626',
                      },
                    ]}
                  >
                    {meal.totalScore >= 0 ? '+' : ''}{meal.totalScore}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
          <TouchableOpacity
            style={styles.addMealButton}
            onPress={() => navigation.navigate('LogMeal')}
          >
            <Text style={styles.addMealButtonText}>+ Add Another Meal</Text>
          </TouchableOpacity>
        </View>

        {/* Learning Module */}
        <View style={styles.learningSection}>
          <Text style={styles.learningSectionTitle}>Continue Learning</Text>
          <View style={styles.learningCard}>
            <Text style={styles.learningTitle}>Week 1: Foundation</Text>
            <Text style={styles.learningSubtitle}>
              Next lesson: "Meet Your Enteric Nervous System"
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '75%' }]} />
            </View>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => navigation.navigate('Learn')}
            >
              <Text style={styles.continueButtonText}>Continue Lesson</Text>
            </TouchableOpacity>
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
  header: {
    backgroundColor: '#1e3a8a',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#1f2937',
  },
  actionDescription: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  insightCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },
  mealCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  mealDetails: {
    fontSize: 13,
    color: '#6b7280',
  },
  scoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  addMealButton: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  addMealButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  learningSection: {
    backgroundColor: '#3b82f6',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  learningSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  learningCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 8,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  learningSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  continueButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
});

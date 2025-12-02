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
import { useApp } from '../context/AppContext';

export default function HomeScreen({ navigation }: any) {
  const { userStats, getTodaysMeals, userProfile } = useApp();
  const [notifications] = useState(3);

  const todaysMeals = getTodaysMeals();

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

  // Generate dynamic insights based on actual data
  const generateInsights = () => {
    const insights = [];

    if (userStats.energyImprovement > 0) {
      insights.push({
        type: 'success',
        message: `Your energy levels are up ${userStats.energyImprovement}% this week!`,
        icon: 'flash',
      });
    }

    if (userStats.streak >= 3) {
      insights.push({
        type: 'success',
        message: `${userStats.streak}-day streak! Keep it going!`,
        icon: 'flame',
      });
    }

    insights.push({
      type: 'tip',
      message: 'Add more sulforaphane - try broccoli or Brussels sprouts today',
      icon: 'bulb',
    });

    if (userProfile.sensitivities.includes('Nightshades')) {
      insights.push({
        type: 'warning',
        message: 'Watch out for nightshades - may trigger symptoms',
        icon: 'warning',
      });
    }

    return insights.slice(0, 3);
  };

  const insights = generateInsights();

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
                Cellular Biology Intelligence
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
            <Text style={styles.statValue}>+{userStats.todayScore}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#3b82f6' }]}>
            <Text style={styles.statLabel}>Week Average</Text>
            <Text style={styles.statValue}>+{userStats.weekAverage}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{userStats.streak} 🔥</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#8b5cf6' }]}>
            <Text style={styles.statLabel}>Energy</Text>
            <Text style={styles.statValue}>{userStats.energyLevel}/10</Text>
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
          {todaysMeals.length > 0 ? (
            todaysMeals.map((meal, idx) => (
              <TouchableOpacity key={idx} style={styles.mealCard}>
                <View>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealDetails}>
                    {meal.time} • {meal.items} items
                  </Text>
                </View>
                <View
                  style={[
                    styles.scoreBadge,
                    {
                      backgroundColor:
                        meal.score >= 10
                          ? '#d1fae5'
                          : meal.score >= 5
                          ? '#dbeafe'
                          : '#fef3c7',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreBadgeText,
                      {
                        color:
                          meal.score >= 10
                            ? '#047857'
                            : meal.score >= 5
                            ? '#1e40af'
                            : '#92400e',
                      },
                    ]}
                  >
                    +{meal.score}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noMealsCard}>
              <Ionicons name="restaurant-outline" size={48} color="#d1d5db" />
              <Text style={styles.noMealsText}>No meals logged today</Text>
              <Text style={styles.noMealsSubtext}>
                Tap a button above to add your first meal
              </Text>
            </View>
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
              <Text style={styles.continueButtonText}>Continue Lesson →</Text>
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
  noMealsCard: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  noMealsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 12,
  },
  noMealsSubtext: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
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

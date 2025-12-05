import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { stats, insights, todayMeals, isLoading, refreshAll } = useApp();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAll();
    setRefreshing(false);
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

  // Format meals for display
  const recentMeals = todayMeals.slice(0, 3).map((meal) => ({
    name: meal.name || meal.type.charAt(0).toUpperCase() + meal.type.slice(1),
    time: new Date(meal.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    score: meal.totalScore,
    items: meal.items.length,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
                {user ? `Welcome, ${user.name}` : 'Enteric Nervous System Support'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="white" />
            {insights.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {insights.length}
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
              {stats.todayScore >= 0 ? '+' : ''}{stats.todayScore}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#3b82f6' }]}>
            <Text style={styles.statLabel}>Week Average</Text>
            <Text style={styles.statValue}>
              {stats.weekAverage >= 0 ? '+' : ''}{stats.weekAverage}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{stats.streak} 🔥</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#8b5cf6' }]}>
            <Text style={styles.statLabel}>Energy</Text>
            <Text style={styles.statValue}>{stats.energyLevel}/10</Text>
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
          {insights.length > 0 ? (
            insights.slice(0, 3).map((insight, idx) => (
              <View
                key={insight.id || idx}
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
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Log your first meal to see personalized insights!
              </Text>
            </View>
          )}
        </View>

        {/* Recent Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          {recentMeals.length > 0 ? (
            recentMeals.map((meal, idx) => (
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
                          : meal.score >= 0
                          ? '#fef3c7'
                          : '#fee2e2',
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
                            : meal.score >= 0
                            ? '#92400e'
                            : '#dc2626',
                      },
                    ]}
                  >
                    {meal.score >= 0 ? '+' : ''}{meal.score}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No meals logged yet today
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
  emptyState: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#6b7280',
    fontSize: 14,
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

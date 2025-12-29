import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Panel from './Panel';

interface Meal {
  name: string;
  time: string;
  score: number;
  items: number;
}

interface Stats {
  todayScore: number;
  weekAverage: number;
  streak: number;
  energyLevel: number;
  weightChange: number;
}

interface ScoreDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stats: Stats;
  meals: Meal[];
}

export default function ScoreDetailPanel({
  isOpen,
  onClose,
  stats,
  meals,
}: ScoreDetailPanelProps) {
  return (
    <Panel isOpen={isOpen} onClose={onClose} title="Today's Score Details">
      {/* Score Breakdown */}
      <View style={styles.scoreSection}>
        <View style={styles.mainScoreCircle}>
          <Text style={styles.mainScoreValue}>+{stats.todayScore}</Text>
          <Text style={styles.mainScoreLabel}>Today's Total</Text>
        </View>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={24} color="#3b82f6" />
          <Text style={styles.statValue}>+{stats.weekAverage}</Text>
          <Text style={styles.statLabel}>Week Average</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color="#f59e0b" />
          <Text style={styles.statValue}>{stats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="flash" size={24} color="#8b5cf6" />
          <Text style={styles.statValue}>{stats.energyLevel}/10</Text>
          <Text style={styles.statLabel}>Energy</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="scale" size={24} color="#10b981" />
          <Text style={styles.statValue}>{stats.weightChange} lbs</Text>
          <Text style={styles.statLabel}>Weight Change</Text>
        </View>
      </View>

      {/* Today's Meals */}
      <Text style={styles.sectionTitle}>Today's Meals</Text>
      {meals.length > 0 ? (
        meals.map((meal, idx) => (
          <View key={idx} style={styles.mealCard}>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealDetails}>
                {meal.time} - {meal.items} items
              </Text>
            </View>
            <View
              style={[
                styles.mealScore,
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
                  styles.mealScoreText,
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
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyStateText}>No meals logged yet today</Text>
        </View>
      )}

      <View style={styles.spacer} />
    </Panel>
  );
}

const styles = StyleSheet.create({
  scoreSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mainScoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  mainScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  mainScoreLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  mealDetails: {
    fontSize: 13,
    color: '#6b7280',
  },
  mealScore: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  mealScoreText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  spacer: {
    height: 24,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ScoreCardProps {
  todayScore: number;
  weekAverage: number;
  streak: number;
  onPress: () => void;
}

export default function ScoreCard({
  todayScore,
  weekAverage,
  streak,
  onPress,
}: ScoreCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.mainScore}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>+{todayScore}</Text>
          <Text style={styles.scoreLabel}>Today</Text>
        </View>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={16} color="#10b981" />
            <Text style={styles.statValue}>+{weekAverage}</Text>
            <Text style={styles.statLabel}>Week avg</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="flame" size={16} color="#f59e0b" />
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day streak</Text>
          </View>
        </View>
      </View>
      <View style={styles.tapHint}>
        <Text style={styles.tapHintText}>Tap to see details</Text>
        <Ionicons name="chevron-up" size={14} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  mainScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
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
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 4,
  },
  tapHintText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

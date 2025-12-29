import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Insight {
  type: 'success' | 'tip' | 'warning';
  message: string;
}

interface InsightTeaserProps {
  insights: Insight[];
  onPress: () => void;
}

export default function InsightTeaser({ insights, onPress }: InsightTeaserProps) {
  const successCount = insights.filter((i) => i.type === 'success').length;
  const tipCount = insights.filter((i) => i.type === 'tip').length;
  const warningCount = insights.filter((i) => i.type === 'warning').length;

  const primaryInsight = insights[0];
  const iconName =
    primaryInsight?.type === 'success'
      ? 'checkmark-circle'
      : primaryInsight?.type === 'tip'
      ? 'bulb'
      : 'warning';
  const iconColor =
    primaryInsight?.type === 'success'
      ? '#10b981'
      : primaryInsight?.type === 'tip'
      ? '#3b82f6'
      : '#f59e0b';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Today's Insights</Text>
          <Text style={styles.preview} numberOfLines={1}>
            {primaryInsight?.message || 'No insights yet'}
          </Text>
        </View>
        <View style={styles.badges}>
          {successCount > 0 && (
            <View style={[styles.badge, { backgroundColor: '#d1fae5' }]}>
              <Text style={[styles.badgeText, { color: '#047857' }]}>
                {successCount}
              </Text>
            </View>
          )}
          {tipCount > 0 && (
            <View style={[styles.badge, { backgroundColor: '#dbeafe' }]}>
              <Text style={[styles.badgeText, { color: '#1e40af' }]}>
                {tipCount}
              </Text>
            </View>
          )}
          {warningCount > 0 && (
            <View style={[styles.badge, { backgroundColor: '#fef3c7' }]}>
              <Text style={[styles.badgeText, { color: '#92400e' }]}>
                {warningCount}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  preview: {
    fontSize: 12,
    color: '#6b7280',
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

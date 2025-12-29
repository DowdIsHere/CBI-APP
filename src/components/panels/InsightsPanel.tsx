import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Panel from './Panel';

interface Insight {
  type: 'success' | 'tip' | 'warning';
  message: string;
  icon: string;
}

interface InsightsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  insights: Insight[];
}

export default function InsightsPanel({
  isOpen,
  onClose,
  insights,
}: InsightsPanelProps) {
  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'success':
        return {
          borderColor: '#10b981',
          iconColor: '#10b981',
          bgColor: '#d1fae5',
        };
      case 'tip':
        return {
          borderColor: '#3b82f6',
          iconColor: '#3b82f6',
          bgColor: '#dbeafe',
        };
      case 'warning':
        return {
          borderColor: '#f59e0b',
          iconColor: '#f59e0b',
          bgColor: '#fef3c7',
        };
      default:
        return {
          borderColor: '#6b7280',
          iconColor: '#6b7280',
          bgColor: '#f3f4f6',
        };
    }
  };

  const successInsights = insights.filter((i) => i.type === 'success');
  const tipInsights = insights.filter((i) => i.type === 'tip');
  const warningInsights = insights.filter((i) => i.type === 'warning');

  const renderInsightSection = (
    title: string,
    items: Insight[],
    icon: string,
    color: string
  ) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon as any} size={16} color={color} />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={[styles.countBadge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.countText, { color }]}>{items.length}</Text>
          </View>
        </View>
        {items.map((insight, idx) => {
          const style = getInsightStyle(insight.type);
          return (
            <View
              key={idx}
              style={[styles.insightCard, { borderLeftColor: style.borderColor }]}
            >
              <View
                style={[styles.insightIcon, { backgroundColor: style.bgColor }]}
              >
                <Ionicons
                  name={insight.icon as any}
                  size={18}
                  color={style.iconColor}
                />
              </View>
              <Text style={styles.insightText}>{insight.message}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Panel isOpen={isOpen} onClose={onClose} title="Today's Insights">
      {insights.length > 0 ? (
        <>
          {renderInsightSection(
            'Wins',
            successInsights,
            'checkmark-circle',
            '#10b981'
          )}
          {renderInsightSection('Tips', tipInsights, 'bulb', '#3b82f6')}
          {renderInsightSection(
            'Heads Up',
            warningInsights,
            'warning',
            '#f59e0b'
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="analytics-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyStateTitle}>No insights yet</Text>
          <Text style={styles.emptyStateText}>
            Log more meals to get personalized insights
          </Text>
        </View>
      )}
      <View style={styles.spacer} />
    </Panel>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  countBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 8,
    gap: 12,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  spacer: {
    height: 24,
  },
});

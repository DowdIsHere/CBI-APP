import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Achievement {
  id: number;
  name: string;
  icon: string;
  unlocked: boolean;
}

interface AchievementTeaserProps {
  achievements: Achievement[];
  onPress: () => void;
}

export default function AchievementTeaser({
  achievements,
  onPress,
}: AchievementTeaserProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const recentAchievements = achievements.filter((a) => a.unlocked).slice(0, 3);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="trophy" size={20} color="#f59e0b" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>
            {unlockedCount} of {totalCount} unlocked
          </Text>
        </View>
        <View style={styles.badgesContainer}>
          {recentAchievements.map((achievement, index) => (
            <View
              key={achievement.id}
              style={[styles.achievementBadge, { marginLeft: index > 0 ? -8 : 0 }]}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
            </View>
          ))}
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
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  badgesContainer: {
    flexDirection: 'row',
    marginRight: 12,
  },
  achievementBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  achievementIcon: {
    fontSize: 16,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLessonById } from '../data/learningContent';
import { useAppData } from '../data/AppContext';

export default function LessonScreen({ route, navigation }: any) {
  const { lessonId } = route.params;
  const lesson = getLessonById(lessonId);
  const { completeLesson, isLessonCompleted } = useAppData();

  const isCompleted = lesson ? isLessonCompleted(lessonId) : false;

  const handleComplete = () => {
    if (!lesson) return;

    if (isCompleted) {
      navigation.goBack();
      return;
    }

    completeLesson(lessonId, lesson.moduleId);
    Alert.alert(
      'Lesson Complete!',
      'Great job! Keep up the learning momentum.',
      [{ text: 'Continue', onPress: () => navigation.goBack() }]
    );
  };

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lesson not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={14} color="#6b7280" />
            <Text style={styles.durationText}>{lesson.duration}</Text>
          </View>
          <Text style={styles.title}>{lesson.title}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {lesson.content.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        {/* Key Points */}
        <View style={styles.keyPointsSection}>
          <Text style={styles.keyPointsTitle}>Key Points</Text>
          {lesson.keyPoints.map((point, index) => (
            <View key={index} style={styles.keyPoint}>
              <View style={styles.keyPointBullet}>
                <Ionicons name="checkmark" size={16} color="#10b981" />
              </View>
              <Text style={styles.keyPointText}>{point}</Text>
            </View>
          ))}
        </View>

        {/* Completion Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              isCompleted && styles.completedButton,
            ]}
            onPress={handleComplete}
          >
            <Ionicons
              name={isCompleted ? 'checkmark-done-circle' : 'checkmark-circle'}
              size={24}
              color="white"
            />
            <Text style={styles.completeButtonText}>
              {isCompleted ? 'Completed - Continue' : 'Mark as Complete'}
            </Text>
          </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  durationText: {
    fontSize: 14,
    color: '#6b7280',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    lineHeight: 32,
  },
  content: {
    padding: 20,
  },
  paragraph: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    marginBottom: 16,
  },
  keyPointsSection: {
    backgroundColor: '#f0fdf4',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  keyPointsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 16,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  keyPointBullet: {
    width: 24,
    height: 24,
    backgroundColor: '#d1fae5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyPointText: {
    flex: 1,
    fontSize: 15,
    color: '#166534',
    lineHeight: 22,
  },
  actionSection: {
    padding: 20,
    paddingBottom: 40,
  },
  completeButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  completedButton: {
    backgroundColor: '#6b7280',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

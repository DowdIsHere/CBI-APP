import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLessonsByModule } from '../data/learningContent';
import { useAppData } from '../data/AppContext';

export default function ModuleScreen({ route, navigation }: any) {
  const { moduleId, moduleTitle, moduleColor } = route.params;
  const lessons = getLessonsByModule(moduleId);
  const { data } = useAppData();

  const module = data.learningModules.find(m => m.id === moduleId);
  const completedLessons = module?.completedLessons || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Module Header */}
        <View style={[styles.header, { backgroundColor: moduleColor }]}>
          <Text style={styles.headerTitle}>{moduleTitle}</Text>
          <Text style={styles.headerSubtitle}>
            {completedLessons} of {lessons.length} lessons completed
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(completedLessons / lessons.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Lessons List */}
        <View style={styles.lessonsSection}>
          <Text style={styles.sectionTitle}>Lessons</Text>
          {lessons.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => navigation.navigate('Lesson', { lessonId: lesson.id })}
            >
              <View style={styles.lessonNumber}>
                <Text style={styles.lessonNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <View style={styles.lessonMeta}>
                  <Ionicons name="time-outline" size={14} color="#6b7280" />
                  <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                </View>
              </View>
              {lesson.completed ? (
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              ) : (
                <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Module Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>About This Module</Text>
          <Text style={styles.descriptionText}>
            {moduleId === '1' &&
              'Learn the foundational concepts behind the JD Mercer Protocol, including how your enteric nervous system works and why it matters for your health.'}
            {moduleId === '2' &&
              'Dive deep into the mechanisms that connect your gut, brain, and cellular health. Understand inflammation, omega balances, and the microbiome.'}
            {moduleId === '3' &&
              'Practical guidance on optimizing your nutrition for nervous system health. Learn what to eat, what to avoid, and how to structure your meals.'}
            {moduleId === '4' &&
              'Specific guidance for various health conditions. Learn how the protocol applies to autoimmune, neurological, and cognitive health.'}
          </Text>
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
    padding: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  lessonsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  lessonCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  lessonNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonDuration: {
    fontSize: 13,
    color: '#6b7280',
  },
  descriptionSection: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 24,
  },
});

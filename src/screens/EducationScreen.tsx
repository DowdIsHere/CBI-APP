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
import { useAppData } from '../data/AppContext';
import { articles, getLessonsByModule } from '../data/learningContent';

export default function EducationScreen({ navigation }: any) {
  const { data } = useAppData();
  const { learningModules, currentLesson } = data;

  // Get first incomplete lesson for continue button
  const getNextLesson = () => {
    for (const module of learningModules) {
      const moduleLessons = getLessonsByModule(module.id);
      const incompleteLesson = moduleLessons.find(l => !l.completed);
      if (incompleteLesson) {
        return incompleteLesson;
      }
    }
    return null;
  };

  const handleContinueLearning = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      navigation.navigate('Lesson', { lessonId: nextLesson.id });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Current Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>{currentLesson.week}</Text>
              <Text style={styles.progressSubtitle}>
                Next: {currentLesson.title}
              </Text>
            </View>
            <Text style={styles.progressPercent}>{currentLesson.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${currentLesson.progress}%` },
              ]}
            />
          </View>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueLearning}
          >
            <Text style={styles.continueButtonText}>Continue Learning</Text>
            <Ionicons name="arrow-forward" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Learning Modules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Modules</Text>
          {learningModules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              onPress={() => navigation.navigate('Module', {
                moduleId: module.id,
                moduleTitle: module.title,
                moduleColor: module.color,
              })}
            >
              <View
                style={[styles.moduleIcon, { backgroundColor: module.color }]}
              >
                <Ionicons name={module.icon as any} size={24} color="white" />
              </View>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleName}>{module.title}</Text>
                <Text style={styles.moduleDetails}>
                  {module.completedLessons}/{module.lessons} lessons • {module.duration}
                </Text>
              </View>
              {module.completedLessons === module.lessons ? (
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              ) : (
                <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Reads */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Reads</Text>
          {articles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleCard}
              onPress={() => navigation.navigate('Article', {
                articleId: article.id,
                articleTitle: article.title,
              })}
            >
              <View style={styles.articleIcon}>
                <Ionicons
                  name={article.icon as any}
                  size={20}
                  color="#3b82f6"
                />
              </View>
              <View style={styles.articleInfo}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <View style={styles.articleMeta}>
                  <Text style={styles.articleCategory}>
                    {article.category}
                  </Text>
                  <Text style={styles.articleDot}>•</Text>
                  <Text style={styles.articleReadTime}>
                    {article.readTime}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Concepts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Concepts</Text>

          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>What is Mido?</Text>
            <Text style={styles.conceptText}>
              A science-based approach to understanding how food either
              enhances or impairs your body's natural intelligence systems.
            </Text>
          </View>

          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Enteric Nervous System</Text>
            <Text style={styles.conceptText}>
              Your "second brain" with over 100 million neurons in your gut,
              producing 95% of your serotonin and 50% of your dopamine.
            </Text>
          </View>

          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Gut-Brain-Mitochondria Axis</Text>
            <Text style={styles.conceptText}>
              The communication network between your gut, brain, and cellular
              energy producers that determines your health.
            </Text>
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked</Text>

          <TouchableOpacity style={styles.faqCard}>
            <Text style={styles.faqQuestion}>
              How quickly will I see results?
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.faqCard}>
            <Text style={styles.faqQuestion}>
              What makes the Dowd Protocol different?
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.faqCard}>
            <Text style={styles.faqQuestion}>
              Can I follow this with dietary restrictions?
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6b7280" />
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
  progressSection: {
    backgroundColor: '#3b82f6',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  continueButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
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
  moduleCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleInfo: {
    flex: 1,
  },
  moduleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  moduleDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  articleCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
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
  articleIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  articleCategory: {
    fontSize: 12,
    color: '#6b7280',
  },
  articleDot: {
    fontSize: 12,
    color: '#9ca3af',
  },
  articleReadTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  conceptCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  conceptTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  conceptText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  faqCard: {
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
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
});

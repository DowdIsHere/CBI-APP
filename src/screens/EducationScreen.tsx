import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function EducationScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const currentWeek = {
    title: 'Week 1: Foundation',
    lesson: 'Meet Your Enteric Nervous System',
    progress: 75,
  };

  const modules = [
    {
      id: 1,
      title: 'Foundation',
      lessons: 4,
      duration: '20 min',
      icon: 'school',
      color: '#3b82f6',
      completed: true,
    },
    {
      id: 2,
      title: 'Mechanisms',
      lessons: 5,
      duration: '30 min',
      icon: 'cog',
      color: '#8b5cf6',
      completed: false,
    },
    {
      id: 3,
      title: 'Optimization',
      lessons: 6,
      duration: '35 min',
      icon: 'fitness',
      color: '#10b981',
      completed: false,
    },
    {
      id: 4,
      title: 'Disease-Specific',
      lessons: 4,
      duration: '25 min',
      icon: 'medical',
      color: '#ef4444',
      completed: false,
    },
  ];

  const articles = [
    {
      id: 1,
      title: 'The Gut-Brain Connection',
      category: 'Science',
      readTime: '5 min',
      icon: 'book',
    },
    {
      id: 2,
      title: 'Omega-3s and Brain Health',
      category: 'Nutrition',
      readTime: '7 min',
      icon: 'nutrition',
    },
    {
      id: 3,
      title: 'Sulforaphane Benefits',
      category: 'Research',
      readTime: '6 min',
      icon: 'flask',
    },
  ];

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'How quickly will I see results?',
      answer:
        'Most people notice improvements in energy and mental clarity within 2-4 weeks of following the Dowd Protocol consistently. More significant changes like improved symptoms and lab markers typically appear after 8-12 weeks. Remember, you\'re rebuilding your cellular health from the inside out - this takes time but the results are lasting.',
    },
    {
      id: 2,
      question: 'What makes the Dowd Protocol different?',
      answer:
        'Unlike conventional diets that focus on calories or macros, the Dowd Protocol targets your Enteric Nervous System (ENS) - your "second brain." By optimizing the gut-brain-mitochondria axis through specific foods, we support cellular intelligence rather than just body composition. This science-based approach addresses root causes rather than just symptoms.',
    },
    {
      id: 3,
      question: 'Can I follow this with dietary restrictions?',
      answer:
        'Absolutely! The Dowd Protocol is highly adaptable. Whether you\'re vegetarian, have food allergies, or follow religious dietary laws, there are always alternative foods that provide similar CBI benefits. The app tracks your restrictions and provides personalized recommendations that work within your constraints.',
    },
    {
      id: 4,
      question: 'What is a CBI Score?',
      answer:
        'CBI (Cellular Biology Intelligence) Score measures how foods affect your body\'s natural intelligence systems. Positive scores (+1 to +3) indicate foods that support your ENS, mitochondria, and gut health. Negative scores (-1 to -3) indicate foods that may cause inflammation or disrupt cellular function. Your daily goal is to accumulate positive points.',
    },
    {
      id: 5,
      question: 'How do I track my progress?',
      answer:
        'The app automatically tracks your meals, calculates daily and weekly CBI scores, and monitors your streak. Over time, you\'ll see trends in your Progress tab showing how your food choices correlate with energy levels, mood, and other health metrics. The more consistent you are, the clearer the patterns become.',
    },
  ];

  const toggleFaq = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Current Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>{currentWeek.title}</Text>
              <Text style={styles.progressSubtitle}>
                Next: {currentWeek.lesson}
              </Text>
            </View>
            <Text style={styles.progressPercent}>{currentWeek.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${currentWeek.progress}%` },
              ]}
            />
          </View>
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continue Learning</Text>
            <Ionicons name="arrow-forward" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Learning Modules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Modules</Text>
          {modules.map((module) => (
            <TouchableOpacity key={module.id} style={styles.moduleCard}>
              <View
                style={[styles.moduleIcon, { backgroundColor: module.color }]}
              >
                <Ionicons name={module.icon as any} size={24} color="white" />
              </View>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleName}>{module.title}</Text>
                <Text style={styles.moduleDetails}>
                  {module.lessons} lessons • {module.duration}
                </Text>
              </View>
              {module.completed ? (
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
            <TouchableOpacity key={article.id} style={styles.articleCard}>
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
            <Text style={styles.conceptTitle}>What is CBI?</Text>
            <Text style={styles.conceptText}>
              Cognition Blocks of Intelligence - Understanding how food either
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

        {/* FAQs with Expansion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked</Text>

          {faqs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqCard}
              onPress={() => toggleFaq(faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#6b7280"
                />
              </View>
              {expandedFaq === faq.id && (
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 24 }} />
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
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    paddingRight: 12,
  },
  faqAnswerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  faqAnswer: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LessonContent {
  title: string;
  content: string[];
}

const lessonData: Record<string, LessonContent[]> = {
  Foundation: [
    {
      title: 'Meet Your Enteric Nervous System',
      content: [
        'Your gut contains over 100 million neurons - more than your spinal cord. This is your Enteric Nervous System (ENS), often called your "second brain."',
        'The ENS produces 95% of your body\'s serotonin and 50% of your dopamine. These neurotransmitters affect your mood, sleep, and cognitive function.',
        'When you eat foods that support the ENS, you directly improve your mental clarity, emotional balance, and energy levels.',
      ],
    },
    {
      title: 'The Gut-Brain Axis',
      content: [
        'The vagus nerve is a superhighway connecting your gut to your brain. It carries signals in both directions, meaning your gut health directly impacts brain function.',
        'Inflammation in the gut causes inflammation in the brain. This is why food sensitivities can cause brain fog, anxiety, and fatigue.',
        'By choosing anti-inflammatory foods, you reduce neuroinflammation and support optimal cognitive performance.',
      ],
    },
    {
      title: 'Understanding Food Scoring',
      content: [
        'Every food in the CBI system receives a score based on its impact on three systems: Gut (ENS), Brain (CNS), and Cells (Mitochondria).',
        'Positive scores (+1 to +3) indicate foods that support these systems. Examples include wild salmon (+3), broccoli (+2), and blueberries (+2).',
        'Negative scores indicate foods that harm these systems, such as processed seed oils (-2) and artificial sweeteners (-1).',
        'Your daily goal is to achieve a positive total score, indicating net benefit to your biological intelligence systems.',
      ],
    },
    {
      title: 'Your First Week Plan',
      content: [
        'Week 1 is about awareness, not perfection. Simply log everything you eat and observe your scores.',
        'Focus on adding one high-scoring food per meal rather than eliminating foods. Addition before subtraction.',
        'Pay attention to how you feel 30-60 minutes after eating. Notice patterns between food scores and your energy levels.',
        'By the end of Week 1, you\'ll have baseline data and a clear picture of your current dietary impact on your ENS.',
      ],
    },
  ],
  Mechanisms: [
    {
      title: 'Mitochondrial Function & Food',
      content: [
        'Mitochondria are the powerhouses of your cells. They convert food into ATP (energy). The quality of food you eat directly affects how efficiently they work.',
        'Omega-3 fatty acids strengthen mitochondrial membranes. Wild salmon, sardines, and walnuts are excellent sources.',
        'Sulforaphane from cruciferous vegetables (broccoli, kale) activates NRF2, a pathway that creates new mitochondria and repairs damaged ones.',
      ],
    },
    {
      title: 'Inflammatory vs Anti-inflammatory Foods',
      content: [
        'Chronic inflammation is the root of most modern diseases. Your diet is the most powerful lever to control inflammation.',
        'Seed oils (canola, soybean, sunflower) are highly inflammatory due to their omega-6 content. They\'re hidden in most processed foods.',
        'Anti-inflammatory champions include turmeric, ginger, wild-caught fish, extra virgin olive oil, and colorful vegetables.',
      ],
    },
  ],
  Optimization: [
    {
      title: 'The Power of Fasting Windows',
      content: [
        'Time-restricted eating gives your ENS time to rest and repair. A 12-16 hour overnight fast activates autophagy - cellular cleanup.',
        'During fasting, your gut lining repairs itself. This is critical for reducing intestinal permeability ("leaky gut").',
        'Start with a 12-hour fast (e.g., 7pm to 7am) and gradually extend as it becomes comfortable.',
      ],
    },
  ],
};

export default function EducationScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeLesson, setActiveLesson] = useState<LessonContent | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

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
      completed: false,
    },
    {
      id: 2,
      title: 'Mechanisms',
      lessons: 2,
      duration: '15 min',
      icon: 'cog',
      color: '#8b5cf6',
      completed: false,
    },
    {
      id: 3,
      title: 'Optimization',
      lessons: 1,
      duration: '10 min',
      icon: 'fitness',
      color: '#10b981',
      completed: false,
    },
    {
      id: 4,
      title: 'Disease-Specific',
      lessons: 0,
      duration: 'Coming soon',
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
      content: 'Your gut and brain are in constant communication through the vagus nerve, neurotransmitters, and immune signaling molecules. This bidirectional highway means that what you eat directly impacts how you think and feel. Research shows that a healthy gut microbiome is essential for optimal brain function, mood regulation, and even memory formation.',
    },
    {
      id: 2,
      title: 'Omega-3s and Brain Health',
      category: 'Nutrition',
      readTime: '7 min',
      icon: 'nutrition',
      content: 'Omega-3 fatty acids (EPA and DHA) are critical building blocks for brain cell membranes. They reduce neuroinflammation, support neurotransmitter function, and promote neuroplasticity. Wild-caught salmon, sardines, mackerel, and anchovies are the best dietary sources. Aim for 2-3 servings of fatty fish per week for optimal brain support.',
    },
    {
      id: 3,
      title: 'Sulforaphane Benefits',
      category: 'Research',
      readTime: '6 min',
      icon: 'flask',
      content: 'Sulforaphane, found in cruciferous vegetables like broccoli and broccoli sprouts, is one of the most powerful natural compounds for cellular health. It activates the NRF2 pathway, which turns on over 200 protective genes. Benefits include reduced inflammation, enhanced detoxification, improved mitochondrial function, and protection against oxidative stress.',
    },
  ];

  const faqs = [
    {
      question: 'How quickly will I see results?',
      answer: 'Most people notice improved energy and mental clarity within 3-7 days of following the protocol. Significant gut health improvements typically occur within 2-4 weeks. Long-term benefits like reduced inflammation markers continue to improve over 3-6 months.',
    },
    {
      question: 'What makes the Dowd Protocol different?',
      answer: 'Unlike traditional diets that focus on calories or macros, the Dowd Protocol scores foods based on their impact on your three intelligence systems: Enteric (gut), Central (brain), and Cellular (mitochondria). This approach addresses root causes of health issues rather than symptoms.',
    },
    {
      question: 'Can I follow this with dietary restrictions?',
      answer: 'Absolutely. The protocol is highly adaptable. Whether you\'re vegan, vegetarian, keto, or have specific allergies, there are high-scoring foods available in every dietary framework. The app tracks your restrictions and adjusts recommendations accordingly.',
    },
    {
      question: 'How does the scoring system work?',
      answer: 'Each food is scored from -3 to +3 based on its impact on the ENS, CNS, and mitochondria. Positive scores indicate beneficial foods, while negative scores indicate harmful ones. Your daily total gives a snapshot of your dietary impact. Aim for +10 or higher per day.',
    },
  ];

  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);

  const openModule = (moduleTitle: string) => {
    const lessons = lessonData[moduleTitle];
    if (lessons && lessons.length > 0) {
      setActiveLesson(lessons[0]);
      setActiveLessonIndex(0);
    }
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
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => openModule('Foundation')}
          >
            <Text style={styles.continueButtonText}>Continue Learning</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Learning Modules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Modules</Text>
          {modules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              onPress={() => openModule(module.title)}
              disabled={module.lessons === 0}
            >
              <View
                style={[styles.moduleIcon, { backgroundColor: module.color }]}
              >
                <Ionicons name={module.icon as any} size={24} color="white" />
              </View>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleName}>{module.title}</Text>
                <Text style={styles.moduleDetails}>
                  {module.lessons > 0 ? `${module.lessons} lessons` : ''} {module.duration}
                </Text>
              </View>
              {module.lessons > 0 ? (
                <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
              ) : (
                <Ionicons name="lock-closed" size={20} color="#9ca3af" />
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
              onPress={() => setSelectedArticle(article)}
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
                  <Text style={styles.articleDot}>-</Text>
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
              Cellular Biology Intelligence - Understanding how food either
              enhances or impairs your body's natural intelligence systems:
              Gut (ENS), Brain (CNS), and Cells (Mitochondria).
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
          {faqs.map((faq, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.faqCard}
              onPress={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedFaq === idx ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#6b7280"
                />
              </View>
              {expandedFaq === idx && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Lesson Modal */}
      <Modal
        visible={activeLesson !== null}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveLesson(null)}>
              <Ionicons name="close" size={28} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>
              Lesson {activeLessonIndex + 1}
            </Text>
            <View style={{ width: 28 }} />
          </View>
          {activeLesson && (
            <ScrollView style={styles.modalContent}>
              <Text style={styles.lessonTitle}>{activeLesson.title}</Text>
              {activeLesson.content.map((paragraph, idx) => (
                <Text key={idx} style={styles.lessonParagraph}>
                  {paragraph}
                </Text>
              ))}
              <TouchableOpacity
                style={styles.lessonNextButton}
                onPress={() => {
                  // Try to advance to next lesson in the current module
                  for (const [, lessons] of Object.entries(lessonData)) {
                    const currentIdx = lessons.findIndex(
                      (l) => l.title === activeLesson.title
                    );
                    if (currentIdx !== -1 && currentIdx < lessons.length - 1) {
                      setActiveLesson(lessons[currentIdx + 1]);
                      setActiveLessonIndex(currentIdx + 1);
                      return;
                    }
                  }
                  setActiveLesson(null);
                }}
              >
                <Text style={styles.lessonNextButtonText}>
                  Next Lesson
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* Article Modal */}
      <Modal
        visible={selectedArticle !== null}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedArticle(null)}>
              <Ionicons name="close" size={28} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>
              {selectedArticle?.category}
            </Text>
            <View style={{ width: 28 }} />
          </View>
          {selectedArticle && (
            <ScrollView style={styles.modalContent}>
              <Text style={styles.lessonTitle}>{selectedArticle.title}</Text>
              <View style={styles.articleMetaBadge}>
                <Text style={styles.articleMetaText}>
                  {selectedArticle.readTime} read
                </Text>
              </View>
              <Text style={styles.lessonParagraph}>
                {selectedArticle.content}
              </Text>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
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
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  lessonParagraph: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  lessonNextButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 32,
  },
  lessonNextButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  articleMetaBadge: {
    backgroundColor: '#dbeafe',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  articleMetaText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
  },
});

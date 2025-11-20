import React, { useState } from 'react';
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
import { getLesson, getLessonsByModule } from '../data/lessonContent';

export default function LessonScreen({ route, navigation }: any) {
  const { lessonId } = route.params;
  const lesson = getLesson(lessonId);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Lesson not found</Text>
      </SafeAreaView>
    );
  }

  const moduleLessons = getLessonsByModule(lesson.moduleId);
  const currentIndex = moduleLessons.findIndex((l) => l.id === lessonId);
  const hasNext = currentIndex < moduleLessons.length - 1;
  const hasPrevious = currentIndex > 0;
  const nextLesson = hasNext ? moduleLessons[currentIndex + 1] : null;
  const previousLesson = hasPrevious ? moduleLessons[currentIndex - 1] : null;

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const submitQuiz = () => {
    if (!lesson.quiz) return;

    const correctCount = lesson.quiz.filter(
      (q, idx) => quizAnswers[idx] === q.correctAnswer
    ).length;

    setQuizSubmitted(true);

    Alert.alert(
      'Quiz Complete!',
      `You got ${correctCount} out of ${lesson.quiz.length} correct!\n\n${
        correctCount === lesson.quiz.length
          ? '🎉 Perfect score! You really understand this material.'
          : correctCount >= lesson.quiz.length / 2
          ? '👍 Good job! Review the explanations to deepen your understanding.'
          : '📚 Take some time to review the lesson content and try again.'
      }`,
      [{ text: 'OK' }]
    );
  };

  const markComplete = () => {
    Alert.alert(
      'Lesson Complete! 🎉',
      'Great job completing this lesson. Keep up the learning!',
      [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]
    );
  };

  const renderContent = () => {
    return lesson.content.map((section, idx) => {
      switch (section.type) {
        case 'heading':
          return (
            <Text key={idx} style={styles.heading}>
              {section.content as string}
            </Text>
          );
        case 'text':
          return (
            <Text key={idx} style={styles.text}>
              {section.content as string}
            </Text>
          );
        case 'bullets':
          return (
            <View key={idx} style={styles.bulletsContainer}>
              {(section.content as string[]).map((bullet, bulletIdx) => (
                <View key={bulletIdx} style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          );
        case 'quote':
          return (
            <View key={idx} style={styles.quoteContainer}>
              <Ionicons name="quote" size={24} color="#3b82f6" />
              <Text style={styles.quoteText}>{section.content as string}</Text>
            </View>
          );
        case 'highlight':
          return (
            <View key={idx} style={styles.highlightContainer}>
              <Text style={styles.highlightText}>
                {section.content as string}
              </Text>
            </View>
          );
        default:
          return null;
      }
    });
  };

  const renderQuiz = () => {
    if (!lesson.quiz || !showQuiz) return null;

    return (
      <View style={styles.quizSection}>
        <Text style={styles.quizTitle}>Knowledge Check 🎯</Text>
        <Text style={styles.quizSubtitle}>
          Test your understanding of this lesson
        </Text>

        {lesson.quiz.map((question, qIdx) => (
          <View key={qIdx} style={styles.questionCard}>
            <Text style={styles.questionText}>
              {qIdx + 1}. {question.question}
            </Text>

            {question.options.map((option, oIdx) => {
              const isSelected = quizAnswers[qIdx] === oIdx;
              const isCorrect = oIdx === question.correctAnswer;
              const showResult = quizSubmitted;

              return (
                <TouchableOpacity
                  key={oIdx}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                    showResult && isCorrect && styles.optionButtonCorrect,
                    showResult &&
                      isSelected &&
                      !isCorrect &&
                      styles.optionButtonIncorrect,
                  ]}
                  onPress={() =>
                    !quizSubmitted && handleQuizAnswer(qIdx, oIdx)
                  }
                  disabled={quizSubmitted}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                      showResult && isCorrect && styles.optionTextCorrect,
                    ]}
                  >
                    {option}
                  </Text>
                  {showResult && isCorrect && (
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <Ionicons name="close-circle" size={20} color="#ef4444" />
                  )}
                </TouchableOpacity>
              );
            })}

            {quizSubmitted && (
              <View style={styles.explanationBox}>
                <Ionicons name="information-circle" size={20} color="#3b82f6" />
                <Text style={styles.explanationText}>
                  {question.explanation}
                </Text>
              </View>
            )}
          </View>
        ))}

        {!quizSubmitted ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              quizAnswers.length !== lesson.quiz.length &&
                styles.submitButtonDisabled,
            ]}
            onPress={submitQuiz}
            disabled={quizAnswers.length !== lesson.quiz.length}
          >
            <Text style={styles.submitButtonText}>Submit Quiz</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setQuizAnswers([]);
              setQuizSubmitted(false);
            }}
          >
            <Ionicons name="refresh" size={20} color="#3b82f6" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonDuration}>
              <Ionicons name="time" size={14} color="#6b7280" /> {lesson.duration}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentSection}>{renderContent()}</View>

        {/* Key Takeaways */}
        <View style={styles.takeawaysSection}>
          <Text style={styles.takeawaysTitle}>
            <Ionicons name="bulb" size={20} color="#f59e0b" /> Key Takeaways
          </Text>
          {lesson.keyTakeaways.map((takeaway, idx) => (
            <View key={idx} style={styles.takeawayRow}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.takeawayText}>{takeaway}</Text>
            </View>
          ))}
        </View>

        {/* Quiz Button */}
        {lesson.quiz && !showQuiz && (
          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => setShowQuiz(true)}
          >
            <Ionicons name="school" size={20} color="white" />
            <Text style={styles.quizButtonText}>Take Knowledge Check</Text>
          </TouchableOpacity>
        )}

        {/* Quiz */}
        {renderQuiz()}

        {/* Navigation Buttons */}
        <View style={styles.navigationSection}>
          <View style={styles.navButtons}>
            {hasPrevious ? (
              <TouchableOpacity
                style={styles.navButton}
                onPress={() =>
                  navigation.replace('Lesson', { lessonId: previousLesson!.id })
                }
              >
                <Ionicons name="chevron-back" size={20} color="#6b7280" />
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.navButtonPlaceholder} />
            )}

            {hasNext ? (
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonNext]}
                onPress={() =>
                  navigation.replace('Lesson', { lessonId: nextLesson!.id })
                }
              >
                <Text style={[styles.navButtonText, styles.navButtonTextNext]}>
                  Next Lesson
                </Text>
                <Ionicons name="chevron-forward" size={20} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonComplete]}
                onPress={markComplete}
              >
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={[styles.navButtonText, styles.navButtonTextNext]}>
                  Complete Module
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 14,
    color: '#6b7280',
  },
  contentSection: {
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4b5563',
    marginBottom: 16,
  },
  bulletsContainer: {
    marginBottom: 16,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 18,
    color: '#3b82f6',
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#4b5563',
  },
  quoteContainer: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    marginBottom: 16,
    flexDirection: 'row',
    gap: 12,
  },
  quoteText: {
    flex: 1,
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
    color: '#1e40af',
  },
  highlightContainer: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    marginBottom: 16,
  },
  highlightText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#92400e',
    fontWeight: '600',
  },
  takeawaysSection: {
    backgroundColor: '#ecfdf5',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  takeawaysTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  takeawayText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#047857',
    fontWeight: '600',
  },
  quizButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    gap: 8,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizSection: {
    padding: 16,
  },
  quizTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  quizSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  questionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  optionButtonCorrect: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  optionButtonIncorrect: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  optionText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  optionTextSelected: {
    color: '#1e40af',
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: '#047857',
    fontWeight: '600',
  },
  explanationBox: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  explanationText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationSection: {
    padding: 16,
    paddingBottom: 32,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButtonNext: {
    backgroundColor: '#3b82f6',
  },
  navButtonComplete: {
    backgroundColor: '#10b981',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  navButtonTextNext: {
    color: 'white',
  },
  navButtonPlaceholder: {
    flex: 1,
  },
});

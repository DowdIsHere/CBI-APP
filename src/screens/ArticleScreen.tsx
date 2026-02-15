import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getArticleById } from '../data/learningContent';

export default function ArticleScreen({ route }: any) {
  const { articleId } = route.params;
  const article = getArticleById(articleId);

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Article not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{article.category}</Text>
            </View>
            <View style={styles.readTimeBadge}>
              <Ionicons name="time-outline" size={14} color="#6b7280" />
              <Text style={styles.readTimeText}>{article.readTime}</Text>
            </View>
          </View>
          <Text style={styles.title}>{article.title}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {article.content.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        {/* Key Takeaways */}
        <View style={styles.takeawaysSection}>
          <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
          {article.keyTakeaways.map((takeaway, index) => (
            <View key={index} style={styles.takeaway}>
              <View style={styles.takeawayBullet}>
                <Ionicons name="bulb" size={16} color="#3b82f6" />
              </View>
              <Text style={styles.takeawayText}>{takeaway}</Text>
            </View>
          ))}
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
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 13,
    color: '#1e40af',
    fontWeight: '600',
  },
  readTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    lineHeight: 34,
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
  takeawaysSection: {
    backgroundColor: '#eff6ff',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  takeawaysTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 16,
  },
  takeaway: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  takeawayBullet: {
    width: 28,
    height: 28,
    backgroundColor: '#dbeafe',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takeawayText: {
    flex: 1,
    fontSize: 15,
    color: '#1e40af',
    lineHeight: 22,
  },
});

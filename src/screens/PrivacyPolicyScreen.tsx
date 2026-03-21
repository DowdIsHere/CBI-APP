import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const sections = [
  {
    title: 'Information We Collect',
    body: `When you use CBI - Cellular Biology Intelligence, we collect the following types of information:

• Account Information: Email address and authentication credentials when you create an account.
• Health & Nutrition Data: Meal logs, food items, nutritional scores, fasting schedules, and health conditions you voluntarily provide.
• Photos: Meal photos you capture or upload for AI-powered nutritional analysis. Photos are stored securely in our cloud infrastructure.
• Usage Data: App interactions, feature usage patterns, and lesson progress to improve your experience.
• Device Information: Device type, operating system version, and push notification tokens for delivering reminders.`,
  },
  {
    title: 'How We Use Your Information',
    body: `We use your information to:

• Provide personalized nutritional analysis and meal scoring based on the Dowd Protocol's three intelligence systems (ENS, CNS, Mitochondria).
• Track your meal history, streaks, and learning progress.
• Send push notification reminders for meals and fasting schedules (with your permission).
• Improve our AI analysis models and app functionality.
• Communicate important updates about the service.`,
  },
  {
    title: 'Data Storage & Security',
    body: `Your data is stored securely using Supabase, which provides enterprise-grade security including:

• Encryption in transit (TLS/SSL) and at rest.
• Row-level security policies ensuring you can only access your own data.
• Regular security audits and compliance monitoring.
• Meal photos are stored in secure, access-controlled cloud storage buckets.`,
  },
  {
    title: 'Data Sharing',
    body: `We do not sell your personal information. We may share data with:

• Service Providers: Cloud infrastructure (Supabase), AI analysis services (OpenAI) — only as needed to provide app functionality.
• Legal Requirements: When required by law or to protect our rights.

AI meal analysis sends photo data to third-party AI services for processing. No personally identifiable information is included with these requests.`,
  },
  {
    title: 'Your Rights',
    body: `You have the right to:

• Access: Export all your data at any time using the Export Data feature in your profile.
• Delete: Request deletion of your account and all associated data by contacting support@thedowdprotocol.com.
• Opt-Out: Disable push notifications at any time through your device settings.
• Correct: Update your health profile and personal information within the app.`,
  },
  {
    title: 'Children\'s Privacy',
    body: 'CBI is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.',
  },
  {
    title: 'Changes to This Policy',
    body: 'We may update this privacy policy from time to time. We will notify you of any material changes through the app or via email. Continued use of the app after changes constitutes acceptance of the updated policy.',
  },
  {
    title: 'Contact Us',
    body: `If you have questions about this privacy policy or your data, contact us at:

Email: support@thedowdprotocol.com
Website: https://thedowdprotocol.com`,
  },
];

export default function PrivacyPolicyScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: March 21, 2026</Text>
        <Text style={styles.intro}>
          The Dowd Protocol ("we", "our", "us") operates the CBI - Cellular
          Biology Intelligence mobile application. This privacy policy explains
          how we collect, use, and protect your information.
        </Text>
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  backButton: { fontSize: 16, color: '#1e3a8a', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  content: { flex: 1, paddingHorizontal: 20 },
  lastUpdated: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 20,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  intro: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 24,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionBody: { fontSize: 15, color: '#475569', lineHeight: 23 },
});

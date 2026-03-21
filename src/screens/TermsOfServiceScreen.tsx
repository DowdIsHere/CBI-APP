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
    title: '1. Acceptance of Terms',
    body: 'By downloading, installing, or using the CBI - Cellular Biology Intelligence app, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the app.',
  },
  {
    title: '2. Description of Service',
    body: `CBI is a nutritional intelligence application based on the Dowd Protocol. The app provides:

• AI-powered meal photo analysis and nutritional scoring
• Educational content about the three biological intelligence systems (ENS, CNS, Mitochondria)
• Meal tracking, fasting schedule management, and health insights
• Personalized recommendations based on your health profile

CBI is an educational and wellness tool. It is NOT a medical device and does not provide medical advice, diagnosis, or treatment.`,
  },
  {
    title: '3. Medical Disclaimer',
    body: `IMPORTANT: The information provided by CBI is for educational and general wellness purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment.

Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition, diet, or nutrition plan. Never disregard professional medical advice or delay in seeking it because of something you have read or received through this app.

If you have a medical emergency, call your doctor or emergency services immediately.`,
  },
  {
    title: '4. User Accounts',
    body: `• You are responsible for maintaining the confidentiality of your account credentials.
• You must provide accurate and complete information when creating your account.
• You are responsible for all activity that occurs under your account.
• You must notify us immediately of any unauthorized use of your account.
• We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    title: '5. User Content',
    body: `By uploading meal photos or entering data into the app, you:

• Retain ownership of your content.
• Grant us a limited license to process, store, and analyze your content solely to provide the app's functionality.
• Confirm that your content does not violate any third party's rights.
• Understand that meal photos may be sent to third-party AI services for analysis.`,
  },
  {
    title: '6. Acceptable Use',
    body: `You agree NOT to:

• Use the app for any illegal purpose.
• Attempt to reverse engineer, decompile, or disassemble the app.
• Interfere with or disrupt the app's servers or networks.
• Upload malicious content or attempt to exploit vulnerabilities.
• Share your account with others or create multiple accounts.
• Use the app to provide medical advice to others.`,
  },
  {
    title: '7. Intellectual Property',
    body: 'The Dowd Protocol, CBI, and all associated content, branding, educational materials, scoring algorithms, and software are the intellectual property of The Dowd Protocol and its licensors. You may not copy, modify, distribute, or create derivative works without our written permission.',
  },
  {
    title: '8. Limitation of Liability',
    body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE DOWD PROTOCOL SHALL NOT BE LIABLE FOR:

• Any indirect, incidental, special, consequential, or punitive damages.
• Any loss of data, profits, or business opportunities.
• Any damages arising from your reliance on nutritional information provided by the app.
• Any health outcomes resulting from following suggestions or information in the app.

Our total liability shall not exceed the amount you paid for the app in the 12 months preceding the claim.`,
  },
  {
    title: '9. Termination',
    body: 'We may terminate or suspend your access to the app at any time, with or without cause, with or without notice. Upon termination, your right to use the app ceases immediately. You may request export of your data before account deletion.',
  },
  {
    title: '10. Changes to Terms',
    body: 'We reserve the right to modify these terms at any time. We will provide notice of material changes through the app. Your continued use of the app after such changes constitutes acceptance of the new terms.',
  },
  {
    title: '11. Governing Law',
    body: 'These terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.',
  },
  {
    title: '12. Contact',
    body: `For questions about these terms, contact us at:

Email: support@thedowdprotocol.com
Website: https://thedowdprotocol.com`,
  },
];

export default function TermsOfServiceScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: March 21, 2026</Text>
        <Text style={styles.intro}>
          Please read these Terms of Service carefully before using the CBI -
          Cellular Biology Intelligence mobile application operated by The Dowd
          Protocol.
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

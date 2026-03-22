import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveProfile, getProfile } from '../utils/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ONBOARDING_KEY = 'cbi_onboarding_complete';

const HEALTH_CONDITIONS = [
  'IBS',
  'Crohn\'s',
  'Celiac',
  'Rheumatoid Arthritis',
  'Lupus',
  'MS',
  'Psoriasis',
  'Other',
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Page 4 form state
  const [name, setName] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [allergyInput, setAllergyInput] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);

  const totalPages = 4;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const goToPage = (page: number) => {
    scrollRef.current?.scrollTo({ x: page * SCREEN_WIDTH, animated: true });
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  };

  const addAllergy = () => {
    const trimmed = allergyInput.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies([...allergies, trimmed]);
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  const handleGetStarted = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name to continue.');
      return;
    }

    try {
      const profile = await getProfile();
      const updatedProfile = {
        ...profile,
        name: name.trim(),
        condition: selectedCondition,
        allergies,
      };
      await saveProfile(updatedProfile);
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      onComplete();
    } catch {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {Array.from({ length: totalPages }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i === currentPage && styles.dotActive]}
        />
      ))}
    </View>
  );

  const renderPage1 = () => (
    <View style={styles.page}>
      <View style={styles.iconCircle}>
        <Ionicons name="camera" size={64} color="#2563eb" />
      </View>
      <Text style={styles.pageTitle}>Track What You Eat</Text>
      <Text style={styles.pageSubtitle}>
        Snap a photo of your meal or scan a barcode to instantly log what you eat.
        Our AI identifies foods and scores them for gut health.
      </Text>
      <View style={styles.featureRow}>
        <View style={styles.featureBadge}>
          <Ionicons name="scan-outline" size={20} color="#2563eb" />
          <Text style={styles.featureBadgeText}>Barcode Scan</Text>
        </View>
        <View style={styles.featureBadge}>
          <Ionicons name="image-outline" size={20} color="#2563eb" />
          <Text style={styles.featureBadgeText}>Photo AI</Text>
        </View>
      </View>
    </View>
  );

  const renderPage2 = () => (
    <View style={styles.page}>
      <View style={styles.iconCircle}>
        <Ionicons name="analytics" size={64} color="#2563eb" />
      </View>
      <Text style={styles.pageTitle}>Understand Inflammation</Text>
      <Text style={styles.pageSubtitle}>
        Every food gets an inflammation score from -3 (highly inflammatory) to +3
        (anti-inflammatory). Track your daily score and watch your health improve.
      </Text>
      <View style={styles.scorePreview}>
        <View style={[styles.scoreBox, { backgroundColor: '#fee2e2' }]}>
          <Text style={[styles.scoreValue, { color: '#dc2626' }]}>-3</Text>
          <Text style={styles.scoreLabel}>Inflammatory</Text>
        </View>
        <View style={[styles.scoreBox, { backgroundColor: '#fef3c7' }]}>
          <Text style={[styles.scoreValue, { color: '#d97706' }]}>0</Text>
          <Text style={styles.scoreLabel}>Neutral</Text>
        </View>
        <View style={[styles.scoreBox, { backgroundColor: '#dcfce7' }]}>
          <Text style={[styles.scoreValue, { color: '#16a34a' }]}>+3</Text>
          <Text style={styles.scoreLabel}>Anti-inflam.</Text>
        </View>
      </View>
    </View>
  );

  const renderPage3 = () => (
    <View style={styles.page}>
      <View style={styles.iconCircle}>
        <Ionicons name="school" size={64} color="#2563eb" />
      </View>
      <Text style={styles.pageTitle}>Learn the Science</Text>
      <Text style={styles.pageSubtitle}>
        Explore lessons on the gut-brain connection, the enteric nervous system,
        and how your diet shapes your microbiome. Science-backed knowledge at your fingertips.
      </Text>
      <View style={styles.featureRow}>
        <View style={styles.featureBadge}>
          <Ionicons name="book-outline" size={20} color="#2563eb" />
          <Text style={styles.featureBadgeText}>Lessons</Text>
        </View>
        <View style={styles.featureBadge}>
          <Ionicons name="bulb-outline" size={20} color="#2563eb" />
          <Text style={styles.featureBadgeText}>Insights</Text>
        </View>
      </View>
    </View>
  );

  const renderPage4 = () => (
    <View style={styles.page}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView
          contentContainerStyle={styles.formScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconCircleSmall}>
            <Ionicons name="person" size={40} color="#2563eb" />
          </View>
          <Text style={styles.pageTitle}>Your Personalized Journey</Text>
          <Text style={styles.pageSubtitleSmall}>
            Tell us about yourself so we can tailor your experience.
          </Text>

          {/* Name */}
          <Text style={styles.fieldLabel}>Your Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Health Condition Picker */}
          <Text style={styles.fieldLabel}>Primary Health Condition</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowConditionPicker(!showConditionPicker)}
          >
            <Ionicons name="medkit-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
            <Text style={[styles.pickerText, !selectedCondition && { color: '#9ca3af' }]}>
              {selectedCondition || 'Select a condition'}
            </Text>
            <Ionicons
              name={showConditionPicker ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>

          {showConditionPicker && (
            <View style={styles.conditionList}>
              {HEALTH_CONDITIONS.map((condition) => (
                <TouchableOpacity
                  key={condition}
                  style={[
                    styles.conditionItem,
                    selectedCondition === condition && styles.conditionItemActive,
                  ]}
                  onPress={() => {
                    setSelectedCondition(condition);
                    setShowConditionPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.conditionItemText,
                      selectedCondition === condition && styles.conditionItemTextActive,
                    ]}
                  >
                    {condition}
                  </Text>
                  {selectedCondition === condition && (
                    <Ionicons name="checkmark" size={18} color="#2563eb" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Allergy Tag Input */}
          <Text style={styles.fieldLabel}>Known Food Allergies</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="warning-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Type allergy and press Add"
              placeholderTextColor="#9ca3af"
              value={allergyInput}
              onChangeText={setAllergyInput}
              onSubmitEditing={addAllergy}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addButton} onPress={addAllergy}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {allergies.length > 0 && (
            <View style={styles.tagsContainer}>
              {allergies.map((allergy) => (
                <View key={allergy} style={styles.tag}>
                  <Text style={styles.tagText}>{allergy}</Text>
                  <TouchableOpacity onPress={() => removeAllergy(allergy)}>
                    <Ionicons name="close-circle" size={18} color="#2563eb" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{ width: SCREEN_WIDTH }}>{renderPage1()}</View>
        <View style={{ width: SCREEN_WIDTH }}>{renderPage2()}</View>
        <View style={{ width: SCREEN_WIDTH }}>{renderPage3()}</View>
        <View style={{ width: SCREEN_WIDTH }}>{renderPage4()}</View>
      </ScrollView>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {renderDots()}
        <View style={styles.buttonRow}>
          {currentPage > 0 ? (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={20} color="#2563eb" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}

          {currentPage < totalPages - 1 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
              <Text style={styles.nextButtonText}>Get Started</Text>
              <Ionicons name="checkmark-circle" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 3,
    borderColor: '#bfdbfe',
  },
  iconCircleSmall: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#bfdbfe',
    alignSelf: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  pageSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  pageSubtitleSmall: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  featureBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  scorePreview: {
    flexDirection: 'row',
    gap: 12,
  },
  scoreBox: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 90,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  // Form styles (Page 4)
  formScroll: {
    alignItems: 'stretch',
    paddingBottom: 20,
    paddingTop: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1f2937',
  },
  pickerText: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1f2937',
  },
  conditionList: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 4,
    overflow: 'hidden',
  },
  conditionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  conditionItemActive: {
    backgroundColor: '#eff6ff',
  },
  conditionItemText: {
    fontSize: 15,
    color: '#374151',
  },
  conditionItemTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  tagText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '500',
  },
  // Bottom controls
  bottomControls: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'web' ? 120 : Platform.OS === 'ios' ? 16 : 24,
    paddingTop: 12,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },
  dotActive: {
    backgroundColor: '#2563eb',
    width: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 80,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '../data/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CONDITIONS = [
  { id: 'ms', name: 'Multiple Sclerosis', icon: 'body' },
  { id: 'crohns', name: "Crohn's Disease", icon: 'fitness' },
  { id: 'uc', name: 'Ulcerative Colitis', icon: 'fitness' },
  { id: 'ra', name: 'Rheumatoid Arthritis', icon: 'hand-left' },
  { id: 'psoriasis', name: 'Psoriasis', icon: 'body' },
  { id: 'hashimotos', name: "Hashimoto's", icon: 'medical' },
  { id: 'lupus', name: 'Lupus', icon: 'shield' },
  { id: 'general', name: 'General Wellness', icon: 'heart' },
];

const COMMON_TRIGGERS = [
  { name: 'Gluten', icon: 'nutrition' },
  { name: 'Dairy', icon: 'cafe' },
  { name: 'Nightshades', icon: 'leaf' },
  { name: 'Eggs', icon: 'egg' },
  { name: 'Soy', icon: 'leaf' },
  { name: 'Corn', icon: 'nutrition' },
  { name: 'Nuts', icon: 'nutrition' },
  { name: 'Shellfish', icon: 'fish' },
];

const HEALTH_GOALS = [
  { id: 'inflammation', name: 'Reduce inflammation', icon: 'flame' },
  { id: 'energy', name: 'Increase energy', icon: 'flash' },
  { id: 'sleep', name: 'Better sleep', icon: 'moon' },
  { id: 'weight', name: 'Weight management', icon: 'scale' },
  { id: 'gut', name: 'Improve gut health', icon: 'fitness' },
  { id: 'clarity', name: 'Mental clarity', icon: 'bulb' },
  { id: 'pain', name: 'Pain reduction', icon: 'medkit' },
  { id: 'immune', name: 'Immune support', icon: 'shield-checkmark' },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const { updateProfile, addTrigger, completeOnboarding } = useAppData();

  const totalSteps = 5;

  const toggleTrigger = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    // Save user profile
    const conditionName = CONDITIONS.find(c => c.id === selectedCondition)?.name || 'General Wellness';

    updateProfile({
      name: name.trim() || 'User',
      condition: conditionName,
      healthGoals: selectedGoals.map(id => {
        const goal = HEALTH_GOALS.find(g => g.id === id);
        return goal?.name || id;
      }),
    });

    // Add selected triggers
    for (const triggerName of selectedTriggers) {
      addTrigger({
        name: triggerName,
        category: 'Food Group',
        severity: 'medium',
      });
    }

    // Mark onboarding as complete
    await completeOnboarding();
    onComplete();
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return selectedCondition !== '';
      default: return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.welcomeLogo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeTitle}>Welcome to Mido</Text>
            <Text style={styles.welcomeSubtitle}>
              Your personal guide to supporting your enteric nervous system through mindful nutrition
            </Text>

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#dbeafe' }]}>
                  <Ionicons name="camera" size={24} color="#3b82f6" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Snap & Score</Text>
                  <Text style={styles.featureDesc}>Photo analysis of your meals</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#d1fae5' }]}>
                  <Ionicons name="trending-up" size={24} color="#10b981" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Track Progress</Text>
                  <Text style={styles.featureDesc}>Monitor your health journey</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#ede9fe' }]}>
                  <Ionicons name="book" size={24} color="#8b5cf6" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Learn</Text>
                  <Text style={styles.featureDesc}>Science-based education</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 1:
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.stepContainer}
          >
            <View style={styles.stepIconContainer}>
              <Ionicons name="person" size={48} color="#3b82f6" />
            </View>
            <Text style={styles.stepTitle}>What's your name?</Text>
            <Text style={styles.stepSubtitle}>
              Let's personalize your experience
            </Text>

            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#9ca3af"
              autoFocus
              autoCapitalize="words"
            />
          </KeyboardAvoidingView>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepIconContainer}>
              <Ionicons name="medical" size={48} color="#ef4444" />
            </View>
            <Text style={styles.stepTitle}>Your Health Focus</Text>
            <Text style={styles.stepSubtitle}>
              Select your primary condition or wellness goal
            </Text>

            <ScrollView
              style={styles.optionsScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.conditionGrid}>
                {CONDITIONS.map((condition) => (
                  <TouchableOpacity
                    key={condition.id}
                    style={[
                      styles.conditionCard,
                      selectedCondition === condition.id && styles.conditionCardActive,
                    ]}
                    onPress={() => setSelectedCondition(condition.id)}
                  >
                    <Ionicons
                      name={condition.icon as any}
                      size={28}
                      color={selectedCondition === condition.id ? '#3b82f6' : '#6b7280'}
                    />
                    <Text
                      style={[
                        styles.conditionName,
                        selectedCondition === condition.id && styles.conditionNameActive,
                      ]}
                    >
                      {condition.name}
                    </Text>
                    {selectedCondition === condition.id && (
                      <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={14} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepIconContainer}>
              <Ionicons name="warning" size={48} color="#f59e0b" />
            </View>
            <Text style={styles.stepTitle}>Known Triggers</Text>
            <Text style={styles.stepSubtitle}>
              Select any foods that cause you symptoms (optional)
            </Text>

            <ScrollView
              style={styles.optionsScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.triggerGrid}>
                {COMMON_TRIGGERS.map((trigger) => (
                  <TouchableOpacity
                    key={trigger.name}
                    style={[
                      styles.triggerChip,
                      selectedTriggers.includes(trigger.name) && styles.triggerChipActive,
                    ]}
                    onPress={() => toggleTrigger(trigger.name)}
                  >
                    <Ionicons
                      name={trigger.icon as any}
                      size={20}
                      color={selectedTriggers.includes(trigger.name) ? '#ef4444' : '#6b7280'}
                    />
                    <Text
                      style={[
                        styles.triggerChipText,
                        selectedTriggers.includes(trigger.name) && styles.triggerChipTextActive,
                      ]}
                    >
                      {trigger.name}
                    </Text>
                    {selectedTriggers.includes(trigger.name) && (
                      <Ionicons name="close-circle" size={18} color="#ef4444" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.skipHint}>
                You can always add more triggers later in Settings
              </Text>
            </ScrollView>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepIconContainer}>
              <Ionicons name="flag" size={48} color="#10b981" />
            </View>
            <Text style={styles.stepTitle}>Your Goals</Text>
            <Text style={styles.stepSubtitle}>
              What would you like to achieve? (Select all that apply)
            </Text>

            <ScrollView
              style={styles.optionsScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.goalsGrid}>
                {HEALTH_GOALS.map((goal) => (
                  <TouchableOpacity
                    key={goal.id}
                    style={[
                      styles.goalCard,
                      selectedGoals.includes(goal.id) && styles.goalCardActive,
                    ]}
                    onPress={() => toggleGoal(goal.id)}
                  >
                    <View
                      style={[
                        styles.goalIconContainer,
                        selectedGoals.includes(goal.id) && styles.goalIconContainerActive,
                      ]}
                    >
                      <Ionicons
                        name={goal.icon as any}
                        size={24}
                        color={selectedGoals.includes(goal.id) ? '#10b981' : '#6b7280'}
                      />
                    </View>
                    <Text
                      style={[
                        styles.goalName,
                        selectedGoals.includes(goal.id) && styles.goalNameActive,
                      ]}
                    >
                      {goal.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((step + 1) / totalSteps) * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {step + 1} of {totalSteps}
        </Text>
      </View>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {step > 0 ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color="#6b7280" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}

        {step < totalSteps - 1 ? (
          <TouchableOpacity
            style={[
              styles.nextButton,
              !canProceed() && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!canProceed()}
          >
            <Text style={styles.nextButtonText}>
              {step === 0 ? "Let's Start" : 'Continue'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
          >
            <Text style={styles.completeButtonText}>Get Started</Text>
            <Ionicons name="checkmark-circle" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  // Welcome Screen
  welcomeLogo: {
    width: 120,
    height: 120,
    marginTop: 20,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  featureList: {
    width: '100%',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
  // Step Screens
  stepIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  // Name Input
  nameInput: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#1f2937',
    textAlign: 'center',
  },
  // Options Scroll
  optionsScroll: {
    flex: 1,
    width: '100%',
  },
  // Condition Grid
  conditionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  conditionCard: {
    width: (SCREEN_WIDTH - 72) / 2,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  conditionCardActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  conditionName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
    textAlign: 'center',
  },
  conditionNameActive: {
    color: '#1e40af',
    fontWeight: '600',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Trigger Grid
  triggerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  triggerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  triggerChipActive: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  triggerChipText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4b5563',
  },
  triggerChipTextActive: {
    color: '#b91c1c',
  },
  skipHint: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
  // Goals Grid
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  goalCard: {
    width: (SCREEN_WIDTH - 72) / 2,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalCardActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981',
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalIconContainerActive: {
    backgroundColor: '#d1fae5',
  },
  goalName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
    textAlign: 'center',
  },
  goalNameActive: {
    color: '#047857',
    fontWeight: '600',
  },
  // Navigation
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
    minWidth: 80,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

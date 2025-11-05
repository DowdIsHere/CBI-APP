import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHALLENGE_KEY = '@dowd_30day_challenge';

interface Meal {
  name: string;
  foods: string;
  atpScore: number;
  notes: string;
}

interface Symptoms {
  energyLevel: number;
  brainFog: number;
  inflammation: number;
  digestion: number;
  mood: number;
  sleep: number;
}

interface DailyEntry {
  meals: Meal[];
  symptoms: Symptoms;
  notes: string;
  dailyATPScore: number;
  timestamp: string;
}

interface ChallengeData {
  startDate: string;
  dailyEntries: { [key: number]: DailyEntry };
  currentDay: number;
}

export default function ChallengeScreen() {
  const [challengeData, setChallengeData] = useState<ChallengeData>({
    startDate: new Date().toISOString(),
    dailyEntries: {},
    currentDay: 1,
  });
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'daily' | 'shopping'>('dashboard');
  const [editingDay, setEditingDay] = useState(1);

  // Shopping list items
  const [shoppingList, setShoppingList] = useState<string[]>([
    'Wild-caught salmon',
    'Grass-fed beef',
    'Pasture-raised eggs',
    'Cruciferous vegetables (broccoli, cauliflower)',
    'Leafy greens (spinach, kale)',
    'Avocados',
    'Extra virgin olive oil',
    'Coconut oil',
    'Blueberries',
    'Nuts (almonds, walnuts)',
    'Bone broth',
    'Fermented foods (sauerkraut, kimchi)',
    'Sweet potatoes',
    'Asparagus',
  ]);

  useEffect(() => {
    loadChallengeData();
  }, []);

  const loadChallengeData = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHALLENGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        const startDate = new Date(data.startDate);
        const today = new Date();
        const daysPassed = Math.floor(
          (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        data.currentDay = Math.min(daysPassed + 1, 30);
        setChallengeData(data);
        setEditingDay(data.currentDay);
      }
    } catch (error) {
      console.error('Failed to load challenge data:', error);
    }
    setLoading(false);
  };

  const saveChallengeData = async (data: ChallengeData) => {
    try {
      await AsyncStorage.setItem(CHALLENGE_KEY, JSON.stringify(data));
      setChallengeData(data);
    } catch (error) {
      console.error('Failed to save challenge data:', error);
    }
  };

  const startChallenge = () => {
    Alert.alert(
      'Start 30-Day Challenge?',
      'Commit to 30 days of the Dowd Protocol. Track meals, symptoms, and ATP scores daily!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Challenge',
          onPress: () => {
            const newData: ChallengeData = {
              startDate: new Date().toISOString(),
              dailyEntries: {},
              currentDay: 1,
            };
            saveChallengeData(newData);
            setEditingDay(1);
          },
        },
      ]
    );
  };

  const resetChallenge = () => {
    Alert.alert(
      'Reset Challenge?',
      'This will clear all your progress and start over.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const newData: ChallengeData = {
              startDate: new Date().toISOString(),
              dailyEntries: {},
              currentDay: 1,
            };
            saveChallengeData(newData);
            setActiveView('dashboard');
            setEditingDay(1);
          },
        },
      ]
    );
  };

  const calculateStreak = (): number => {
    let streak = 0;
    for (let i = challengeData.currentDay; i >= 1; i--) {
      if (challengeData.dailyEntries[i]) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const calculateAverageATPScore = (): string => {
    const entries = Object.values(challengeData.dailyEntries);
    if (entries.length === 0) return '-';

    const total = entries.reduce((sum, entry) => sum + (entry.dailyATPScore || 0), 0);
    return (total / entries.length).toFixed(1);
  };

  const getDailyFocus = (day: number): string => {
    const focuses = [
      '🥩 Focus: Prioritize high-quality proteins (grass-fed, wild-caught)',
      '🥦 Focus: Load up on cruciferous vegetables for detox support',
      '🧈 Focus: Healthy fats - avocado, olive oil, coconut oil',
      '💧 Focus: Hydration - drink quality water throughout the day',
      '🌅 Focus: Get morning sunlight for circadian rhythm',
      '🥗 Focus: Eliminate seed oils completely today',
      '🍖 Focus: Include organ meats for nutrient density',
      '😴 Focus: Sleep optimization - dark room, cool temp',
      '🧘 Focus: Stress reduction - practice mindfulness',
      '🥬 Focus: Dark leafy greens with every meal',
      '🐟 Focus: Omega-3s - wild salmon or sardines',
      '🍄 Focus: Add medicinal mushrooms (lion\'s mane, reishi)',
      '🌿 Focus: Fresh herbs for anti-inflammatory benefits',
      '🥩 Focus: Collagen-rich foods - bone broth, skin-on fish',
      '🥦 Focus: Sulforaphane boost - broccoli sprouts',
      '⚡ Focus: Track energy levels after each meal',
      '🧠 Focus: Brain health - DHA from wild fish',
      '🥑 Focus: Healthy fat with every meal',
      '🌱 Focus: Fermented foods for gut microbiome',
      '💪 Focus: Protein at breakfast to stabilize blood sugar',
      '🔥 Focus: Anti-inflammatory spices - turmeric, ginger',
      '🥗 Focus: Colorful vegetables for antioxidants',
      '🧈 Focus: Quality over quantity - nutrient density',
      '🌊 Focus: Wild-caught seafood for clean protein',
      '🥬 Focus: Bitter greens to support liver function',
      '🍖 Focus: Zinc-rich foods - oysters, grass-fed beef',
      '🌿 Focus: Polyphenol-rich foods - berries, green tea',
      '⚡ Focus: Mitochondrial support - CoQ10 foods',
      '🧠 Focus: Reduce brain fog triggers',
      '🎯 Focus: Finish strong - celebrate your transformation!',
    ];
    return focuses[day - 1] || focuses[0];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading challenge...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (Object.keys(challengeData.dailyEntries).length === 0 && challengeData.currentDay === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeIcon}>🎯</Text>
            <Text style={styles.welcomeTitle}>30-Day Dowd Protocol Challenge</Text>
            <Text style={styles.welcomeSubtitle}>
              Transform your cellular health in 30 days
            </Text>

            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsTitle}>What You'll Track:</Text>
              <View style={styles.benefitItem}>
                <Ionicons name="restaurant" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Meals with ATP scores</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="pulse" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Daily symptoms & energy</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="analytics" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Progress analytics</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="cart" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Shopping list guidance</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="trophy" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Daily focus & tips</Text>
              </View>
            </View>

            <View style={styles.rulesCard}>
              <Text style={styles.rulesTitle}>Challenge Rules:</Text>
              <Text style={styles.ruleText}>
                • Log all meals with ATP scores{'\n'}
                • Track symptoms daily{'\n'}
                • Follow Dowd Protocol guidelines{'\n'}
                • Stay consistent for 30 days{'\n'}
                • Watch your transformation!
              </Text>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startChallenge}>
              <Text style={styles.startButtonText}>Start Challenge</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Dashboard View
  if (activeView === 'dashboard') {
    const completedDays = Object.keys(challengeData.dailyEntries).length;
    const streakDays = calculateStreak();
    const avgATPScore = calculateAverageATPScore();
    const completionPercentage = Math.round((completedDays / 30) * 100);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>30-Day Challenge</Text>
              <Text style={styles.headerSubtitle}>
                Day {challengeData.currentDay} of 30
              </Text>
            </View>
            <TouchableOpacity onPress={resetChallenge}>
              <Ionicons name="refresh" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{challengeData.currentDay}/30</Text>
              <Text style={styles.statLabel}>Current Day</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text style={styles.statValue}>{completedDays}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={24} color="#f59e0b" />
              <Text style={styles.statValue}>{streakDays}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="flash" size={24} color="#8b5cf6" />
              <Text style={styles.statValue}>{avgATPScore}</Text>
              <Text style={styles.statLabel}>Avg ATP</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Challenge Progress</Text>
              <Text style={styles.progressPercentage}>{completionPercentage}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${completionPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {completedDays} of 30 days completed
            </Text>
          </View>

          {/* Today's Focus */}
          <View style={styles.focusCard}>
            <Ionicons name="bulb" size={24} color="#f59e0b" />
            <View style={styles.focusContent}>
              <Text style={styles.focusTitle}>Today's Focus</Text>
              <Text style={styles.focusText}>{getDailyFocus(challengeData.currentDay)}</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
              onPress={() => {
                setEditingDay(challengeData.currentDay);
                setActiveView('daily');
              }}
            >
              <Ionicons name="create" size={24} color="white" />
              <Text style={styles.actionButtonText}>Log Today</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#10b981' }]}
              onPress={() => setActiveView('shopping')}
            >
              <Ionicons name="cart" size={24} color="white" />
              <Text style={styles.actionButtonText}>Shopping List</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Challenge Calendar</Text>
            <View style={styles.calendarGrid}>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const isCompleted = !!challengeData.dailyEntries[day];
                const isCurrent = day === challengeData.currentDay;
                const isFuture = day > challengeData.currentDay;

                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.calendarDay,
                      isCompleted && styles.calendarDayCompleted,
                      isCurrent && !isCompleted && styles.calendarDayCurrent,
                      isFuture && styles.calendarDayFuture,
                    ]}
                    onPress={() => {
                      if (!isFuture) {
                        setEditingDay(day);
                        setActiveView('daily');
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        isCompleted && styles.calendarDayTextCompleted,
                        isCurrent && !isCompleted && styles.calendarDayTextCurrent,
                        isFuture && styles.calendarDayTextFuture,
                      ]}
                    >
                      {day}
                    </Text>
                    {isCompleted && (
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color="white"
                        style={styles.calendarDayCheck}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Shopping List View
  if (activeView === 'shopping') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setActiveView('dashboard')}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping List</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.shoppingSubtitle}>
              Essential foods for the Dowd Protocol
            </Text>

            {shoppingList.map((item, index) => (
              <View key={index} style={styles.shoppingItem}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#10b981" />
                <Text style={styles.shoppingItemText}>{item}</Text>
              </View>
            ))}

            <View style={styles.shoppingTipCard}>
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
              <Text style={styles.shoppingTipText}>
                Buy organic when possible. Prioritize grass-fed, pasture-raised, and wild-caught options.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Daily Check-in View
  return <DailyCheckInView />;

  function DailyCheckInView() {
    const existingEntry = challengeData.dailyEntries[editingDay];

    const [meals, setMeals] = useState<Meal[]>(
      existingEntry?.meals || [
        { name: 'Breakfast', foods: '', atpScore: 5, notes: '' },
        { name: 'Lunch', foods: '', atpScore: 5, notes: '' },
        { name: 'Dinner', foods: '', atpScore: 5, notes: '' },
        { name: 'Snacks', foods: '', atpScore: 5, notes: '' },
      ]
    );

    const [symptoms, setSymptoms] = useState<Symptoms>(
      existingEntry?.symptoms || {
        energyLevel: 5,
        brainFog: 3,
        inflammation: 3,
        digestion: 5,
        mood: 5,
        sleep: 5,
      }
    );

    const [notes, setNotes] = useState(existingEntry?.notes || '');

    const calculateDailyATPScore = (mealsData: Meal[]): number => {
      const total = mealsData.reduce((sum, meal) => sum + meal.atpScore, 0);
      return parseFloat((total / mealsData.length).toFixed(1));
    };

    const handleSave = () => {
      const dailyATPScore = calculateDailyATPScore(meals);

      const newData = {
        ...challengeData,
        dailyEntries: {
          ...challengeData.dailyEntries,
          [editingDay]: {
            meals,
            symptoms,
            notes,
            dailyATPScore,
            timestamp: new Date().toISOString(),
          },
        },
      };

      saveChallengeData(newData);
      Alert.alert('Saved!', `Day ${editingDay} logged successfully.`);
      setActiveView('dashboard');
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setActiveView('dashboard')}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Day {editingDay} Check-In</Text>
          <TouchableOpacity onPress={handleSave}>
            <Ionicons name="checkmark" size={28} color="#10b981" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Meal Logging */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meal Log</Text>
            {meals.map((meal, index) => (
              <View key={index} style={styles.mealCard}>
                <Text style={styles.mealName}>{meal.name}</Text>

                <Text style={styles.inputLabel}>What did you eat?</Text>
                <TextInput
                  style={styles.textArea}
                  value={meal.foods}
                  onChangeText={(text) => {
                    const newMeals = [...meals];
                    newMeals[index].foods = text;
                    setMeals(newMeals);
                  }}
                  placeholder="e.g., Grass-fed beef, roasted vegetables, olive oil"
                  multiline
                  numberOfLines={2}
                />

                <Text style={styles.inputLabel}>
                  ATP Score: {meal.atpScore}/10
                </Text>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Disruptors</Text>
                  <View style={styles.sliderTrack}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <TouchableOpacity
                        key={value}
                        style={[
                          styles.sliderDot,
                          meal.atpScore >= value && styles.sliderDotActive,
                        ]}
                        onPress={() => {
                          const newMeals = [...meals];
                          newMeals[index].atpScore = value;
                          setMeals(newMeals);
                        }}
                      />
                    ))}
                  </View>
                  <Text style={styles.sliderLabel}>Clean Fuel</Text>
                </View>

                <Text style={styles.inputLabel}>Notes (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={meal.notes}
                  onChangeText={(text) => {
                    const newMeals = [...meals];
                    newMeals[index].notes = text;
                    setMeals(newMeals);
                  }}
                  placeholder="How did you feel after?"
                />
              </View>
            ))}
          </View>

          {/* Symptom Tracking */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Symptom Tracking</Text>
            <View style={styles.symptomCard}>
              {[
                { key: 'energyLevel', label: 'Energy Level', icon: 'flash' },
                { key: 'brainFog', label: 'Brain Fog', icon: 'cloud', reverse: true },
                { key: 'inflammation', label: 'Inflammation', icon: 'flame', reverse: true },
                { key: 'digestion', label: 'Digestion', icon: 'nutrition' },
                { key: 'mood', label: 'Mood', icon: 'happy' },
                { key: 'sleep', label: 'Sleep Quality', icon: 'moon' },
              ].map((symptom) => (
                <View key={symptom.key} style={styles.symptomRow}>
                  <View style={styles.symptomHeader}>
                    <Ionicons name={symptom.icon as any} size={20} color="#3b82f6" />
                    <Text style={styles.symptomLabel}>{symptom.label}</Text>
                    <Text style={styles.symptomValue}>
                      {symptoms[symptom.key as keyof Symptoms]}/10
                    </Text>
                  </View>
                  <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabelSmall}>
                      {symptom.reverse ? 'High' : 'Low'}
                    </Text>
                    <View style={styles.sliderTrack}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <TouchableOpacity
                          key={value}
                          style={[
                            styles.sliderDot,
                            symptoms[symptom.key as keyof Symptoms] >= value &&
                              styles.sliderDotActive,
                          ]}
                          onPress={() => {
                            setSymptoms({
                              ...symptoms,
                              [symptom.key]: value,
                            });
                          }}
                        />
                      ))}
                    </View>
                    <Text style={styles.sliderLabelSmall}>
                      {symptom.reverse ? 'Low' : 'High'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Daily Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Notes</Text>
            <TextInput
              style={[styles.textArea, { height: 100 }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any observations, wins, or challenges today?"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Save Button */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text style={styles.saveButtonText}>Save Day {editingDay}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  // Welcome Screen
  welcomeContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  welcomeIcon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 32,
  },
  benefitsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    color: '#374151',
  },
  rulesCard: {
    backgroundColor: '#eff6ff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
  },
  ruleText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  // Progress Card
  progressCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  // Focus Card
  focusCard: {
    backgroundColor: '#fffbeb',
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  focusContent: {
    flex: 1,
    marginLeft: 12,
  },
  focusTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  focusText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
  },
  // Actions
  actionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Calendar
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  calendarDay: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  calendarDayCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  calendarDayCurrent: {
    borderColor: '#3b82f6',
    borderWidth: 3,
  },
  calendarDayFuture: {
    backgroundColor: '#f3f4f6',
    opacity: 0.6,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  calendarDayTextCompleted: {
    color: 'white',
  },
  calendarDayTextCurrent: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  calendarDayTextFuture: {
    color: '#9ca3af',
  },
  calendarDayCheck: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  // Shopping List
  shoppingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  shoppingItemText: {
    fontSize: 15,
    color: '#1f2937',
    flex: 1,
  },
  shoppingTipCard: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    gap: 12,
    marginTop: 16,
  },
  shoppingTipText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  // Daily Check-in
  mealCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1f2937',
  },
  textArea: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1f2937',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 11,
    color: '#6b7280',
    width: 60,
  },
  sliderLabelSmall: {
    fontSize: 10,
    color: '#6b7280',
  },
  sliderTrack: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  sliderDot: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  sliderDotActive: {
    backgroundColor: '#3b82f6',
  },
  // Symptom Tracking
  symptomCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  symptomRow: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  symptomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  symptomLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  symptomValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  // Save Button
  saveButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 32,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { BarcodeScanningResult } from 'expo-camera';
import { useAppData } from '../data/AppContext';
import { FoodItem } from '../data/types';
import {
  NUTRIENT_CATEGORIES,
  NutrientId,
  MitoFood,
  foodsForNutrient,
} from '../data/mitoFoods';
import { scoreFoodLocally } from '../services/foodAnalysis';
import {
  checkProductSafety,
  triggerWarningsForFood,
  LabelCheckResult,
} from '../services/ingredientSafety';

type LogView = 'entry' | 'label' | 'labelResult' | 'results';

const catalogId = (name: string) => `mito:${name}`;

export default function LogScreen() {
  const { addMeal, data } = useAppData();
  const { triggers } = data;

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [view, setView] = useState<LogView>('entry');
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<NutrientId | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [mealName, setMealName] = useState('');
  const [labelResult, setLabelResult] = useState<LabelCheckResult | null>(null);

  const isSelected = (food: MitoFood) =>
    selectedFoods.some((f) => f.id === catalogId(food.name));

  const toggleFood = (food: MitoFood) => {
    const id = catalogId(food.name);
    setSelectedFoods((prev) => {
      if (prev.some((f) => f.id === id)) {
        return prev.filter((f) => f.id !== id);
      }
      return [
        ...prev,
        {
          id,
          name: food.name,
          portionSize: food.serving,
          score: food.score,
          warnings: triggerWarningsForFood(food.name, triggers),
          nutrients: food.nutrients,
        },
      ];
    });
  };

  const removeFood = (foodId: string) => {
    setSelectedFoods((prev) => prev.filter((f) => f.id !== foodId));
  };

  const addCustomFood = () => {
    const name = customInput.trim();
    if (!name) return;

    const { score, warnings } = scoreFoodLocally(name);
    setSelectedFoods((prev) => [
      ...prev,
      {
        id: `custom:${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        portionSize: '1 serving',
        score,
        warnings: [...warnings, ...triggerWarningsForFood(name, triggers)],
      },
    ]);
    setCustomInput('');
  };

  // ---- Label check (camera) ----
  const handleLabelPress = async () => {
    if (hasPermission === null) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert(
          'Camera access needed',
          'Allow camera access to check product labels for harmful and allergy ingredients.',
          [{ text: 'OK' }]
        );
        return;
      }
    } else if (!hasPermission) {
      Alert.alert(
        'Camera access needed',
        'Allow camera access in your settings to check product labels.',
        [{ text: 'OK' }]
      );
      return;
    }
    setView('label');
  };

  const handleBarCodeScanned = async ({ data: barcode }: BarcodeScanningResult) => {
    setView('entry');
    setChecking(true);

    const result = await checkProductSafety(barcode, triggers);
    setChecking(false);

    if (result.success) {
      setLabelResult(result);
      setView('labelResult');
    } else {
      Alert.alert(
        'Product not found',
        result.error || 'That barcode is not in the database.',
        [{ text: 'OK' }]
      );
    }
  };

  const saveMeal = () => {
    const totalScore = selectedFoods.reduce((sum, food) => sum + food.score, 0);

    const hour = new Date().getHours();
    let defaultMealName = 'Snack';
    if (hour >= 5 && hour < 11) defaultMealName = 'Breakfast';
    else if (hour >= 11 && hour < 15) defaultMealName = 'Lunch';
    else if (hour >= 17 && hour < 21) defaultMealName = 'Dinner';

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    addMeal({
      name: mealName || defaultMealName,
      time: timeString,
      date: now.toISOString().split('T')[0],
      items: selectedFoods,
      totalScore,
    });

    Alert.alert('Meal saved!', `Score: +${totalScore}. Great job fueling your mitochondria!`, [
      { text: 'OK', onPress: reset },
    ]);
  };

  const reset = () => {
    setSelectedFoods([]);
    setView('entry');
    setCustomInput('');
    setMealName('');
    setExpandedCategory(null);
    setLabelResult(null);
  };

  // ---- Label Scanner (camera) View ----
  if (view === 'label' && hasPermission) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['upc_a', 'upc_e', 'ean8', 'ean13', 'code128', 'code39'],
          }}
        >
          <View style={styles.cameraOverlay}>
            <SafeAreaView style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.cameraCloseButton}
                onPress={() => setView('entry')}
              >
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Check a Label</Text>
              <View style={{ width: 44 }} />
            </SafeAreaView>

            <View style={styles.scanArea}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
              <Text style={styles.scanText}>
                Scan the product barcode to check its ingredients
              </Text>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // ---- Checking State ----
  if (checking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.analyzingContainer}>
          <View style={styles.analyzingSpinner}>
            <ActivityIndicator size="large" color="#10b981" />
          </View>
          <Text style={styles.analyzingTitle}>Checking ingredients…</Text>
          <Text style={styles.analyzingSubtitle}>
            Looking for harmful, sensitivity and allergy items
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ---- Label Check Result View ----
  if (view === 'labelResult' && labelResult) {
    const verdictConfig = {
      avoid: {
        color: '#b91c1c',
        bg: '#fee2e2',
        icon: 'alert-circle' as const,
        title: 'Avoid',
        message: 'This product matches one of your allergies.',
      },
      caution: {
        color: '#b45309',
        bg: '#fef3c7',
        icon: 'warning' as const,
        title: 'Caution',
        message: 'This product contains ingredients worth watching.',
      },
      clear: {
        color: '#047857',
        bg: '#d1fae5',
        icon: 'checkmark-circle' as const,
        title: 'Looks clean',
        message: 'No harmful or trigger ingredients found.',
      },
    }[labelResult.verdict];

    const flagSections = [
      { title: 'Your allergies', flags: labelResult.allergyHits, color: '#b91c1c', icon: 'medkit' as const },
      { title: 'Your sensitivities', flags: labelResult.sensitivityHits, color: '#b45309', icon: 'hand-left' as const },
      { title: 'Harmful ingredients', flags: labelResult.harmful, color: '#9a3412', icon: 'flask' as const },
    ].filter((s) => s.flags.length > 0);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.inner}>
            <Text style={styles.resultsTitle}>Label Check</Text>

            <View style={[styles.verdictBanner, { backgroundColor: verdictConfig.bg }]}>
              <Ionicons name={verdictConfig.icon} size={32} color={verdictConfig.color} />
              <View style={styles.verdictTextWrap}>
                <Text style={[styles.verdictTitle, { color: verdictConfig.color }]}>
                  {verdictConfig.title}
                </Text>
                <Text style={[styles.verdictMessage, { color: verdictConfig.color }]}>
                  {verdictConfig.message}
                </Text>
              </View>
            </View>

            <View style={styles.productCard}>
              <Text style={styles.productName}>{labelResult.productName}</Text>
              {labelResult.brand && <Text style={styles.productBrand}>{labelResult.brand}</Text>}
            </View>

            {flagSections.map((section) => (
              <View key={section.title} style={styles.flagSection}>
                <View style={styles.flagSectionHeader}>
                  <Ionicons name={section.icon} size={16} color={section.color} />
                  <Text style={[styles.flagSectionTitle, { color: section.color }]}>
                    {section.title}
                  </Text>
                </View>
                {section.flags.map((flag, i) => (
                  <View key={i} style={styles.flagRow}>
                    <Text style={styles.flagTerm}>{flag.term}</Text>
                    <Text style={styles.flagReason}>{flag.reason}</Text>
                  </View>
                ))}
              </View>
            ))}

            {labelResult.ingredientsText && (
              <View style={styles.ingredientsCard}>
                <Text style={styles.ingredientsLabel}>Full ingredient list</Text>
                <Text style={styles.ingredientsText}>{labelResult.ingredientsText}</Text>
              </View>
            )}

            <View style={styles.resultsActions}>
              <TouchableOpacity style={styles.resetButton} onPress={handleLabelPress}>
                <Ionicons name="barcode-outline" size={20} color="#6b7280" />
                <Text style={styles.resetButtonText}>Scan Another</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={reset}>
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.saveButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---- Results View ----
  if (view === 'results' && selectedFoods.length > 0) {
    const totalScore = selectedFoods.reduce((sum, f) => sum + f.score, 0);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.inner}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Your meal</Text>
              <View style={styles.totalScoreBadge}>
                <Text style={styles.totalScoreText}>+{totalScore}</Text>
              </View>
            </View>

            {selectedFoods.map((food) => (
              <View key={food.id} style={styles.foodCard}>
                <View style={styles.foodHeader}>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodPortion}>
                      {food.portionSize || food.servingSize}
                    </Text>
                    {food.nutrients && food.nutrients.length > 0 && (
                      <View style={styles.nutrientTagsRow}>
                        {food.nutrients.map((n) => {
                          const cat = NUTRIENT_CATEGORIES.find((c) => c.id === n);
                          if (!cat) return null;
                          return (
                            <View
                              key={n}
                              style={[styles.nutrientTag, { backgroundColor: cat.bg }]}
                            >
                              <Text style={[styles.nutrientTagText, { color: cat.color }]}>
                                {cat.title}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                  <View style={styles.foodScoreContainer}>
                    <View
                      style={[
                        styles.foodScoreBadge,
                        {
                          backgroundColor:
                            food.score >= 3
                              ? '#d1fae5'
                              : food.score === 2
                              ? '#dbeafe'
                              : '#fee2e2',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.foodScoreText,
                          {
                            color:
                              food.score >= 3
                                ? '#047857'
                                : food.score === 2
                                ? '#1e40af'
                                : '#b91c1c',
                          },
                        ]}
                      >
                        +{food.score}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeFood(food.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {food.warnings.length > 0 && (
                  <View style={styles.warningsContainer}>
                    {food.warnings.map((w, i) => (
                      <View key={i} style={styles.warningRow}>
                        <Ionicons name="alert-circle" size={14} color="#d97706" />
                        <Text style={styles.warningText}>{w}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}

            <View style={styles.resultsActions}>
              <TouchableOpacity style={styles.resetButton} onPress={() => setView('entry')}>
                <Ionicons name="arrow-back" size={20} color="#6b7280" />
                <Text style={styles.resetButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveMeal}>
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.saveButtonText}>Save Meal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---- Main Entry View ----
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryTitle}>Log a Meal</Text>
            <Text style={styles.entrySubtitle}>
              Build your plate from foods that power your mitochondria.
            </Text>
          </View>

          {/* Optional meal name */}
          <Text style={styles.fieldLabel}>Meal name (optional)</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="e.g., Lunch"
            placeholderTextColor="#9ca3af"
            value={mealName}
            onChangeText={setMealName}
          />

          {/* Selected foods */}
          {selectedFoods.length > 0 && (
            <>
              <Text style={styles.fieldLabel}>
                Your plate ({selectedFoods.length})
              </Text>
              <View style={styles.chipsRow}>
                {selectedFoods.map((food) => (
                  <TouchableOpacity
                    key={food.id}
                    style={styles.selectedChip}
                    onPress={() => removeFood(food.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.selectedChipText}>{food.name}</Text>
                    <Ionicons name="close-circle" size={16} color="#047857" />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Nutrient category selector */}
          <Text style={styles.fieldLabel}>Pick by nutrient</Text>
          <View style={styles.categoryList}>
            {NUTRIENT_CATEGORIES.map((category) => {
              const expanded = expandedCategory === category.id;
              const foods = foodsForNutrient(category.id);
              const selectedCount = foods.filter(isSelected).length;

              return (
                <View
                  key={category.id}
                  style={[styles.categoryCard, expanded && { borderColor: category.color }]}
                >
                  <TouchableOpacity
                    style={styles.categoryHeader}
                    onPress={() => setExpandedCategory(expanded ? null : category.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: category.bg }]}>
                      <Ionicons name={category.icon as any} size={20} color={category.color} />
                    </View>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                    </View>
                    {selectedCount > 0 && (
                      <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                        <Text style={styles.categoryBadgeText}>{selectedCount}</Text>
                      </View>
                    )}
                    <Ionicons
                      name={expanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>

                  {expanded && (
                    <View style={styles.categoryFoods}>
                      {foods.map((food) => {
                        const selected = isSelected(food);
                        return (
                          <TouchableOpacity
                            key={food.name}
                            style={[
                              styles.foodChip,
                              selected && {
                                backgroundColor: category.bg,
                                borderColor: category.color,
                              },
                            ]}
                            onPress={() => toggleFood(food)}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name={selected ? 'checkmark-circle' : 'add-circle-outline'}
                              size={16}
                              color={selected ? category.color : '#9ca3af'}
                            />
                            <Text
                              style={[
                                styles.foodChipText,
                                selected && { color: category.color, fontWeight: '700' },
                              ]}
                            >
                              {food.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Custom food entry */}
          <Text style={styles.fieldLabel}>Something else?</Text>
          <View style={styles.customRow}>
            <TextInput
              style={styles.customInput}
              placeholder="e.g., quinoa"
              placeholderTextColor="#9ca3af"
              value={customInput}
              onChangeText={setCustomInput}
              onSubmitEditing={addCustomFood}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[styles.customAddButton, !customInput.trim() && styles.customAddDisabled]}
              onPress={addCustomFood}
              disabled={!customInput.trim()}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Primary action */}
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              selectedFoods.length === 0 && styles.analyzeButtonDisabled,
            ]}
            onPress={() => setView('results')}
            disabled={selectedFoods.length === 0}
            activeOpacity={0.85}
          >
            <Ionicons name="sparkles" size={20} color="white" />
            <Text style={styles.analyzeButtonText}>Review & score meal</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>label safety</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Label check */}
          <TouchableOpacity
            style={styles.barcodeButton}
            onPress={handleLabelPress}
            activeOpacity={0.85}
          >
            <Ionicons name="scan-outline" size={20} color="#1e3a8a" />
            <Text style={styles.barcodeButtonText}>Check a label</Text>
          </TouchableOpacity>
          <Text style={styles.labelHint}>
            Scan a product barcode to flag harmful ingredients and anything matching your
            allergies or sensitivities.
          </Text>
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
  scrollContent: {
    flexGrow: 1,
  },
  // Centered, width-capped column so content never overflows (esp. on web)
  inner: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: 20,
  },
  // ---- Entry view ----
  entryHeader: {
    marginBottom: 20,
  },
  entryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  entrySubtitle: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 21,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 4,
  },
  nameInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 16,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  selectedChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#047857',
  },
  // ---- Category selector ----
  categoryList: {
    gap: 10,
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  categorySubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 1,
  },
  categoryBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  categoryFoods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  foodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 18,
  },
  foodChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  // ---- Custom entry ----
  customRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  customInput: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  customAddButton: {
    width: 48,
    borderRadius: 12,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customAddDisabled: {
    backgroundColor: '#d1d5db',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 24,
    elevation: 4,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  barcodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#1e3a8a',
    paddingVertical: 15,
    borderRadius: 14,
  },
  barcodeButtonText: {
    color: '#1e3a8a',
    fontSize: 16,
    fontWeight: '600',
  },
  labelHint: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 10,
    lineHeight: 18,
    textAlign: 'center',
  },
  // ---- Camera / Label scan ----
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cameraCloseButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 160,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#10b981',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scanText: {
    marginTop: 24,
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    textAlign: 'center',
    maxWidth: 320,
  },
  // ---- Checking ----
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  analyzingSpinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  analyzingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  analyzingSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  // ---- Label result ----
  verdictBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  verdictTextWrap: {
    flex: 1,
  },
  verdictTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  verdictMessage: {
    fontSize: 14,
    lineHeight: 19,
  },
  productCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  productName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  productBrand: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  flagSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  flagSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  flagSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  flagRow: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  flagTerm: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    textTransform: 'capitalize',
  },
  flagReason: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  ingredientsCard: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  ingredientsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  ingredientsText: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 19,
  },
  // ---- Results ----
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalScoreBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  totalScoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodCard: {
    backgroundColor: 'white',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodInfo: {
    flex: 1,
    paddingRight: 12,
  },
  foodName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  foodPortion: {
    fontSize: 13,
    color: '#9ca3af',
  },
  nutrientTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  nutrientTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  nutrientTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  foodScoreContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  foodScoreBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  foodScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 4,
  },
  warningsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 6,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
  },
  resultsActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
});

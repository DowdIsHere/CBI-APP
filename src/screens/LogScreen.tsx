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
import { analyzeText, lookupBarcode } from '../services/foodAnalysis';

type LogView = 'entry' | 'barcode' | 'results';

// Tap-to-add suggestions that support the Enteric Nervous System.
const QUICK_ADDS = [
  'Grilled salmon',
  'Spinach',
  'Avocado',
  'Eggs',
  'Blueberries',
  'Olive oil',
  'Greek yogurt',
  'Broccoli',
  'Sauerkraut',
  'Bone broth',
];

export default function LogScreen() {
  const { addMeal } = useAppData();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<FoodItem[]>([]);
  const [view, setView] = useState<LogView>('entry');
  const [manualInput, setManualInput] = useState('');
  const [mealName, setMealName] = useState('');

  const addQuickItem = (item: string) => {
    setManualInput((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return item;
      // Avoid duplicates
      const existing = trimmed.split(',').map((s) => s.trim().toLowerCase());
      if (existing.includes(item.toLowerCase())) return prev;
      return `${trimmed}, ${item}`;
    });
  };

  const handleAnalyze = async () => {
    if (!manualInput.trim()) return;

    setAnalyzing(true);
    const result = await analyzeText(manualInput);
    setAnalyzing(false);

    if (result.success && result.foods.length > 0) {
      setDetectedFoods(result.foods);
      setView('results');
    } else {
      Alert.alert(
        'Hmm, nothing found',
        result.error || 'Could not read that. Try listing foods separated by commas.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleBarcodePress = async () => {
    if (hasPermission === null) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert(
          'Camera access needed',
          'Allow camera access to scan barcodes, or just type your meal instead.',
          [{ text: 'OK' }]
        );
        return;
      }
    } else if (!hasPermission) {
      Alert.alert(
        'Camera access needed',
        'Allow camera access in your settings to scan barcodes, or just type your meal instead.',
        [{ text: 'OK' }]
      );
      return;
    }
    setView('barcode');
  };

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    setView('entry');
    setAnalyzing(true);

    const result = await lookupBarcode(data);
    setAnalyzing(false);

    if (result.success && result.foods.length > 0) {
      setDetectedFoods(result.foods);
      setView('results');
    } else {
      Alert.alert(
        'Product not found',
        'That barcode is not in the database. Try typing the food instead.',
        [{ text: 'OK' }]
      );
    }
  };

  const saveMeal = () => {
    const totalScore = detectedFoods.reduce((sum, food) => sum + food.score, 0);

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
      items: detectedFoods,
      totalScore,
    });

    Alert.alert('Meal saved!', `Score: +${totalScore}. Great job supporting your ENS!`, [
      { text: 'OK', onPress: reset },
    ]);
  };

  const removeFood = (foodId: string) => {
    setDetectedFoods(detectedFoods.filter((f) => f.id !== foodId));
  };

  const reset = () => {
    setDetectedFoods([]);
    setView('entry');
    setManualInput('');
    setMealName('');
  };

  // ---- Barcode Scanner View ----
  if (view === 'barcode' && hasPermission) {
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
              <Text style={styles.cameraTitle}>Scan Barcode</Text>
              <View style={{ width: 44 }} />
            </SafeAreaView>

            <View style={styles.scanArea}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
              <Text style={styles.scanText}>Position barcode in frame</Text>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // ---- Analyzing State ----
  if (analyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.analyzingContainer}>
          <View style={styles.analyzingSpinner}>
            <ActivityIndicator size="large" color="#10b981" />
          </View>
          <Text style={styles.analyzingTitle}>Scoring your meal…</Text>
          <Text style={styles.analyzingSubtitle}>Checking how it supports your ENS</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ---- Results View ----
  if (view === 'results' && detectedFoods.length > 0) {
    const totalScore = detectedFoods.reduce((sum, f) => sum + f.score, 0);

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

            {detectedFoods.map((food) => (
              <View key={food.id} style={styles.foodCard}>
                <View style={styles.foodHeader}>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    {food.brand && <Text style={styles.foodBrand}>{food.brand}</Text>}
                    <Text style={styles.foodPortion}>
                      {food.portionSize || food.servingSize}
                    </Text>
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
              <TouchableOpacity style={styles.resetButton} onPress={reset}>
                <Ionicons name="refresh" size={20} color="#6b7280" />
                <Text style={styles.resetButtonText}>Start Over</Text>
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
              List what you ate and we'll score how it supports your gut.
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

          {/* Food entry */}
          <Text style={styles.fieldLabel}>What did you eat?</Text>
          <TextInput
            style={styles.foodInput}
            placeholder="e.g., grilled salmon, broccoli, olive oil"
            placeholderTextColor="#9ca3af"
            value={manualInput}
            onChangeText={setManualInput}
            multiline
          />
          <Text style={styles.helperText}>Separate foods with commas.</Text>

          {/* Quick add chips */}
          <Text style={styles.quickAddLabel}>Quick add</Text>
          <View style={styles.chipsRow}>
            {QUICK_ADDS.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.chip}
                onPress={() => addQuickItem(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={14} color="#047857" />
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Primary action */}
          <TouchableOpacity
            style={[styles.analyzeButton, !manualInput.trim() && styles.analyzeButtonDisabled]}
            onPress={handleAnalyze}
            disabled={!manualInput.trim()}
            activeOpacity={0.85}
          >
            <Ionicons name="sparkles" size={20} color="white" />
            <Text style={styles.analyzeButtonText}>Score my meal</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Secondary action */}
          <TouchableOpacity
            style={styles.barcodeButton}
            onPress={handleBarcodePress}
            activeOpacity={0.85}
          >
            <Ionicons name="barcode-outline" size={20} color="#1e3a8a" />
            <Text style={styles.barcodeButtonText}>Scan a barcode</Text>
          </TouchableOpacity>
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
  foodInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 96,
    textAlignVertical: 'top',
    color: '#1f2937',
  },
  helperText: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 8,
  },
  quickAddLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#047857',
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
    fontSize: 13,
    color: '#9ca3af',
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
  // ---- Camera / Barcode ----
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
  },
  // ---- Analyzing ----
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
  foodBrand: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  foodPortion: {
    fontSize: 13,
    color: '#9ca3af',
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

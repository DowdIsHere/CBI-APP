import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { BarcodeScanningResult } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { saveMeal, getTimeString, getTodayDate } from '../utils/storage';
import { DetectedFood } from '../types';
import {
  analyzePhoto,
  photoResultToDetectedFoods,
  scanBarcode,
  barcodeResultToDetectedFood,
  imageUriToBase64,
  getUserTriggers,
} from '../services/api';

export default function MealEntryScreen({ route, navigation }: any) {
  const [inputMethod, setInputMethod] = useState<string | null>(
    route?.params?.method || null
  );
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [mealName, setMealName] = useState('');

  // Manual entry state
  const [manualFoodName, setManualFoodName] = useState('');
  const [manualPortion, setManualPortion] = useState('');
  const [manualItems, setManualItems] = useState<DetectedFood[]>([]);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(cameraStatus === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (route?.params?.method) {
      handleInputMethod(route.params.method);
    }
  }, [route?.params?.method]);

  const inputMethods = [
    {
      id: 'photo',
      name: 'Photo',
      description: 'Snap a pic of your plate',
      icon: 'camera',
      color: '#3b82f6',
    },
    {
      id: 'batch',
      name: 'Batch Scan',
      description: 'Analyze multiple meals at once',
      icon: 'cube',
      color: '#8b5cf6',
    },
    {
      id: 'barcode',
      name: 'Barcode',
      description: 'Scan packaged foods',
      icon: 'scan',
      color: '#10b981',
    },
    {
      id: 'manual',
      name: 'Type It',
      description: 'Traditional text entry',
      icon: 'create',
      color: '#f59e0b',
    },
  ];

  const scoreFood = (name: string): number => {
    const lower = name.toLowerCase();
    // High score foods (ENS beneficial)
    if (/salmon|sardine|mackerel|anchov/.test(lower)) return 3;
    if (/broccoli|kale|cabbage|cauliflower|brussels|arugula/.test(lower)) return 2;
    if (/blueberr|blackberr|raspberr|strawberr/.test(lower)) return 2;
    if (/spinach|sweet potato|avocado|olive oil|turmeric|ginger/.test(lower)) return 2;
    if (/walnut|almond|flax|chia|hemp/.test(lower)) return 2;
    if (/kimchi|sauerkraut|kefir|kombucha|yogurt|miso/.test(lower)) return 2;
    if (/chicken|turkey|egg|beef|lamb/.test(lower)) return 1;
    if (/rice|quinoa|oat|bean|lentil/.test(lower)) return 1;
    if (/apple|banana|orange|grape|mango/.test(lower)) return 1;
    // Neutral / negative
    if (/soda|candy|chips|fries|donut|cake|cookie|ice cream/.test(lower)) return -1;
    if (/processed|hot dog|bacon|sausage/.test(lower)) return -1;
    return 1;
  };

  const handleInputMethod = async (method: string) => {
    setInputMethod(method);

    if (method === 'photo') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        await handlePhotoAnalysis(result.assets[0].uri);
      } else {
        setInputMethod(null);
      }
    } else if (method === 'barcode') {
      setCameraActive(true);
    } else if (method === 'batch') {
      // Batch: let user pick multiple images from gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length) {
        await handleBatchAnalysis(result.assets);
      } else {
        setInputMethod(null);
      }
    }
    // manual is handled via the form UI below
  };

  const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
    setCameraActive(false);
    await handleBarcodeScanning(data);
  };

  const handlePhotoAnalysis = async (imageUri: string) => {
    setAnalyzing(true);
    try {
      const base64 = await imageUriToBase64(imageUri);
      const triggers = await getUserTriggers();
      const result = await analyzePhoto(base64, triggers);
      const foods = photoResultToDetectedFoods(result);
      setDetectedFoods(foods);
    } catch (error) {
      console.error('Photo analysis error:', error);
      Alert.alert(
        'Analysis Failed',
        'Could not analyze the photo. Please try again or use manual entry.',
        [{ text: 'OK', onPress: () => setInputMethod(null) }]
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleBatchAnalysis = async (assets: ImagePicker.ImagePickerAsset[]) => {
    setAnalyzing(true);
    try {
      const triggers = await getUserTriggers();
      const allFoods: DetectedFood[] = [];

      for (let i = 0; i < assets.length; i++) {
        const base64 = await imageUriToBase64(assets[i].uri);
        const result = await analyzePhoto(base64, triggers);
        const containerFoods = result.foods;

        allFoods.push({
          id: Date.now() + i,
          name: `Container ${i + 1}`,
          items: containerFoods.map((f) => ({
            name: f.name,
            portion: f.portion_size,
            score: f.inflammation_score,
          })),
          totalScore: containerFoods.reduce(
            (sum, f) => sum + f.inflammation_score,
            0
          ),
        });
      }

      setDetectedFoods(allFoods);
    } catch (error) {
      console.error('Batch analysis error:', error);
      Alert.alert(
        'Batch Analysis Failed',
        'Could not analyze the photos. Please try again or use manual entry.',
        [{ text: 'OK', onPress: () => setInputMethod(null) }]
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleBarcodeScanning = async (barcode: string) => {
    setAnalyzing(true);
    try {
      const triggers = await getUserTriggers();
      const result = await scanBarcode(barcode, triggers);
      const food = barcodeResultToDetectedFood(result);
      setDetectedFoods([food]);

      // Show trigger warnings if any
      if (result.food.triggers_detected?.length > 0) {
        Alert.alert(
          'Trigger Warning',
          result.food.triggers_detected.map((t) => t.warning).join('\n'),
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Barcode scan error:', error);
      const message = error instanceof Error ? error.message : 'Could not look up this product.';
      Alert.alert(
        'Scan Failed',
        `${message}\n\nYou can enter this food manually instead.`,
        [
          { text: 'Manual Entry', onPress: () => setInputMethod('manual') },
          { text: 'Try Again', onPress: () => setCameraActive(true) },
        ]
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const addManualItem = () => {
    if (!manualFoodName.trim()) {
      Alert.alert('Missing Info', 'Please enter a food name.');
      return;
    }
    const score = scoreFood(manualFoodName);
    const newItem: DetectedFood = {
      id: Date.now(),
      name: manualFoodName.trim(),
      portionSize: manualPortion.trim() || '1 serving',
      score,
      warnings: [],
    };
    setManualItems([...manualItems, newItem]);
    setManualFoodName('');
    setManualPortion('');
  };

  const removeManualItem = (id: number) => {
    setManualItems(manualItems.filter((item) => item.id !== id));
  };

  const handleSaveMeal = async () => {
    const foods = inputMethod === 'manual' ? manualItems : detectedFoods;
    if (foods.length === 0) {
      Alert.alert('No Items', 'Add at least one food item before saving.');
      return;
    }

    const totalScore = foods.reduce((sum, food) => {
      if ('totalScore' in food) return sum + food.totalScore;
      return sum + food.score;
    }, 0);

    const meal = {
      id: Date.now().toString(),
      name: mealName.trim() || getMealNameFromTime(),
      date: getTodayDate(),
      time: getTimeString(),
      items: foods,
      totalScore,
      method: inputMethod as 'photo' | 'batch' | 'barcode' | 'manual',
    };

    await saveMeal(meal);

    Alert.alert(
      'Meal Saved!',
      `${meal.name} saved with score: ${totalScore >= 0 ? '+' : ''}${totalScore}. Check your Progress to see the impact.`,
      [
        {
          text: 'OK',
          onPress: () => {
            reset();
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  const getMealNameFromTime = (): string => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Breakfast';
    if (hour < 15) return 'Lunch';
    if (hour < 17) return 'Snack';
    return 'Dinner';
  };

  const removeFood = (foodId: number) => {
    setDetectedFoods(detectedFoods.filter((f) => f.id !== foodId));
  };

  const reset = () => {
    setInputMethod(null);
    setDetectedFoods([]);
    setCameraActive(false);
    setManualItems([]);
    setManualFoodName('');
    setManualPortion('');
    setMealName('');
  };

  if (cameraActive && hasPermission) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              'upc_a',
              'upc_e',
              'ean8',
              'ean13',
              'code128',
              'code39',
            ],
          }}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.cameraCloseButton}
                onPress={() => {
                  setCameraActive(false);
                  setInputMethod(null);
                }}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.scanArea}>
              <View style={styles.scanFrame} />
              <Text style={styles.scanText}>Position barcode in frame</Text>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scrollView}>
          {/* Method Selection */}
          {!inputMethod && !analyzing && detectedFoods.length === 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                How would you like to add your meal?
              </Text>
              <View style={styles.methodsGrid}>
                {inputMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.methodCard,
                      { borderColor: method.color + '40' },
                    ]}
                    onPress={() => handleInputMethod(method.id)}
                  >
                    <Ionicons
                      name={method.icon as any}
                      size={48}
                      color={method.color}
                    />
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodDescription}>
                      {method.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.featuresSection}>
                <View style={styles.featureCard}>
                  <Ionicons name="camera" size={24} color="#3b82f6" />
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>Photo Analysis</Text>
                    <Text style={styles.featureText}>
                      AI identifies all foods instantly
                    </Text>
                  </View>
                </View>
                <View style={styles.featureCard}>
                  <Ionicons name="scan" size={24} color="#10b981" />
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>Barcode Scanner</Text>
                    <Text style={styles.featureText}>
                      Hidden inflammatory oils detected
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Analyzing State */}
          {analyzing && (
            <View style={styles.analyzingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.analyzingTitle}>
                {inputMethod === 'photo' && 'Analyzing Your Photo...'}
                {inputMethod === 'batch' && 'Scanning Multiple Meals...'}
                {inputMethod === 'barcode' && 'Looking Up Product...'}
              </Text>
              <Text style={styles.analyzingSubtitle}>
                AI is working its magic
              </Text>
            </View>
          )}

          {/* Manual Entry Form */}
          {inputMethod === 'manual' && (
            <View style={styles.section}>
              <View style={styles.manualHeader}>
                <Text style={styles.sectionTitle}>Manual Entry</Text>
                <TouchableOpacity onPress={reset}>
                  <Ionicons name="close-circle" size={24} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.mealNameInput}
                placeholder="Meal name (e.g., Breakfast, Lunch)"
                placeholderTextColor="#9ca3af"
                value={mealName}
                onChangeText={setMealName}
              />

              <View style={styles.manualInputRow}>
                <TextInput
                  style={[styles.input, { flex: 2 }]}
                  placeholder="Food name (e.g., Grilled Salmon)"
                  placeholderTextColor="#9ca3af"
                  value={manualFoodName}
                  onChangeText={setManualFoodName}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Portion"
                  placeholderTextColor="#9ca3af"
                  value={manualPortion}
                  onChangeText={setManualPortion}
                />
              </View>

              <TouchableOpacity style={styles.addItemButton} onPress={addManualItem}>
                <Ionicons name="add-circle" size={20} color="white" />
                <Text style={styles.addItemButtonText}>Add Item</Text>
              </TouchableOpacity>

              {manualItems.length > 0 && (
                <View style={styles.manualItemsList}>
                  {manualItems.map((item) => (
                    <View key={item.id} style={styles.manualItemCard}>
                      <View style={styles.manualItemInfo}>
                        <Text style={styles.manualItemName}>{item.name}</Text>
                        <Text style={styles.manualItemPortion}>
                          {'portionSize' in item ? item.portionSize : ''}
                        </Text>
                      </View>
                      <View style={styles.manualItemRight}>
                        <View
                          style={[
                            styles.scoreBadge,
                            {
                              backgroundColor:
                                ('score' in item ? item.score : 0) >= 2 ? '#d1fae5' : ('score' in item ? item.score : 0) >= 0 ? '#dbeafe' : '#fee2e2',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.scoreBadgeText,
                              {
                                color:
                                  ('score' in item ? item.score : 0) >= 2 ? '#047857' : ('score' in item ? item.score : 0) >= 0 ? '#1e40af' : '#dc2626',
                              },
                            ]}
                          >
                            {('score' in item ? item.score : 0) >= 0 ? '+' : ''}{'score' in item ? item.score : item.totalScore}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => removeManualItem(item.id)}>
                          <Ionicons name="trash" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}

                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Meal Summary</Text>
                    <View style={styles.summaryContent}>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Score</Text>
                        <Text style={styles.summaryValue}>
                          {manualItems.reduce((s, f) => s + ('score' in f ? f.score : f.totalScore), 0) >= 0 ? '+' : ''}
                          {manualItems.reduce((s, f) => s + ('score' in f ? f.score : f.totalScore), 0)}
                        </Text>
                      </View>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Items</Text>
                        <Text style={styles.summaryValue}>
                          {manualItems.length}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeal}>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text style={styles.saveButtonText}>Save Meal</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Results (photo/batch/barcode) */}
          {!analyzing && detectedFoods.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detected Items</Text>

              <TextInput
                style={styles.mealNameInput}
                placeholder="Meal name (optional)"
                placeholderTextColor="#9ca3af"
                value={mealName}
                onChangeText={setMealName}
              />

              {detectedFoods.map((food) => (
                <View key={food.id} style={styles.foodCard}>
                  <View style={styles.foodHeader}>
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{food.name}</Text>
                      {'brand' in food && food.brand && (
                        <Text style={styles.foodBrand}>{food.brand}</Text>
                      )}
                      {'portionSize' in food && food.portionSize && (
                        <Text style={styles.foodPortion}>{food.portionSize}</Text>
                      )}
                      {'servingSize' in food && food.servingSize && (
                        <Text style={styles.foodPortion}>{food.servingSize}</Text>
                      )}
                    </View>
                    <View>
                      {'score' in food && (
                        <View
                          style={[
                            styles.scoreBadge,
                            {
                              backgroundColor:
                                food.score >= 2 ? '#d1fae5' : '#dbeafe',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.scoreBadgeText,
                              { color: food.score >= 2 ? '#047857' : '#1e40af' },
                            ]}
                          >
                            +{food.score}
                          </Text>
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeFood(food.id)}
                      >
                        <Ionicons name="trash" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {'items' in food && food.items && (
                    <View style={styles.batchItems}>
                      {food.items.map((item: any, idx: number) => (
                        <View key={idx} style={styles.batchItem}>
                          <Text style={styles.batchItemName}>{item.name}</Text>
                          <Text style={styles.batchItemPortion}>
                            ({item.portion})
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Meal Summary</Text>
                <View style={styles.summaryContent}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total Score</Text>
                    <Text style={styles.summaryValue}>
                      +
                      {detectedFoods.reduce(
                        (sum, f) => sum + ('totalScore' in f ? f.totalScore : f.score),
                        0
                      )}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Items Detected</Text>
                    <Text style={styles.summaryValue}>{detectedFoods.length}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.resetButton} onPress={reset}>
                  <Text style={styles.resetButtonText}>Start Over</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeal}>
                  <Text style={styles.saveButtonText}>Save Meal</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  methodCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  methodName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#1f2937',
  },
  methodDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  featuresSection: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#6b7280',
  },
  analyzingContainer: {
    padding: 48,
    alignItems: 'center',
  },
  analyzingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    color: '#1f2937',
  },
  analyzingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  // Manual entry styles
  manualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealNameInput: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  manualInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 8,
    fontSize: 14,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  addItemButton: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  addItemButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  manualItemsList: {
    gap: 8,
  },
  manualItemCard: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  manualItemInfo: {
    flex: 1,
  },
  manualItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  manualItemPortion: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  manualItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  // Food card styles
  foodCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  foodBrand: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  foodPortion: {
    fontSize: 12,
    color: '#9ca3af',
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeButton: {
    alignSelf: 'flex-end',
  },
  batchItems: {
    marginTop: 12,
    gap: 8,
  },
  batchItem: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  batchItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  batchItemPortion: {
    fontSize: 12,
    color: '#6b7280',
  },
  summaryCard: {
    backgroundColor: '#ecfdf5',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
  },
  summaryContent: {
    flexDirection: 'row',
    gap: 24,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    padding: 20,
    alignItems: 'flex-end',
  },
  cameraCloseButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 150,
    borderWidth: 3,
    borderColor: '#10b981',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scanText: {
    marginTop: 20,
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});

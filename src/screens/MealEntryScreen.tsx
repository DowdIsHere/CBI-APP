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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { BarcodeScanningResult } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useApp, FoodItem } from '../context/AppContext';

// Common foods database for manual entry suggestions
const commonFoods = [
  { name: 'Wild Salmon', category: 'Protein', score: 3 },
  { name: 'Grilled Chicken', category: 'Protein', score: 2 },
  { name: 'Sardines', category: 'Protein', score: 3 },
  { name: 'Grass-fed Beef', category: 'Protein', score: 2 },
  { name: 'Eggs (Pasture-raised)', category: 'Protein', score: 2 },
  { name: 'Broccoli', category: 'Vegetable', score: 3 },
  { name: 'Kale', category: 'Vegetable', score: 3 },
  { name: 'Spinach', category: 'Vegetable', score: 3 },
  { name: 'Brussels Sprouts', category: 'Vegetable', score: 3 },
  { name: 'Cauliflower', category: 'Vegetable', score: 2 },
  { name: 'Asparagus', category: 'Vegetable', score: 2 },
  { name: 'Sweet Potato', category: 'Carbs', score: 2 },
  { name: 'Blueberries', category: 'Fruit', score: 2 },
  { name: 'Avocado', category: 'Healthy Fat', score: 3 },
  { name: 'Olive Oil', category: 'Healthy Fat', score: 3 },
  { name: 'Almonds', category: 'Nuts', score: 2 },
  { name: 'Walnuts', category: 'Nuts', score: 2 },
  { name: 'Sauerkraut', category: 'Fermented', score: 3 },
  { name: 'Kimchi', category: 'Fermented', score: 3 },
];

export default function MealEntryScreen({ route, navigation }: any) {
  const { addMeal, userProfile } = useApp();
  const [inputMethod, setInputMethod] = useState<string | null>(
    route?.params?.method || null
  );
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<FoodItem[]>([]);
  const [cameraActive, setCameraActive] = useState(false);

  // Manual entry state
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customFoodName, setCustomFoodName] = useState('');
  const [customFoodPortion, setCustomFoodPortion] = useState('');
  const [customFoodScore, setCustomFoodScore] = useState('2');
  const [mealName, setMealName] = useState('');

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(cameraStatus === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (route?.params?.method === 'manual') {
      setShowManualEntry(true);
      setInputMethod('manual');
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

  const handleInputMethod = async (method: string) => {
    setInputMethod(method);

    if (method === 'photo') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        simulatePhotoAnalysis();
      } else {
        setInputMethod(null);
      }
    } else if (method === 'barcode') {
      setCameraActive(true);
    } else if (method === 'batch') {
      simulateBatchAnalysis();
    } else if (method === 'manual') {
      setShowManualEntry(true);
    }
  };

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setCameraActive(false);
    simulateBarcodeScanning(data);
  };

  const simulatePhotoAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setDetectedFoods([
        {
          id: Date.now(),
          name: 'Grilled Salmon',
          portionSize: '6 oz',
          score: 3,
          warnings: [],
        },
        {
          id: Date.now() + 1,
          name: 'Steamed Broccoli',
          portionSize: '1.5 cups',
          score: 2,
          warnings: [],
        },
      ]);
      setAnalyzing(false);
    }, 2000);
  };

  const simulateBatchAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setDetectedFoods([
        {
          id: Date.now(),
          name: 'Meal Prep Container 1',
          items: [
            { name: 'Grilled Chicken', portion: '6 oz', score: 1 },
            { name: 'Sweet Potato', portion: '1 cup', score: 1 },
            { name: 'Asparagus', portion: '1 cup', score: 2 },
          ],
          totalScore: 4,
          score: 4,
        },
      ]);
      setAnalyzing(false);
    }, 2000);
  };

  const simulateBarcodeScanning = (barcode: string) => {
    setAnalyzing(true);
    setTimeout(() => {
      setDetectedFoods([
        {
          id: Date.now(),
          name: 'Wild Planet Wild Sardines',
          brand: 'Wild Planet',
          upc: barcode,
          servingSize: '1 can (3.75 oz)',
          score: 2,
          warnings: [],
        },
      ]);
      setAnalyzing(false);
    }, 1500);
  };

  const addFoodFromSearch = (food: typeof commonFoods[0]) => {
    const newFood: FoodItem = {
      id: Date.now(),
      name: food.name,
      portionSize: '1 serving',
      score: food.score,
      warnings: [],
    };
    setDetectedFoods([...detectedFoods, newFood]);
    setSearchQuery('');
  };

  const addCustomFood = () => {
    if (!customFoodName.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return;
    }

    const newFood: FoodItem = {
      id: Date.now(),
      name: customFoodName.trim(),
      portionSize: customFoodPortion.trim() || '1 serving',
      score: parseInt(customFoodScore) || 2,
      warnings: [],
    };
    setDetectedFoods([...detectedFoods, newFood]);
    setCustomFoodName('');
    setCustomFoodPortion('');
    setCustomFoodScore('2');
  };

  const filteredFoods = commonFoods.filter(
    (food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveMeal = () => {
    const totalScore = detectedFoods.reduce((sum, food) => {
      if (food.items) return sum + (food.totalScore || 0);
      return sum + food.score;
    }, 0);

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const meal = {
      name: mealName || getMealNameByTime(),
      time: timeString,
      date: now.toISOString().split('T')[0],
      score: totalScore,
      items: detectedFoods.length,
      foods: detectedFoods,
    };

    addMeal(meal);

    Alert.alert(
      'Meal Saved!',
      `Score: +${totalScore}. Check your Progress Tracker to see the impact.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setInputMethod(null);
            setDetectedFoods([]);
            setShowManualEntry(false);
            setMealName('');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getMealNameByTime = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Breakfast';
    if (hour < 15) return 'Lunch';
    if (hour < 18) return 'Snack';
    return 'Dinner';
  };

  const removeFood = (foodId: number) => {
    setDetectedFoods(detectedFoods.filter((f) => f.id !== foodId));
  };

  const reset = () => {
    setInputMethod(null);
    setDetectedFoods([]);
    setCameraActive(false);
    setShowManualEntry(false);
    setSearchQuery('');
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

  // Manual Entry Modal
  const renderManualEntryModal = () => (
    <Modal
      visible={showManualEntry}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowManualEntry(false)}>
            <Ionicons name="close" size={28} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Foods Manually</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Meal Name */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Meal Name (optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Breakfast, Lunch, Dinner"
              value={mealName}
              onChangeText={setMealName}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Search Foods */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Search Common Foods</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Search by name or category..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {searchQuery.length > 0 && (
            <View style={styles.searchResults}>
              {filteredFoods.map((food, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.searchResultItem}
                  onPress={() => addFoodFromSearch(food)}
                >
                  <View style={styles.searchResultInfo}>
                    <Text style={styles.searchResultName}>{food.name}</Text>
                    <Text style={styles.searchResultCategory}>
                      {food.category}
                    </Text>
                  </View>
                  <View style={styles.searchResultScore}>
                    <Text style={styles.searchResultScoreText}>
                      +{food.score}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              {filteredFoods.length === 0 && (
                <Text style={styles.noResults}>
                  No foods found. Add a custom food below.
                </Text>
              )}
            </View>
          )}

          {/* Custom Food Entry */}
          <View style={styles.customFoodSection}>
            <Text style={styles.sectionTitle}>Add Custom Food</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Food name"
              value={customFoodName}
              onChangeText={setCustomFoodName}
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              style={[styles.textInput, { marginTop: 8 }]}
              placeholder="Portion size (e.g., 1 cup, 6 oz)"
              value={customFoodPortion}
              onChangeText={setCustomFoodPortion}
              placeholderTextColor="#9ca3af"
            />
            <View style={styles.scoreSelector}>
              <Text style={styles.scoreSelectorLabel}>CBI Score:</Text>
              <View style={styles.scoreButtons}>
                {['-1', '0', '1', '2', '3'].map((score) => (
                  <TouchableOpacity
                    key={score}
                    style={[
                      styles.scoreButton,
                      customFoodScore === score && styles.scoreButtonActive,
                    ]}
                    onPress={() => setCustomFoodScore(score)}
                  >
                    <Text
                      style={[
                        styles.scoreButtonText,
                        customFoodScore === score &&
                          styles.scoreButtonTextActive,
                      ]}
                    >
                      {parseInt(score) >= 0 ? '+' : ''}
                      {score}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity
              style={styles.addCustomButton}
              onPress={addCustomFood}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.addCustomButtonText}>Add Food</Text>
            </TouchableOpacity>
          </View>

          {/* Added Foods */}
          {detectedFoods.length > 0 && (
            <View style={styles.addedFoodsSection}>
              <Text style={styles.sectionTitle}>
                Added Foods ({detectedFoods.length})
              </Text>
              {detectedFoods.map((food) => (
                <View key={food.id} style={styles.addedFoodItem}>
                  <View style={styles.addedFoodInfo}>
                    <Text style={styles.addedFoodName}>{food.name}</Text>
                    <Text style={styles.addedFoodPortion}>
                      {food.portionSize || food.servingSize}
                    </Text>
                  </View>
                  <View style={styles.addedFoodActions}>
                    <View
                      style={[
                        styles.addedFoodScore,
                        {
                          backgroundColor:
                            food.score >= 2 ? '#d1fae5' : '#dbeafe',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.addedFoodScoreText,
                          { color: food.score >= 2 ? '#047857' : '#1e40af' },
                        ]}
                      >
                        {food.score >= 0 ? '+' : ''}
                        {food.score}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => removeFood(food.id)}>
                      <Ionicons name="trash" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <View style={styles.totalScoreSection}>
                <Text style={styles.totalScoreLabel}>Total Score</Text>
                <Text style={styles.totalScoreValue}>
                  +
                  {detectedFoods.reduce(
                    (sum, f) => sum + (f.totalScore || f.score),
                    0
                  )}
                </Text>
              </View>

              <TouchableOpacity style={styles.saveMealButton} onPress={saveMeal}>
                <Text style={styles.saveMealButtonText}>Save Meal</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
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

            {/* Features */}
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

        {/* Results */}
        {!analyzing && detectedFoods.length > 0 && !showManualEntry && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detected Items</Text>
            {detectedFoods.map((food) => (
              <View key={food.id} style={styles.foodCard}>
                <View style={styles.foodHeader}>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    {food.brand && (
                      <Text style={styles.foodBrand}>{food.brand}</Text>
                    )}
                    {food.portionSize && (
                      <Text style={styles.foodPortion}>{food.portionSize}</Text>
                    )}
                    {food.servingSize && (
                      <Text style={styles.foodPortion}>{food.servingSize}</Text>
                    )}
                  </View>
                  <View>
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
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeFood(food.id)}
                    >
                      <Ionicons name="trash" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Batch Items */}
                {food.items && (
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

            {/* Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Meal Summary</Text>
              <View style={styles.summaryContent}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Score</Text>
                  <Text style={styles.summaryValue}>
                    +
                    {detectedFoods.reduce(
                      (sum, f) => sum + (f.totalScore || f.score),
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

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.resetButton} onPress={reset}>
                <Text style={styles.resetButtonText}>Start Over</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveMeal}>
                <Text style={styles.saveButtonText}>Save Meal</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {renderManualEntryModal()}
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
  // Manual Entry Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  searchResults: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 200,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  searchResultCategory: {
    fontSize: 12,
    color: '#6b7280',
  },
  searchResultScore: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  searchResultScoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#047857',
  },
  noResults: {
    padding: 16,
    textAlign: 'center',
    color: '#6b7280',
  },
  customFoodSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  scoreSelector: {
    marginTop: 12,
  },
  scoreSelectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  scoreButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  scoreButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  scoreButtonActive: {
    backgroundColor: '#3b82f6',
  },
  scoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  scoreButtonTextActive: {
    color: 'white',
  },
  addCustomButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  addCustomButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  addedFoodsSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  addedFoodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  addedFoodInfo: {
    flex: 1,
  },
  addedFoodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  addedFoodPortion: {
    fontSize: 12,
    color: '#6b7280',
  },
  addedFoodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addedFoodScore: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addedFoodScoreText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalScoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#10b981',
  },
  totalScoreLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  saveMealButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveMealButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

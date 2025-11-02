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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { BarcodeScanningResult } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function MealEntryScreen({ route }: any) {
  const [inputMethod, setInputMethod] = useState<string | null>(
    route?.params?.method || null
  );
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<any[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [manualFoodName, setManualFoodName] = useState('');
  const [manualPortionSize, setManualPortionSize] = useState('');
  const [batchMode, setBatchMode] = useState(false);
  const [canScanAgain, setCanScanAgain] = useState(true);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(cameraStatus === 'granted');
    })();
  }, []);

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
      description: 'Scan multiple barcodes at once',
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
        const imageUri = result.assets[0].uri;
        analyzePhoto(imageUri);
      } else {
        setInputMethod(null);
      }
    } else if (method === 'barcode') {
      setCameraActive(true);
      setBatchMode(false);
    } else if (method === 'batch') {
      setCameraActive(true);
      setBatchMode(true);
      setCanScanAgain(true);
    } else if (method === 'manual') {
      // Manual entry form will be shown in the render
    }
  };

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (!canScanAgain) return; // Prevent rapid re-scanning

    setCanScanAgain(false);

    if (batchMode) {
      // In batch mode, keep camera open and add to list
      lookupBarcode(data, true);
    } else {
      // In single mode, close camera
      setCameraActive(false);
      lookupBarcode(data, false);
    }
  };

  const analyzePhoto = async (imageUri: string) => {
    setAnalyzing(true);

    // TODO: Integrate with OpenAI Vision API or Google Cloud Vision
    // For now, showing demo data with helpful message

    // Example OpenAI Vision API integration:
    // const OPENAI_API_KEY = 'your-api-key-here'; // Store in env or config
    // if (OPENAI_API_KEY) {
    //   try {
    //     const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //       method: 'POST',
    //       headers: {
    //         'Authorization': `Bearer ${OPENAI_API_KEY}`,
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         model: 'gpt-4-vision-preview',
    //         messages: [{
    //           role: 'user',
    //           content: [
    //             { type: 'text', text: 'Identify all food items in this image with portion sizes.' },
    //             { type: 'image_url', image_url: { url: imageUri } }
    //           ]
    //         }],
    //         max_tokens: 500
    //       })
    //     });
    //     const data = await response.json();
    //     // Parse AI response and create food items
    //   } catch (error) {
    //     console.error('AI analysis failed:', error);
    //   }
    // }

    // Demo data with informative message
    setTimeout(() => {
      Alert.alert(
        'Demo Mode',
        'Photo analysis uses AI vision APIs (OpenAI Vision or Google Cloud Vision) which require an API key and cost money per request.\n\nShowing example data for now.',
        [{ text: 'OK' }]
      );

      setDetectedFoods([
        {
          id: Date.now(),
          name: 'Grilled Salmon (Demo)',
          portionSize: '6 oz',
          score: 3,
          warnings: [],
        },
        {
          id: Date.now() + 1,
          name: 'Steamed Broccoli (Demo)',
          portionSize: '1.5 cups',
          score: 2,
          warnings: [],
        },
      ]);
      setAnalyzing(false);
    }, 2000);
  };

  const lookupBarcode = async (barcode: string, isBatchMode: boolean) => {
    setAnalyzing(true);
    try {
      // Call Open Food Facts API for real barcode lookup
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        const newFood = {
          id: Date.now(),
          name: product.product_name || 'Unknown Product',
          brand: product.brands || 'Unknown Brand',
          upc: barcode,
          servingSize: product.serving_size || 'See package',
          score: 1, // Default score - you can add logic to calculate based on ingredients
          warnings: [],
        };

        if (isBatchMode) {
          // In batch mode, add to existing list
          setDetectedFoods((prev) => [...prev, newFood]);
          // Re-enable scanning after a short delay
          setTimeout(() => setCanScanAgain(true), 1500);
        } else {
          // In single mode, replace list
          setDetectedFoods([newFood]);
        }
      } else {
        // Barcode not found in database
        Alert.alert('Product Not Found', `Barcode ${barcode} not found in database.`);
        if (isBatchMode) {
          // In batch mode, allow scanning again without adding unknown product
          setTimeout(() => setCanScanAgain(true), 1500);
        } else {
          setDetectedFoods([
            {
              id: Date.now(),
              name: 'Unknown Product',
              brand: 'Scan Again',
              upc: barcode,
              servingSize: 'N/A',
              score: 0,
              warnings: ['Product not found in database'],
            },
          ]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to look up barcode. Please try again.');
      console.error('Barcode lookup error:', error);
      if (isBatchMode) {
        setTimeout(() => setCanScanAgain(true), 1500);
      }
    }
    setAnalyzing(false);
  };

  const saveMeal = () => {
    const totalScore = detectedFoods.reduce((sum, food) => {
      if (food.items) return sum + food.totalScore;
      return sum + food.score;
    }, 0);

    Alert.alert(
      'Meal Saved!',
      `Score: +${totalScore}. Check your Progress Tracker to see the impact.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setInputMethod(null);
            setDetectedFoods([]);
          },
        },
      ]
    );
  };

  const removeFood = (foodId: number) => {
    setDetectedFoods(detectedFoods.filter((f) => f.id !== foodId));
  };

  const handleManualEntry = () => {
    if (!manualFoodName.trim()) {
      Alert.alert('Missing Information', 'Please enter a food name.');
      return;
    }

    // Add the manually entered food to detected foods
    const newFood = {
      id: Date.now(),
      name: manualFoodName.trim(),
      portionSize: manualPortionSize.trim() || 'Not specified',
      score: 1, // Default score for manual entries
      warnings: [],
    };

    setDetectedFoods([...detectedFoods, newFood]);
    setManualFoodName('');
    setManualPortionSize('');
  };

  const reset = () => {
    setInputMethod(null);
    setDetectedFoods([]);
    setCameraActive(false);
    setManualFoodName('');
    setManualPortionSize('');
    setBatchMode(false);
    setCanScanAgain(true);
  };

  const finishBatchScanning = () => {
    setCameraActive(false);
    setBatchMode(false);
    setCanScanAgain(true);
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
              {batchMode && detectedFoods.length > 0 && (
                <View style={styles.batchCounter}>
                  <Text style={styles.batchCounterText}>
                    {detectedFoods.length} item{detectedFoods.length !== 1 ? 's' : ''} scanned
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.cameraCloseButton}
                onPress={() => {
                  setCameraActive(false);
                  setInputMethod(null);
                  setBatchMode(false);
                }}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.scanArea}>
              <View style={styles.scanFrame} />
              <Text style={styles.scanText}>
                {batchMode
                  ? detectedFoods.length === 0
                    ? 'Scan first barcode'
                    : 'Scan next barcode'
                  : 'Position barcode in frame'}
              </Text>
            </View>
            {batchMode && detectedFoods.length > 0 && (
              <View style={styles.batchActions}>
                <TouchableOpacity
                  style={styles.doneScanningButton}
                  onPress={finishBatchScanning}
                >
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <Text style={styles.doneScanningText}>Done Scanning</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </CameraView>
      </View>
    );
  }

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

        {/* Manual Entry Form */}
        {inputMethod === 'manual' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {detectedFoods.length === 0 ? 'Enter Food Details' : 'Add Another Food'}
            </Text>

            <View style={styles.manualEntryForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Food Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Grilled Chicken"
                  value={manualFoodName}
                  onChangeText={setManualFoodName}
                  autoFocus
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Portion Size (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., 6 oz, 1 cup, 2 pieces"
                  value={manualPortionSize}
                  onChangeText={setManualPortionSize}
                />
              </View>

              <View style={styles.manualEntryActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={reset}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addFoodButton}
                  onPress={handleManualEntry}
                >
                  <Ionicons name="add-circle" size={20} color="white" />
                  <Text style={styles.addFoodButtonText}>Add Food</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.helpText}>
                {detectedFoods.length === 0
                  ? 'You can add multiple foods one at a time, then save your meal when done.'
                  : 'Add more foods or scroll down to save your meal.'}
              </Text>
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
        {!analyzing && detectedFoods.length > 0 && (
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchCounter: {
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  batchCounterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
  batchActions: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  doneScanningButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  doneScanningText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  manualEntryForm: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  manualEntryActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  addFoodButton: {
    flex: 1,
    backgroundColor: '#f59e0b',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  addFoodButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

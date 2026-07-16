import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { BarcodeScanningResult } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useAppData } from '../data/AppContext';
import { FoodItem } from '../data/types';
import { analyzePhoto, analyzeText, lookupBarcode } from '../services/foodAnalysis';
import { alertMessage } from '../utils/alerts';

type InputMethod = 'camera' | 'barcode' | 'type' | 'batch' | null;

export default function LogScreen() {
  const { addMeal } = useAppData();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<FoodItem[]>([]);
  const [inputMethod, setInputMethod] = useState<InputMethod>('camera');
  const [manualInput, setManualInput] = useState('');
  const [barcodeScanning, setBarcodeScanning] = useState(false);
  const [mealName, setMealName] = useState('');

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(cameraStatus === 'granted');
    })();
  }, []);

  const handleScan = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAnalyzing(true);
      const analysis = await analyzePhoto(result.assets[0].uri);
      setAnalyzing(false);

      if (analysis.success && analysis.foods.length > 0) {
        setDetectedFoods(analysis.foods);
      } else {
        alertMessage(
          'Analysis Failed',
          analysis.error || 'Could not identify foods in the image. Try again or enter manually.'
        );
      }
    }
  };

  const handleBarcodePress = () => {
    setBarcodeScanning(true);
    setInputMethod('barcode');
  };

  const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
    setBarcodeScanning(false);
    setInputMethod('camera');
    setAnalyzing(true);

    const result = await lookupBarcode(data);
    setAnalyzing(false);

    if (result.success && result.foods.length > 0) {
      setDetectedFoods(result.foods);
    } else {
      alertMessage(
        'Product Not Found',
        'This barcode was not found in the database. Try taking a photo or entering manually.'
      );
    }
  };

  const handleTypePress = () => {
    setInputMethod('type');
  };

  const handleBatchPress = async () => {
    // For batch, let user select multiple photos from library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAnalyzing(true);
      const allFoods: FoodItem[] = [];

      // Analyze each selected image
      for (const asset of result.assets) {
        const analysis = await analyzePhoto(asset.uri);
        if (analysis.success) {
          allFoods.push(...analysis.foods);
        }
      }

      setAnalyzing(false);

      if (allFoods.length > 0) {
        setDetectedFoods(allFoods);
      } else {
        alertMessage('Analysis Failed', 'Could not identify foods in the selected images.');
      }
    }
  };


  const handleManualSubmit = async () => {
    if (!manualInput.trim()) return;

    setAnalyzing(true);
    const result = await analyzeText(manualInput);
    setAnalyzing(false);

    if (result.success && result.foods.length > 0) {
      setDetectedFoods(result.foods);
      setManualInput('');
      setInputMethod('camera');
    } else {
      alertMessage('Analysis Failed', result.error || 'Could not analyze the food description.');
    }
  };

  const saveMeal = () => {
    const totalScore = detectedFoods.reduce((sum, food) => sum + food.score, 0);

    // Determine meal name based on time of day
    const hour = new Date().getHours();
    let defaultMealName = 'Snack';
    if (hour >= 5 && hour < 11) defaultMealName = 'Breakfast';
    else if (hour >= 11 && hour < 15) defaultMealName = 'Lunch';
    else if (hour >= 17 && hour < 21) defaultMealName = 'Dinner';

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    addMeal({
      name: mealName || defaultMealName,
      time: timeString,
      date: now.toISOString().split('T')[0],
      items: detectedFoods,
      totalScore,
    });

    alertMessage(
      'Meal Saved!',
      `Score: +${totalScore}. Great job supporting your ENS!`,
      () => {
        setDetectedFoods([]);
        setInputMethod('camera');
        setMealName('');
      }
    );
  };

  const removeFood = (foodId: string) => {
    setDetectedFoods(detectedFoods.filter((f) => f.id !== foodId));
  };

  const reset = () => {
    setDetectedFoods([]);
    setInputMethod('camera');
    setBarcodeScanning(false);
    setManualInput('');
    setMealName('');
  };

  // Barcode Scanner View
  if (barcodeScanning && hasPermission) {
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
                onPress={() => {
                  setBarcodeScanning(false);
                  setInputMethod('camera');
                }}
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

  // Manual Type Input View
  if (inputMethod === 'type') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.typeHeader}>
          <TouchableOpacity onPress={() => setInputMethod('camera')}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.typeTitle}>Type Your Meal</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.typeContent}>
          <Text style={styles.typeLabel}>
            Enter foods separated by commas
          </Text>
          <TextInput
            style={styles.typeInput}
            placeholder="e.g., grilled salmon, broccoli, olive oil"
            placeholderTextColor="#9ca3af"
            value={manualInput}
            onChangeText={setManualInput}
            multiline
            autoFocus
          />

          <TouchableOpacity
            style={[styles.typeSubmit, !manualInput.trim() && styles.typeSubmitDisabled]}
            onPress={handleManualSubmit}
            disabled={!manualInput.trim()}
          >
            <Text style={styles.typeSubmitText}>Analyze Foods</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Analyzing State
  if (analyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.analyzingContainer}>
          <View style={styles.analyzingSpinner}>
            <ActivityIndicator size="large" color="#10b981" />
          </View>
          <Text style={styles.analyzingTitle}>Analyzing...</Text>
          <Text style={styles.analyzingSubtitle}>
            AI is identifying your foods
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Results View
  if (detectedFoods.length > 0) {
    const totalScore = detectedFoods.reduce(
      (sum, f) => sum + f.score,
      0
    );

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.resultsScroll}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Detected Foods</Text>
            <View style={styles.totalScoreBadge}>
              <Text style={styles.totalScoreText}>+{totalScore}</Text>
            </View>
          </View>

          {detectedFoods.map((food) => (
            <View key={food.id} style={styles.foodCard}>
              <View style={styles.foodHeader}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  {food.brand && (
                    <Text style={styles.foodBrand}>{food.brand}</Text>
                  )}
                  <Text style={styles.foodPortion}>
                    {food.portionSize || food.servingSize}
                  </Text>
                </View>
                <View style={styles.foodScoreContainer}>
                  <View
                    style={[
                      styles.foodScoreBadge,
                      {
                        backgroundColor: food.score >= 2 ? '#d1fae5' : '#dbeafe',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.foodScoreText,
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
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>

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
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Main Camera View
  return (
    <View style={styles.cameraContainer}>
      <View style={styles.cameraPlaceholder}>
        <View style={styles.cameraPlaceholderContent}>
          <Ionicons name="camera" size={64} color="#9ca3af" />
          <Text style={styles.cameraPlaceholderText}>Camera Preview</Text>
        </View>
      </View>

      {/* Overlay UI */}
      <View style={styles.mainOverlay}>
        <SafeAreaView style={styles.overlayContent}>
          {/* Top hint */}
          <View style={styles.topHint}>
            <Text style={styles.topHintText}>Point at your meal</Text>
          </View>

          {/* Center scan button */}
          <View style={styles.centerSection}>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleScan}
              activeOpacity={0.8}
            >
              <Ionicons name="scan" size={32} color="white" />
              <Text style={styles.scanButtonText}>SCAN</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom method buttons */}
          <View style={styles.bottomSection}>
            <View style={styles.methodButtons}>
              <TouchableOpacity
                style={styles.methodButton}
                onPress={handleBarcodePress}
              >
                <Ionicons name="barcode-outline" size={20} color="#1f2937" />
                <Text style={styles.methodButtonText}>Barcode</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.methodButton}
                onPress={handleTypePress}
              >
                <Ionicons name="create-outline" size={20} color="#1f2937" />
                <Text style={styles.methodButtonText}>Type</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.methodButton}
                onPress={handleBatchPress}
              >
                <Ionicons name="grid-outline" size={20} color="#1f2937" />
                <Text style={styles.methodButtonText}>Batch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholderContent: {
    alignItems: 'center',
    gap: 12,
  },
  cameraPlaceholderText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  mainOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topHint: {
    alignItems: 'center',
    paddingTop: 60,
  },
  topHintText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  centerSection: {
    alignItems: 'center',
  },
  scanButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  bottomSection: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  methodButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  methodButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  // Camera Overlay for Barcode
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
  // Type Input Styles
  typeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  typeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  typeContent: {
    flex: 1,
    padding: 20,
  },
  typeLabel: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 12,
  },
  typeInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    color: '#1f2937',
  },
  typeSubmit: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  typeSubmitDisabled: {
    backgroundColor: '#d1d5db',
  },
  typeSubmitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Analyzing Styles
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
  // Results Styles
  resultsScroll: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  resultsTitle: {
    fontSize: 22,
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
    marginHorizontal: 20,
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
  batchItems: {
    marginTop: 12,
    gap: 8,
  },
  batchItem: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  batchItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  batchItemPortion: {
    fontSize: 13,
    color: '#6b7280',
  },
  resultsActions: {
    flexDirection: 'row',
    padding: 20,
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

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { BarcodeScanningResult } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Rect } from 'react-native-svg';

// Custom Barcode Icon Component
const BarcodeIcon = ({ size = 20, color = 'white' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Rect x="3" y="5" width="2" height="14" fill={color} stroke="none" />
    <Rect x="7" y="5" width="1" height="14" fill={color} stroke="none" />
    <Rect x="10" y="5" width="2" height="14" fill={color} stroke="none" />
    <Rect x="14" y="5" width="1" height="14" fill={color} stroke="none" />
    <Rect x="17" y="5" width="3" height="14" fill={color} stroke="none" />
  </Svg>
);

type InputMethod = 'photo' | 'barcode' | 'manual' | 'batch' | null;

interface DetectedFood {
  id: number;
  name: string;
  portionSize?: string;
  servingSize?: string;
  brand?: string;
  upc?: string;
  score: number;
  totalScore?: number;
  items?: { name: string; portion: string; score: number }[];
  warnings: string[];
}

export default function LogScreen() {
  const [inputMethod, setInputMethod] = useState<InputMethod>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [showCamera, setShowCamera] = useState(true);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(cameraStatus === 'granted');
    })();
  }, []);

  const handleScanPress = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Camera permission is needed to scan meals.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setInputMethod('photo');
      simulatePhotoAnalysis();
    }
  };

  const handleBarcodePress = () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Camera permission is needed to scan barcodes.');
      return;
    }
    setInputMethod('barcode');
    setCameraActive(true);
    setShowCamera(false);
  };

  const handleTypePress = () => {
    Alert.alert('Manual Entry', 'Type what you ate and we\'ll find it in our database.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => simulateManualEntry() },
    ]);
  };

  const handleBatchPress = () => {
    setInputMethod('batch');
    simulateBatchAnalysis();
  };

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setCameraActive(false);
    setShowCamera(true);
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
          score: 0,
          totalScore: 4,
          items: [
            { name: 'Grilled Chicken', portion: '6 oz', score: 1 },
            { name: 'Sweet Potato', portion: '1 cup', score: 1 },
            { name: 'Asparagus', portion: '1 cup', score: 2 },
          ],
          warnings: [],
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

  const simulateManualEntry = () => {
    setInputMethod('manual');
    setAnalyzing(true);
    setTimeout(() => {
      setDetectedFoods([
        {
          id: Date.now(),
          name: 'Mixed Green Salad',
          portionSize: '2 cups',
          score: 2,
          warnings: [],
        },
      ]);
      setAnalyzing(false);
    }, 1000);
  };

  const saveMeal = () => {
    const totalScore = detectedFoods.reduce((sum, food) => {
      if (food.items) return sum + (food.totalScore || 0);
      return sum + food.score;
    }, 0);

    Alert.alert(
      'Meal Saved!',
      `Score: +${totalScore}. Great job supporting your ENS!`,
      [{ text: 'OK', onPress: reset }]
    );
  };

  const removeFood = (foodId: number) => {
    setDetectedFoods(detectedFoods.filter((f) => f.id !== foodId));
  };

  const reset = () => {
    setInputMethod(null);
    setDetectedFoods([]);
    setCameraActive(false);
    setShowCamera(true);
  };

  // Barcode Scanner View
  if (cameraActive && hasPermission) {
    return (
      <View style={styles.fullScreen}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['upc_a', 'upc_e', 'ean8', 'ean13', 'code128', 'code39'],
          }}
        >
          <SafeAreaView style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={reset}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Scan Barcode</Text>
              <View style={{ width: 44 }} />
            </View>
            <View style={styles.scanArea}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              <Text style={styles.scanText}>Position barcode in frame</Text>
            </View>
          </SafeAreaView>
        </CameraView>
      </View>
    );
  }

  // Results View
  if (!analyzing && detectedFoods.length > 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultsHeader}>
          <TouchableOpacity onPress={reset}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.resultsTitle}>Review Meal</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView style={styles.resultsScroll}>
          {detectedFoods.map((food) => (
            <View key={food.id} style={styles.foodCard}>
              <View style={styles.foodHeader}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  {food.brand && <Text style={styles.foodBrand}>{food.brand}</Text>}
                  {food.portionSize && (
                    <Text style={styles.foodPortion}>{food.portionSize}</Text>
                  )}
                  {food.servingSize && (
                    <Text style={styles.foodPortion}>{food.servingSize}</Text>
                  )}
                </View>
                <View style={styles.foodActions}>
                  <View
                    style={[
                      styles.scoreBadge,
                      { backgroundColor: food.score >= 2 ? '#d1fae5' : '#dbeafe' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.scoreBadgeText,
                        { color: food.score >= 2 ? '#047857' : '#1e40af' },
                      ]}
                    >
                      +{food.totalScore || food.score}
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
              {food.items && (
                <View style={styles.batchItems}>
                  {food.items.map((item, idx) => (
                    <View key={idx} style={styles.batchItem}>
                      <Text style={styles.batchItemName}>{item.name}</Text>
                      <Text style={styles.batchItemPortion}>({item.portion})</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Meal Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Score</Text>
              <Text style={styles.summaryValue}>
                +{detectedFoods.reduce((sum, f) => sum + (f.totalScore || f.score), 0)}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.resultsActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={reset}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={saveMeal}>
            <Ionicons name="checkmark" size={20} color="white" />
            <Text style={styles.saveButtonText}>Save Meal</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Analyzing View
  if (analyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.analyzingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.analyzingTitle}>
            {inputMethod === 'photo' && 'Analyzing Your Photo...'}
            {inputMethod === 'batch' && 'Scanning Multiple Meals...'}
            {inputMethod === 'barcode' && 'Looking Up Product...'}
            {inputMethod === 'manual' && 'Finding Food...'}
          </Text>
          <Text style={styles.analyzingSubtitle}>AI is working its magic</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Main Camera View (default)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraPlaceholder}>
        {hasPermission ? (
          <>
            <View style={styles.cameraPreview}>
              <Ionicons name="camera" size={64} color="#9ca3af" />
              <Text style={styles.previewText}>Ready to scan your meal</Text>
            </View>
          </>
        ) : (
          <View style={styles.permissionRequest}>
            <Ionicons name="camera-outline" size={48} color="#9ca3af" />
            <Text style={styles.permissionText}>Camera access needed</Text>
          </View>
        )}
      </View>

      {/* Big Scan Button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleScanPress}
        activeOpacity={0.8}
      >
        <Ionicons name="scan" size={32} color="white" />
        <Text style={styles.scanButtonText}>Scan Meal</Text>
      </TouchableOpacity>

      {/* Method Buttons */}
      <View style={styles.methodButtons}>
        <TouchableOpacity style={styles.methodButton} onPress={handleBarcodePress}>
          <BarcodeIcon size={20} color="#1f2937" />
          <Text style={styles.methodButtonText}>Barcode</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.methodButton} onPress={handleTypePress}>
          <Ionicons name="create-outline" size={20} color="#1f2937" />
          <Text style={styles.methodButtonText}>Type</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.methodButton} onPress={handleBatchPress}>
          <Ionicons name="layers-outline" size={20} color="#1f2937" />
          <Text style={styles.methodButtonText}>Batch</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  fullScreen: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f2937',
  },
  cameraPreview: {
    alignItems: 'center',
    gap: 16,
  },
  previewText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  permissionRequest: {
    alignItems: 'center',
    gap: 12,
  },
  permissionText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  scanButton: {
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    gap: 12,
    elevation: 6,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  methodButtons: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  methodButton: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  closeButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 180,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#10b981',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  analyzingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  analyzingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  resultsScroll: {
    flex: 1,
    padding: 16,
  },
  foodCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  foodActions: {
    alignItems: 'flex-end',
    gap: 12,
  },
  scoreBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  scoreBadgeText: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
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
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10b981',
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  resultsActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

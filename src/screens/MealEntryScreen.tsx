import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { BarcodeScanningResult } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const { height } = Dimensions.get('window');

export default function MealEntryScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [triggerDetected, setTriggerDetected] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [detectedProduct, setDetectedProduct] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(cameraStatus === 'granted');
    })();
  }, []);

  const handleCapture = async () => {
    // Simulate photo capture and analysis
    setScanning(true);

    setTimeout(() => {
      setScanning(false);
      // Simulate trigger detection for demo
      setTriggerDetected(true);
      setDetectedProduct({
        name: 'Pacific Foods Bone Broth',
        trigger: 'YEAST EXTRACT',
        dateMarked: '11/15/24',
        reaction: 'Headache within 2 hours',
      });
    }, 2000);
  };

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanning(true);

    setTimeout(() => {
      setScanning(false);
      // Simulate finding a trigger ingredient
      setTriggerDetected(true);
      setDetectedProduct({
        name: 'Pacific Foods Bone Broth',
        trigger: 'YEAST EXTRACT',
        dateMarked: '11/15/24',
        reaction: 'Headache within 2 hours',
      });
    }, 1500);
  };

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleCapture();
    }
  };

  const dismissTrigger = () => {
    setTriggerDetected(false);
    setDetectedProduct(null);
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.noPermissionContainer}>
        <Ionicons name="camera-outline" size={64} color="#9ca3af" />
        <Text style={styles.noPermissionTitle}>Camera Access Required</Text>
        <Text style={styles.noPermissionText}>
          Please enable camera access in your device settings to use this feature.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={!scanning && !triggerDetected ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ['upc_a', 'upc_e', 'ean8', 'ean13', 'code128', 'code39'],
        }}
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={styles.cameraContent}>
          {/* Camera Instructions */}
          {!scanning && !triggerDetected && (
            <View style={styles.instructionContainer}>
              <View style={styles.viewfinderFrame}>
                <Ionicons name="camera" size={64} color="white" />
              </View>
              <Text style={styles.instructionTitle}>Point at your meal</Text>
              <Text style={styles.instructionSubtitle}>Center food in frame</Text>
            </View>
          )}

          {/* Scanning State */}
          {scanning && (
            <View style={styles.scanningContainer}>
              <View style={styles.scanningFrame}>
                <Ionicons name="camera" size={64} color="#3b82f6" />
              </View>
              <Text style={styles.scanningTitle}>Scanning...</Text>
              <View style={styles.scanningDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
          )}

          {/* Trigger Detected Alert */}
          {triggerDetected && detectedProduct && (
            <View style={styles.triggerAlert}>
              <View style={styles.triggerHeader}>
                <View style={styles.triggerIconContainer}>
                  <Ionicons name="alert-circle" size={28} color="white" />
                </View>
                <View style={styles.triggerHeaderText}>
                  <Text style={styles.triggerTitle}>TRIGGER DETECTED</Text>
                  <Text style={styles.triggerProduct}>{detectedProduct.name}</Text>
                </View>
              </View>

              <View style={styles.triggerDetails}>
                <Text style={styles.triggerIngredient}>🔴 {detectedProduct.trigger}</Text>
                <Text style={styles.triggerDate}>
                  You marked this RED on {detectedProduct.dateMarked}
                </Text>
                <Text style={styles.triggerReaction}>
                  Last reaction: {detectedProduct.reaction}
                </Text>
              </View>

              <TouchableOpacity style={styles.avoidButton} onPress={dismissTrigger}>
                <Text style={styles.avoidButtonText}>Avoid This Product</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.alternativesButton} onPress={dismissTrigger}>
                <Text style={styles.alternativesButtonText}>See Safe Alternatives →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={goBack}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Bottom Controls */}
      {!triggerDetected && (
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleTakePhoto}
            disabled={scanning}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <View style={styles.methodButtons}>
            <TouchableOpacity style={styles.methodButton}>
              <Ionicons name="barcode-outline" size={18} color="white" />
              <Text style={styles.methodButtonText}>Barcode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.methodButton}>
              <Ionicons name="create-outline" size={18} color="white" />
              <Text style={styles.methodButtonText}>Type</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.methodButton}>
              <Ionicons name="cube-outline" size={18} color="white" />
              <Text style={styles.methodButtonText}>Batch</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  noPermissionContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  noPermissionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noPermissionText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  cameraContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Instructions
  instructionContainer: {
    alignItems: 'center',
    gap: 16,
  },
  viewfinderFrame: {
    width: 128,
    height: 128,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  instructionSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
  },
  // Scanning
  scanningContainer: {
    alignItems: 'center',
    gap: 16,
  },
  scanningFrame: {
    width: 128,
    height: 128,
    borderWidth: 4,
    borderColor: '#3b82f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  scanningDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  dot1: {
    opacity: 1,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 0.4,
  },
  // Trigger Alert
  triggerAlert: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  triggerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  triggerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerHeaderText: {
    flex: 1,
  },
  triggerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  triggerProduct: {
    fontSize: 14,
    color: '#6b7280',
  },
  triggerDetails: {
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  triggerIngredient: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991b1b',
    marginBottom: 4,
  },
  triggerDate: {
    fontSize: 14,
    color: '#b91c1c',
    marginBottom: 8,
  },
  triggerReaction: {
    fontSize: 13,
    color: '#dc2626',
  },
  avoidButton: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  avoidButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alternativesButton: {
    padding: 8,
    alignItems: 'center',
  },
  alternativesButtonText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '600',
  },
  // Close Button
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Bottom Controls
  bottomControls: {
    backgroundColor: '#111827',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: 'white',
  },
  methodButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  methodButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GradientSettings {
  spatial: 'left' | 'right';  // Examples vs Principles
  reference: 'left' | 'right'; // Individual vs Group
  temporal: 'left' | 'right';  // Past vs Future
}

export default function ReaderScreen() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [filesModalVisible, setFilesModalVisible] = useState(false);
  const [assessmentModalVisible, setAssessmentModalVisible] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [gradientSettings, setGradientSettings] = useState<GradientSettings>({
    spatial: 'left',
    reference: 'left',
    temporal: 'left',
  });

  const [currentDocument, setCurrentDocument] = useState({
    title: 'Cognition Blocks of Intelligence - Chapter 13',
    content: `Pattern Recognition emerges as humanity's first integration above raw spacetime parsing. While the foundation blocks—WHERE, WHEN, HOW—represent mandatory systems for consciousness itself, Pattern Recognition marks the transition from simply existing in spacetime to discovering the rules spacetime follows.

Consider the ancient astronomer tracking celestial bodies. Their WHERE system maps stellar positions, their WHEN system tracks temporal cycles, their HOW system discriminates between stars and planets. But Pattern Recognition synthesizes these streams into predictive models—eclipses, seasons, navigation.

This integration happens at multiple temporal scales simultaneously. A radiologist detecting cancer operates at millisecond visual processing while accessing years of stored patterns. A jazz musician recognizes harmonic progressions in real-time while projecting future possibilities. The integration isn't choosing one temporal window—it's orchestrating across all of them.

The neuroscience reveals something profound: Pattern Recognition doesn't live in a single brain region. Instead, it emerges from the coordination of multiple networks, each operating at different temporal scales. The visual system extracts features in 20-50ms windows. The hippocampus binds these features into episodes over 200-500ms. The prefrontal cortex maintains patterns across seconds to minutes. The default mode network integrates across hours, days, years.

What we call "intuition" often reflects Pattern Recognition operating below conscious threshold. The chess master who "feels" the right move without calculating, the parent who senses their child's illness before symptoms manifest, the investor who exits before the crash—all demonstrate pattern detection faster than conscious analysis.

But here's where individual differences become fascinating. Some people excel at rapid pattern detection—seeing the gestalt instantly but struggling to explain why. Others build patterns methodically, constructing understanding piece by piece. Neither is superior; they represent different positions on the temporal processing gradient.`,
  });

  const [savedFiles] = useState([
    { id: 1, name: 'Chapter_1_Foundation.pdf', type: 'pdf' },
    { id: 2, name: 'Research_Notes.txt', type: 'txt' },
  ]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const toggleGradient = (type: keyof GradientSettings, value: 'left' | 'right') => {
    setGradientSettings(prev => ({ ...prev, [type]: value }));
  };

  const calculateReadingTime = () => {
    const words = currentDocument.content.trim().split(/\s+/).length;
    const wpm = 225;
    return Math.ceil(words / wpm);
  };

  const savePastedText = () => {
    if (!pastedText.trim()) {
      showToast('Please paste some text first', 'error');
      return;
    }

    setCurrentDocument({
      title: `Pasted Text - ${new Date().toLocaleDateString()}`,
      content: pastedText,
    });
    setPastedText('');
    setFilesModalVisible(false);
    showToast('Text saved successfully');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📕';
      case 'epub': return '📗';
      case 'docx': return '📘';
      default: return '📄';
    }
  };

  const ToggleSlider = ({
    label,
    leftLabel,
    rightLabel,
    value,
    onChange
  }: {
    label: string;
    leftLabel: string;
    rightLabel: string;
    value: 'left' | 'right';
    onChange: (value: 'left' | 'right') => void;
  }) => (
    <View style={styles.toggleGroup}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={styles.toggleSlider}>
        <TouchableOpacity
          style={[styles.toggleOption, value === 'left' && styles.toggleOptionActive]}
          onPress={() => onChange('left')}
        >
          <Text style={[
            styles.toggleOptionText,
            value === 'left' && styles.toggleOptionTextActive
          ]}>
            {leftLabel}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleOption, value === 'right' && styles.toggleOptionActive]}
          onPress={() => onChange('right')}
        >
          <Text style={[
            styles.toggleOptionText,
            value === 'right' && styles.toggleOptionTextActive
          ]}>
            {rightLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Sidebar */}
        <View style={[styles.sidebar, sidebarExpanded && styles.sidebarExpanded]}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarIcon}>📚</Text>
              <TouchableOpacity
                style={styles.sidebarToggle}
                onPress={() => setSidebarExpanded(!sidebarExpanded)}
              >
                <Ionicons
                  name={sidebarExpanded ? 'chevron-back' : 'chevron-forward'}
                  size={20}
                  color="#1a1a1a"
                />
              </TouchableOpacity>
            </View>

            {sidebarExpanded && (
              <>
                <View style={styles.readingTime}>
                  <Text style={styles.sidebarIcon}>⏱</Text>
                  <Text style={styles.readingTimeValue}>{calculateReadingTime()}m</Text>
                </View>
                <View style={styles.readerType}>
                  <Text style={styles.readerTypeLabel}>Reader Type</Text>
                  <Text style={styles.readerTypeValue}>Pattern Detector</Text>
                </View>
              </>
            )}
          </View>

          {/* Navigation */}
          <View style={styles.sidebarSection}>
            <TouchableOpacity style={[styles.sidebarItem, styles.sidebarItemActive]}>
              <Text style={styles.sidebarIcon}>📖</Text>
              {sidebarExpanded && <Text style={styles.sidebarLabel}>Current Book</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sidebarItem}
              onPress={() => setFilesModalVisible(true)}
            >
              <Text style={styles.sidebarIcon}>📁</Text>
              {sidebarExpanded && <Text style={styles.sidebarLabel}>Files</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sidebarItem}
              onPress={() => setAssessmentModalVisible(true)}
            >
              <Text style={styles.sidebarIcon}>🧬</Text>
              {sidebarExpanded && <Text style={styles.sidebarLabel}>Assessment</Text>}
            </TouchableOpacity>
          </View>

          {/* Gradient Settings */}
          {sidebarExpanded && (
            <ScrollView style={styles.settingsToggles}>
              <ToggleSlider
                label="Information Style"
                leftLabel="Examples"
                rightLabel="Principles"
                value={gradientSettings.spatial}
                onChange={(value) => toggleGradient('spatial', value)}
              />
              <ToggleSlider
                label="Focus"
                leftLabel="Individual"
                rightLabel="Group"
                value={gradientSettings.reference}
                onChange={(value) => toggleGradient('reference', value)}
              />
              <ToggleSlider
                label="Time Orientation"
                leftLabel="Past"
                rightLabel="Future"
                value={gradientSettings.temporal}
                onChange={(value) => toggleGradient('temporal', value)}
              />
            </ScrollView>
          )}
        </View>

        {/* Reader Content */}
        <View style={styles.readerContainer}>
          <View style={styles.readerHeader}>
            <Text style={styles.documentTitle} numberOfLines={1}>
              {currentDocument.title}
            </Text>
            <View style={styles.readerControls}>
              <TouchableOpacity style={styles.controlBtn}>
                <Text>Aa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn}>
                <Ionicons name="eye-outline" size={20} color="#1a1a1a" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn}>
                <Ionicons name="bookmark-outline" size={20} color="#1a1a1a" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn}>
                <Ionicons name="search-outline" size={20} color="#1a1a1a" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.readerContent}>
            <View style={styles.readerInner}>
              {currentDocument.content.split('\n\n').map((paragraph, index) => (
                <Text key={index} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Files Modal */}
      <Modal
        visible={filesModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Files</Text>
              <TouchableOpacity onPress={() => setFilesModalVisible(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.pasteContainer}>
                <TextInput
                  style={styles.pasteArea}
                  placeholder="Paste text here..."
                  multiline
                  value={pastedText}
                  onChangeText={setPastedText}
                />
                <TouchableOpacity
                  style={styles.saveTextBtn}
                  onPress={savePastedText}
                >
                  <Text style={styles.saveTextBtnText}>Save Text</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.fileList}>
                <Text style={styles.fileListTitle}>Saved Files</Text>
                {savedFiles.map((file) => (
                  <View key={file.id} style={styles.fileItem}>
                    <Text style={styles.fileName}>
                      {getFileIcon(file.type)} {file.name}
                    </Text>
                    <View style={styles.fileActions}>
                      <TouchableOpacity style={styles.fileAction}>
                        <Text style={styles.fileActionText}>Open</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.fileAction}>
                        <Text style={styles.fileActionText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Assessment Modal */}
      <Modal
        visible={assessmentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAssessmentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cognitive Assessment</Text>
              <TouchableOpacity onPress={() => setAssessmentModalVisible(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.assessmentBody}>
              <Text style={styles.assessmentIcon}>🧬</Text>
              <Text style={styles.assessmentTitle}>Discover Your Reading Style</Text>
              <Text style={styles.assessmentSubtitle}>
                Three simple questions to optimize your reading experience
              </Text>
              <TouchableOpacity style={styles.startAssessmentBtn}>
                <Text style={styles.startAssessmentBtnText}>Start Assessment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toast Notification */}
      {toastVisible && (
        <View style={[
          styles.toast,
          toastType === 'success' ? styles.toastSuccess : styles.toastError
        ]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f4f0',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 60,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e0ddd9',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  sidebarExpanded: {
    width: 280,
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#e0ddd9',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sidebarToggle: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#e0ddd9',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarIcon: {
    fontSize: 24,
  },
  readingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  readingTimeValue: {
    fontSize: 28,
    fontWeight: '300',
    marginLeft: 12,
  },
  readerType: {
    padding: 10,
    backgroundColor: '#f7f4f0',
    borderRadius: 6,
  },
  readerTypeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  readerTypeValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4ecdc4',
  },
  sidebarSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0ddd9',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  sidebarItemActive: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
  },
  sidebarLabel: {
    fontSize: 15,
    marginLeft: 12,
  },
  settingsToggles: {
    padding: 20,
    maxHeight: 400,
  },
  toggleGroup: {
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  toggleSlider: {
    flexDirection: 'row',
    backgroundColor: '#f7f4f0',
    borderRadius: 20,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    padding: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  toggleOptionActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleOptionText: {
    fontSize: 13,
    color: '#666',
  },
  toggleOptionTextActive: {
    color: '#1a1a1a',
    fontWeight: '500',
  },
  readerContainer: {
    flex: 1,
  },
  readerHeader: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0ddd9',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
    marginRight: 10,
  },
  readerControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#e0ddd9',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readerContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  readerInner: {
    maxWidth: 700,
    alignSelf: 'center',
    padding: 40,
    width: '100%',
  },
  paragraph: {
    fontSize: 17,
    lineHeight: 30,
    marginBottom: 20,
    textAlign: 'justify',
    color: '#1a1a1a',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 10,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0ddd9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '400',
  },
  modalBody: {
    padding: 20,
    maxHeight: 500,
  },
  pasteContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  pasteArea: {
    minHeight: 150,
    padding: 15,
    paddingBottom: 50,
    borderWidth: 1,
    borderColor: '#e0ddd9',
    borderRadius: 8,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  saveTextBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#4ecdc4',
    borderRadius: 6,
  },
  saveTextBtnText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  fileList: {
    marginTop: 20,
  },
  fileListTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f7f4f0',
    borderRadius: 6,
    marginBottom: 8,
  },
  fileName: {
    fontSize: 15,
    flex: 1,
  },
  fileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  fileAction: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0ddd9',
    borderRadius: 4,
  },
  fileActionText: {
    fontSize: 13,
  },
  assessmentBody: {
    padding: 40,
    alignItems: 'center',
  },
  assessmentIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  assessmentTitle: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  assessmentSubtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  startAssessmentBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#4ecdc4',
    borderRadius: 6,
  },
  startAssessmentBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '500',
  },
  toast: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  toastSuccess: {
    backgroundColor: '#2e7d32',
  },
  toastError: {
    backgroundColor: '#ff6b6b',
  },
  toastText: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
  },
});

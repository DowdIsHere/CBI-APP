import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '../data/AppContext';
import { SymptomType } from '../data/types';

interface SymptomMeta {
  type: SymptomType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  // What the 1-5 scale means for this symptom — directional matters because
  // "energy: 5" is great, while "pain: 5" is bad.
  scaleHint: string;
}

const SYMPTOM_TYPES: SymptomMeta[] = [
  { type: 'energy',    label: 'Energy',     icon: 'flash',          color: '#f59e0b', scaleHint: '1 drained · 5 energized' },
  { type: 'mood',      label: 'Mood',       icon: 'happy',          color: '#10b981', scaleHint: '1 low · 5 great' },
  { type: 'pain',      label: 'Pain',       icon: 'flame',          color: '#ef4444', scaleHint: '1 none · 5 severe' },
  { type: 'bloating',  label: 'Bloating',   icon: 'ellipse',        color: '#8b5cf6', scaleHint: '1 none · 5 severe' },
  { type: 'stool',     label: 'Stool',      icon: 'water',          color: '#0ea5e9', scaleHint: '1 normal · 5 trouble' },
  { type: 'sleep',     label: 'Sleep',      icon: 'moon',           color: '#6366f1', scaleHint: '1 poor · 5 restorative' },
  { type: 'brain_fog', label: 'Brain fog',  icon: 'cloud',          color: '#94a3b8', scaleHint: '1 clear · 5 foggy' },
];

const SYMPTOM_LABEL: Record<SymptomType, string> = SYMPTOM_TYPES.reduce(
  (acc, s) => ({ ...acc, [s.type]: s.label }),
  {} as Record<SymptomType, string>,
);

function nowParts() {
  const d = new Date();
  return {
    date: d.toISOString().split('T')[0],
    time: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
  };
}

export default function SymptomScreen({ navigation }: any) {
  const { addSymptom, deleteSymptom, getRecentSymptoms, getFoodSymptomCorrelations } = useAppData();

  const [selectedType, setSelectedType] = useState<SymptomType | null>(null);
  const [severity, setSeverity] = useState<number>(3);
  const [notes, setNotes] = useState('');

  const recent = useMemo(() => getRecentSymptoms(7).slice(0, 25), [getRecentSymptoms]);
  const correlations = useMemo(() => getFoodSymptomCorrelations(5), [getFoodSymptomCorrelations]);

  const handleSave = () => {
    if (!selectedType) {
      Alert.alert('Pick a symptom', 'Choose what you want to log first.');
      return;
    }
    const { date, time } = nowParts();
    addSymptom({
      date,
      time,
      type: selectedType,
      severity,
      notes: notes.trim() || undefined,
    });
    setSelectedType(null);
    setSeverity(3);
    setNotes('');
    Alert.alert('Logged', 'Symptom saved.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>How are you feeling?</Text>
          <Text style={styles.headerSubtitle}>
            Logging symptoms helps us spot patterns with the food you eat.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Symptom</Text>
          <View style={styles.grid}>
            {SYMPTOM_TYPES.map((s) => {
              const active = selectedType === s.type;
              return (
                <TouchableOpacity
                  key={s.type}
                  style={[styles.tile, active && { borderColor: s.color, backgroundColor: '#fff' }]}
                  onPress={() => setSelectedType(s.type)}
                >
                  <View style={[styles.tileIcon, { backgroundColor: s.color }]}>
                    <Ionicons name={s.icon} size={20} color="white" />
                  </View>
                  <Text style={styles.tileLabel}>{s.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {selectedType && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Severity</Text>
              <Text style={styles.scaleHint}>
                {SYMPTOM_TYPES.find((s) => s.type === selectedType)?.scaleHint}
              </Text>
              <View style={styles.severityRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={[styles.severityDot, severity === n && styles.severityDotActive]}
                    onPress={() => setSeverity(n)}
                  >
                    <Text
                      style={[
                        styles.severityNumber,
                        severity === n && styles.severityNumberActive,
                      ]}
                    >
                      {n}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Notes (optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="e.g. flared up after lunch"
                placeholderTextColor="#9ca3af"
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </>
        )}

        {correlations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Patterns we're spotting</Text>
            <Text style={styles.scaleHint}>
              Foods that have shown up together with adverse symptoms within 24 hours.
            </Text>
            {correlations.map((c) => (
              <View
                key={`${c.food}-${c.symptom}`}
                style={styles.correlationRow}
              >
                <View style={styles.correlationDot} />
                <Text style={styles.correlationText}>
                  <Text style={styles.correlationFood}>{c.food}</Text>
                  {' → '}
                  <Text style={styles.correlationSymptom}>{SYMPTOM_LABEL[c.symptom]}</Text>
                  {`  ·  ${c.occurrences}×`}
                </Text>
              </View>
            ))}
            <Text style={styles.correlationDisclaimer}>
              Correlation, not causation. Use this as a starting point with your clinician.
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Last 7 days</Text>
          {recent.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="pulse-outline" size={32} color="#9ca3af" />
              <Text style={styles.emptyText}>No symptoms logged yet.</Text>
            </View>
          ) : (
            recent.map((entry) => {
              const meta = SYMPTOM_TYPES.find((s) => s.type === entry.type);
              return (
                <View key={entry.id} style={styles.entryRow}>
                  <View style={[styles.entryIcon, { backgroundColor: meta?.color ?? '#9ca3af' }]}>
                    <Ionicons name={meta?.icon ?? 'pulse'} size={16} color="white" />
                  </View>
                  <View style={styles.entryInfo}>
                    <Text style={styles.entryTitle}>
                      {meta?.label ?? entry.type} · {entry.severity}/5
                    </Text>
                    <Text style={styles.entryMeta}>
                      {entry.date} · {entry.time}
                      {entry.notes ? ` · ${entry.notes}` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert('Delete entry?', '', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => deleteSymptom(entry.id) },
                      ])
                    }
                  >
                    <Ionicons name="trash-outline" size={18} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  backBtn: { padding: 4, marginBottom: 8, alignSelf: 'flex-start' },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: '#bfdbfe', fontSize: 13, marginTop: 4, lineHeight: 18 },
  section: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 8 },
  scaleHint: { fontSize: 12, color: '#6b7280', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: {
    flexBasis: '30%',
    flexGrow: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  tileLabel: { fontSize: 12, fontWeight: '600', color: '#1f2937' },
  severityRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  severityDot: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  severityDotActive: { backgroundColor: '#1e3a8a' },
  severityNumber: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  severityNumberActive: { color: 'white' },
  notesInput: {
    minHeight: 60,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10b981',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  correlationRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 8 },
  correlationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b' },
  correlationText: { flex: 1, fontSize: 14, color: '#1f2937' },
  correlationFood: { fontWeight: '600' },
  correlationSymptom: { color: '#ef4444', fontWeight: '600' },
  correlationDisclaimer: { fontSize: 11, color: '#6b7280', marginTop: 8, fontStyle: 'italic' },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  entryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryInfo: { flex: 1 },
  entryTitle: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  entryMeta: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  emptyState: { alignItems: 'center', padding: 16, gap: 8 },
  emptyText: { fontSize: 13, color: '#9ca3af' },
});

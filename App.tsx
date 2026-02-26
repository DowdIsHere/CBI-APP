import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// TEMPORARY TEST - Remove this after testing
export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e3a8a' }}>
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Mido App</Text>
      <Text style={{ color: '#fff', marginTop: 10 }}>If you see this, the app loads!</Text>
      <StatusBar style="light" />
    </View>
  );
}

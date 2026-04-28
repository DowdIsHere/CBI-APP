import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import App from './App';

// On web, force the html/body/#root chain to a real height so that screens
// using flex: 1 (SafeAreaView + ScrollView) can constrain their height and
// scroll overflow. Without this, ScrollView grows with its content and never
// engages on react-native-web.
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.setAttribute('data-mido-root', '');
  style.textContent = `
    html, body, #root { height: 100%; margin: 0; padding: 0; }
    body { overscroll-behavior-y: none; }
    #root { display: flex; flex-direction: column; min-height: 100%; }
  `;
  document.head.appendChild(style);
}

registerRootComponent(App);

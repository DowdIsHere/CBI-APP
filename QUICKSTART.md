# CBI App - Quick Start Guide

## Test the App Right Now (Fastest Method)

### Option 1: Use Expo Go on Your Phone (Recommended)

1. **Install Expo Go**
   - iOS: Download from the App Store
   - Android: Download from Google Play Store

2. **Start the Development Server**
   ```bash
   cd C:\ATP\CBI-App
   npm start
   ```

3. **Scan the QR Code**
   - iOS: Use the Camera app to scan the QR code
   - Android: Use the Expo Go app to scan the QR code

4. **The app will load on your device!** 📱

### Option 2: Run on Web Browser (Quick Preview)

```bash
cd C:\ATP\CBI-App
npm run web
```

The app will open in your default browser at `http://localhost:8081`

Note: Camera features won't work in web browser, but you can see the UI.

## First Time Setup Issues?

If you encounter issues:

1. **Make sure you're on the same WiFi** - Your computer and phone must be on the same network

2. **Try tunnel mode** if QR code doesn't work:
   ```bash
   npm start -- --tunnel
   ```

3. **Check Node.js version**:
   ```bash
   node --version
   ```
   Should be v16 or higher

## What You Can Test

### ✅ Works Right Now:
- ✓ Full navigation between all 5 screens
- ✓ Dashboard with stats and insights
- ✓ Meal entry with multiple input methods
- ✓ Camera interface for photos
- ✓ Barcode scanner interface
- ✓ Progress tracking with charts
- ✓ Education content
- ✓ Profile management

### 🔄 Simulated (Not Connected to Backend):
- Photo food recognition (shows demo data)
- Barcode lookup (shows demo products)
- User data persistence (resets on app restart)

## Building APK/IPA for Real Devices

### For Android APK:

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure the build**:
   ```bash
   eas build:configure
   ```

4. **Build the APK**:
   ```bash
   eas build --platform android --profile preview
   ```

5. **Download and install** the APK on your Android device

### For iOS (Requires macOS):

1. **Install EAS CLI** (if not already done)
2. **Build for iOS**:
   ```bash
   eas build --platform ios --profile preview
   ```

3. **Install via TestFlight** or direct installation

## Common Commands

```bash
# Start development server
npm start

# Start with cache cleared
npm start --clear

# Run on Android emulator
npm run android

# Run on iOS simulator (macOS only)
npm run ios

# Run in web browser
npm run web

# Install new packages
npm install

# Check for issues
npm run lint
```

## Keyboard Shortcuts (During Development)

- **Press 'r'** - Reload app
- **Press 'a'** - Open on Android emulator
- **Press 'i'** - Open on iOS simulator
- **Press 'w'** - Open in web browser
- **Press 'c'** - Clear Metro bundler cache

## Testing Camera Features

Camera and barcode scanning will only work:
- ✓ On a physical device (via Expo Go)
- ✓ In a production build (APK/IPA)
- ✗ NOT in iOS Simulator
- ✗ NOT in Android Emulator
- ✗ NOT in web browser

## Project Location

Your app is located at:
```
C:\ATP\CBI-App
```

Original components from:
```
C:\ATP
```

## Next Steps

1. **Test on your device** using Expo Go
2. **Try all features** - navigation, camera, scanning
3. **Build production APK** when ready to distribute
4. **Add backend integration** for real food recognition
5. **Customize branding** in `app.json` and assets folder

## Need Help?

Check the full README.md for detailed information:
```
C:\ATP\CBI-App\README.md
```

## App Features Summary

### 🏠 Home Screen
- Today's score and stats
- Quick meal logging actions
- Recent meals list
- Daily insights
- Learning progress

### 🍽️ Log Meal Screen
- 📸 Photo capture with camera
- 🏷️ Barcode scanner for packaged foods
- 📦 Batch scanning for meal prep
- ⌨️ Manual text entry
- Real-time food detection simulation

### 📈 Progress Screen
- Weekly score charts
- Health metrics (energy, weight, mood)
- Achievement badges
- Personalized insights

### 📚 Education Screen
- Learning modules about ENS
- Quick read articles
- Key concepts
- FAQ section

### 👤 Profile Screen
- User information
- Health condition tracking
- Allergies & sensitivities management
- App settings
- Data export

## Enjoy Your App! 🎉

You now have a fully functional React Native app for iOS and Android!

Start it with: `npm start`

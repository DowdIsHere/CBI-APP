# JD Mercer Protocol
## Enteric Nervous System Support

A comprehensive nutrition tracking mobile app built with React Native and Expo, designed to support the Enteric Nervous System (ENS) through evidence-based nutritional guidance.

## Features

- **📸 Photo Analysis**: AI-powered meal recognition with automatic food identification
- **📦 Batch Scanning**: Analyze multiple meal prep containers at once
- **🏷️ Barcode Scanner**: Instant packaged food analysis with ingredient breakdown
- **📊 Progress Tracking**: Monitor daily scores, streaks, and health metrics
- **📚 Educational Content**: Learn about the gut-brain-mitochondria axis
- **👤 Personalized Profiles**: Manage allergies, sensitivities, and health conditions

## Tech Stack

- **React Native** with TypeScript
- **Expo** for cross-platform development
- **React Navigation** for routing
- **Expo Camera** for photo and barcode scanning
- **Expo Image Picker** for photo selection

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your iOS or Android device (for testing)
- For iOS builds: macOS with Xcode
- For Android builds: Android Studio

### Installation

1. Navigate to the project directory:
```bash
cd C:\ATP\CBI-App
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Running the App

### On Physical Device (Recommended)

1. Install Expo Go from the App Store (iOS) or Google Play (Android)
2. Run `npm start`
3. Scan the QR code with your device
4. The app will load in Expo Go

### iOS Simulator (macOS only)

```bash
npm run ios
```

### Android Emulator

```bash
npm run android
```

### Web Browser

```bash
npm run web
```

## Building for Production

### iOS

1. Configure your Apple Developer account in `app.json`
2. Build the app:
```bash
eas build --platform ios
```

### Android

1. Build the APK or AAB:
```bash
eas build --platform android
```

### Both Platforms

```bash
eas build --platform all
```

## Project Structure

```
CBI-App/
├── src/
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── MealEntryScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   ├── EducationScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/        # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── components/        # Reusable components
│   ├── types/            # TypeScript type definitions
│   └── constants/        # App constants
├── assets/               # Images, fonts, etc.
├── App.tsx              # Main app entry point
├── app.json             # Expo configuration
└── package.json         # Dependencies
```

## Key Screens

### Home Screen
- Dashboard with quick stats
- Recent meals
- Today's insights
- Quick action buttons for meal logging
- Learning progress

### Meal Entry Screen
- Multiple input methods (Photo, Barcode, Batch, Manual)
- Real-time camera interface with barcode scanning
- Food detection and scoring
- Meal summary and save functionality

### Progress Screen
- Weekly score charts
- Health metrics tracking
- Achievements
- Personalized insights

### Education Screen
- Learning modules
- Quick read articles
- Key concepts about the JD Mercer Protocol
- FAQ section

### Profile Screen
- User information
- Health condition management
- Allergies and sensitivities
- App settings
- Export data functionality

## Permissions Required

### iOS
- Camera access (for meal photos and barcode scanning)
- Photo library access (for selecting images)

### Android
- Camera permission
- Storage read/write permissions

## Configuration

Edit `app.json` to customize:
- App name and description
- Bundle identifiers
- App icons and splash screens
- Permissions
- Build settings

## Development Tips

1. **Hot Reload**: Changes to code will automatically reload the app
2. **Debugging**: Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) for dev menu
3. **Logs**: View console logs with `npm start` terminal output

## Camera Features

The app uses `expo-camera` for:
- Real-time barcode scanning (UPC, EAN, Code128, Code39)
- Photo capture with flash control
- Front/back camera switching
- Overlay guides for optimal scanning

## Navigation

The app uses bottom tab navigation with 5 main screens:
- Home (Dashboard)
- Log Meal
- Progress
- Learn (Education)
- Profile

## Styling

- Uses React Native StyleSheet for optimal performance
- Consistent color scheme based on JD Mercer Protocol branding
- Responsive layouts that work on all device sizes
- Custom components styled to match the web interface

## Future Enhancements

- AI-powered food recognition (integration pending)
- Cloud sync for data backup
- Social features for sharing progress
- Advanced analytics and reports
- Integration with health tracking devices
- Meal planning and recipe suggestions

## About JD Mercer Protocol

The JD Mercer Protocol app focuses on:
- **Gut Intelligence** (Enteric Nervous System)
- **Brain Intelligence** (Central Nervous System)
- **Cellular Intelligence** (Mitochondrial Function)

Every food is scored based on its impact on these three interconnected systems.

## License

Copyright © 2025 JD Mercer Protocol

## Support

For issues or questions:
1. Check the Education screen in the app
2. Visit the Help & Support section in Profile
3. Contact: support@jdmercerprotocol.com

## Version

Current Version: 1.0.0

---

Built with ❤️ for better health through nutrition

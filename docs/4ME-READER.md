# 4Me Reader - Cognitive E-Reader

## Overview

The 4Me Reader is a personalized e-reader application integrated into the CBI mobile app. It adapts content presentation based on your cognitive gradients from the Cognition Blocks framework.

## Features

### 📖 Personalized Reading Experience
- **Gradient-Based Customization**: Adjust content presentation based on your cognitive preferences
- **Reading Time Estimation**: Automatic calculation of reading time based on text length
- **Clean, Distraction-Free Interface**: E-ink inspired design for comfortable reading

### 🎯 Gradient Settings

The reader allows you to customize three key gradients:

1. **Information Style (Spatial Gradient)**
   - **Examples**: Prefer concrete examples and hands-on demonstrations
   - **Principles**: Prefer abstract concepts and theoretical frameworks

2. **Focus (Reference Gradient)**
   - **Individual**: Focus on personal impact and self-oriented perspectives
   - **Group**: Focus on collective impact and societal perspectives

3. **Time Orientation (Temporal Gradient)**
   - **Past**: Learn from historical context and previous experiences
   - **Future**: Focus on future possibilities and upcoming implications

### 📁 File Management

- **Text Paste**: Quickly paste and save text content
- **File Library**: Access your saved documents
- **Multiple Format Support**: Planned support for PDF, EPUB, TXT, DOCX

### 🧬 Cognitive Assessment

- Integrated assessment to determine your optimal reading preferences
- Personalized recommendations based on your cognitive profile

## Usage

### Accessing the Reader

1. Open the CBI app
2. Tap the **Reader** tab in the bottom navigation
3. Start reading or add your own content

### Customizing Your Experience

1. Tap the menu icon (📚) to expand the sidebar
2. Adjust the three gradient toggles based on your preferences:
   - Information Style
   - Focus
   - Time Orientation
3. The reader will adapt content highlighting and presentation

### Adding Content

1. Tap the **Files** icon (📁) in the sidebar
2. Either:
   - Paste text directly into the text area
   - Upload files (future feature)
3. Tap **Save Text** to add to your library

### Taking the Assessment

1. Tap the **Assessment** icon (🧬) in the sidebar
2. Follow the prompts to discover your optimal reading style
3. Your preferences will automatically update

## Technical Details

### Platform Support

- ✅ Android
- ✅ iOS (iPhone/iPad)
- ✅ Expo Web
- ⚠️ Windows Mobile (via React Native Windows - requires additional setup)

### Architecture

The reader is built using:
- **React Native**: Cross-platform mobile framework
- **Expo**: Development and build toolchain
- **TypeScript**: Type-safe development
- **React Navigation**: Screen navigation

### File Structure

```
src/
├── screens/
│   └── ReaderScreen.tsx    # Main reader component
└── navigation/
    └── AppNavigator.tsx    # Navigation configuration
```

## Future Enhancements

### Planned Features

1. **File Upload Integration**
   - PDF parsing and rendering
   - EPUB support
   - DOCX conversion

2. **Advanced Highlighting**
   - Dynamic text highlighting based on gradient settings
   - Color-coded emphasis for different cognitive modes
   - Annotation and note-taking

3. **Reading Analytics**
   - Reading speed tracking
   - Comprehension insights
   - Progress over time

4. **Synchronization**
   - Cloud storage integration
   - Cross-device syncing
   - Bookmark preservation

5. **AI-Powered Features**
   - Content summarization
   - Question generation
   - Adaptive difficulty adjustment

## Development

### Building for Mobile

#### Android
```bash
npm run android
# or
expo build:android
```

#### iOS
```bash
npm run ios
# or
expo build:ios
```

#### Windows Mobile
```bash
# Requires React Native Windows setup
npx react-native init myapp --template react-native-windows
```

### Testing

To test the reader:
1. Run `npm start` or `expo start`
2. Use the Expo Go app on your mobile device
3. Navigate to the Reader tab
4. Test gradient toggles and content display

## Cognitive Science Background

The 4Me Reader is based on research in:
- **Temporal Processing**: How individuals process past, present, and future information
- **Spatial Reasoning**: Concrete vs. abstract thinking preferences
- **Self-Reference**: Individual vs. collective focus in information processing

By adapting to these preferences, the reader optimizes comprehension and retention.

## Support

For issues or feature requests:
- Open an issue on GitHub
- Contact: support@cognitionblocksllc.com

## License

Copyright © 2024 Cognition Blocks LLC

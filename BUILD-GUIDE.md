# How to Build CBI App with Icon

## Step 1: Create Your App Icon

### Option A: Use Our Icon Generator (Easiest)

1. Open the icon generator:
   ```bash
   start C:\ATP\CBI-App\create-icons.html
   ```

2. Click the download buttons:
   - Download **icon.png** (1024x1024)
   - Download **adaptive-icon.png** (1024x1024)
   - Download **favicon.png** (48x48)

3. Move the downloaded files to:
   ```
   C:\ATP\CBI-App\assets\
   ```

### Option B: Use Your Own Icon

Create these files and place them in `C:\ATP\CBI-App\assets\`:
- `icon.png` - 1024x1024px (main app icon)
- `adaptive-icon.png` - 1024x1024px (Android adaptive icon)
- `favicon.png` - 48x48px (web favicon)
- `splash-icon.png` - 1284x2778px (splash screen)

**Tip:** Use Canva, Figma, or any image editor to create a 1024x1024 icon with "CBI" text.

---

## Step 2: Install EAS Build Tools

Open PowerShell or Command Prompt:

```bash
npm install -g eas-cli
```

This installs Expo's build service (free for first builds).

---

## Step 3: Create Expo Account (Free)

1. Go to https://expo.dev and sign up (free account)

2. Login in your terminal:
   ```bash
   eas login
   ```

3. Enter your Expo credentials

---

## Step 4: Configure Your Build

Navigate to your app:
```bash
cd C:\ATP\CBI-App
```

Initialize EAS:
```bash
eas build:configure
```

This creates `eas.json` with build configurations.

---

## Step 5A: Build for Android (APK)

### Build the APK:
```bash
eas build --platform android --profile preview
```

**What happens:**
1. ✓ Code is uploaded to Expo servers
2. ✓ Android APK is built (takes 5-10 minutes)
3. ✓ You get a download link

### Install on Android Phone:
1. Download the APK from the link
2. Transfer to your Android phone
3. Open the APK file on your phone
4. Allow "Install from Unknown Sources" if prompted
5. **App installs with your icon!** 🎉

---

## Step 5B: Build for iOS (iPhone)

### Requirements:
- macOS computer (required for iOS builds)
- Apple Developer Account ($99/year)

### Build for iOS:
```bash
eas build --platform ios --profile preview
```

### Install via TestFlight:
1. ✓ Build completes on Expo servers
2. ✓ Get installation link
3. ✓ Install TestFlight app on iPhone
4. ✓ Open link to install CBI app

---

## Faster Option: Build Both Platforms

```bash
eas build --platform all --profile preview
```

Builds Android APK and iOS IPA simultaneously.

---

## Alternative: Local Development Build

If you want to test faster without waiting for cloud builds:

### For Android:
```bash
cd C:\ATP\CBI-App
npx expo run:android
```

Requires: Android Studio installed

### For iOS (macOS only):
```bash
npx expo run:ios
```

Requires: Xcode installed

---

## Step 6: Share Your App

### Android APK:
- Send the APK file directly to users
- They install it manually
- No Google Play Store needed for testing

### iOS IPA:
- Share via TestFlight link
- Up to 10,000 testers
- No App Store submission needed for testing

---

## Publishing to App Stores (Later)

### Google Play Store:
```bash
eas build --platform android --profile production
eas submit --platform android
```

### Apple App Store:
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

---

## Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `eas login` | Login to Expo account |
| `eas build:configure` | Setup build config |
| `eas build -p android` | Build Android APK |
| `eas build -p ios` | Build iOS IPA |
| `eas build -p all` | Build both platforms |
| `eas build:list` | View build history |

---

## Troubleshooting

### "Module not found" errors:
```bash
cd C:\ATP\CBI-App
npm install
```

### "eas command not found":
```bash
npm install -g eas-cli
```

### Build fails:
1. Check `eas build:list` for error details
2. Make sure icons exist in `assets/` folder
3. Run `npm install` to ensure all packages are installed

### Android install blocked:
1. On your phone, go to Settings → Security
2. Enable "Install from Unknown Sources"
3. Try installing the APK again

---

## What You Get

After building, you'll have:

✅ **Standalone app** that works offline
✅ **App icon** on your phone's home screen
✅ **No Expo Go needed** - it's a real app
✅ **Shareable** - send APK/IPA to others
✅ **Professional** - looks like any other app

---

## Estimated Build Times

- **Android APK**: 5-10 minutes (cloud build)
- **iOS IPA**: 10-15 minutes (cloud build)
- **Local build**: 2-5 minutes (but requires Android Studio/Xcode)

---

## Free vs Paid

**Expo Free Plan:**
- ✓ Unlimited builds
- ✓ Cloud build service
- ✓ 30 builds per month included
- ✓ Perfect for testing

**Expo Paid Plans:**
- More concurrent builds
- Priority build queue
- Team collaboration features

For your personal app, the free plan is more than enough!

---

## Next Steps After Building

1. ✅ Install APK on your Android phone
2. ✅ See your CBI icon on home screen
3. ✅ Open the app (no Expo Go needed)
4. ✅ Test all features (camera, barcode, etc.)
5. ✅ Share with friends/family

---

## Summary: Fastest Path to Installable App

```bash
# 1. Create icon (use the HTML generator)
start C:\ATP\CBI-App\create-icons.html

# 2. Install EAS
npm install -g eas-cli

# 3. Login to Expo
eas login

# 4. Navigate to app
cd C:\ATP\CBI-App

# 5. Configure build
eas build:configure

# 6. Build for Android
eas build --platform android --profile preview

# 7. Download APK and install on phone
# (Link provided in terminal)
```

**That's it! You'll have a real app with an icon in about 15 minutes!** 🚀

---

## Need Help?

Check build status:
```bash
eas build:list
```

View detailed logs:
```bash
eas build:view [BUILD_ID]
```

Cancel a build:
```bash
eas build:cancel
```

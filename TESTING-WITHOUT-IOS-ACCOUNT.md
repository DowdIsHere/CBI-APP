# Testing CBI App Without iOS Developer Account

## 🎯 Best Options for Testing

### Option 1: Expo Go (Fastest - Works on iOS & Android)

**Best for:** Quick testing, sharing with testers, no build needed

#### Share with Testers:

1. **Start the dev server:**
   ```bash
   cd C:\ATP\CBI-App
   npx expo start --tunnel
   ```

2. **Share the link:**
   - You'll get a link like: `exp://u.expo.dev/update/[project-id]`
   - Send this link to testers
   - They install Expo Go app
   - They open the link in Expo Go
   - App loads instantly!

#### Advantages:
- ✅ Works on iOS without developer account
- ✅ Works on Android
- ✅ Instant updates - just refresh
- ✅ Easy to share
- ✅ Free

#### Limitations:
- ⚠️ Testers need Expo Go app installed
- ⚠️ No custom app icon (shows in Expo Go)
- ⚠️ Some native features limited

---

### Option 2: Expo Development Build (Better Testing)

**Best for:** Testing with real app features, but still shareable

#### Build once, share with everyone:

```bash
# For Android (no account needed)
eas build --profile development --platform android

# For iOS (works without paid account for testing)
eas build --profile development --platform ios
```

#### Share the build:
1. Download link provided after build
2. Share link with testers
3. They install directly
4. Updates over-the-air without rebuilding

---

### Option 3: Android APK Only (Most Practical)

**Best for:** Full app experience, easy distribution

Since iOS account expired, focus on Android:

```bash
cd C:\ATP\CBI-App
build-android.bat
```

#### Share APK with testers:
1. Build completes → get download link
2. Share link or APK file directly
3. Testers install on Android
4. **Full app with icon!**

#### For iOS users without your dev account:
- They use Expo Go (Option 1)
- You share the tunnel link
- Works on iPhone without TestFlight

---

## 🚀 RECOMMENDED: Expo Publish with Shareable Link

This creates a permanent shareable link for testing:

### Step 1: Publish Your App

```bash
cd C:\ATP\CBI-App
npx expo publish
```

### Step 2: Get Shareable Link

After publishing, you'll get:
- **Web link:** `https://exp.host/@your-username/cbi-app`
- **QR code** to scan

### Step 3: Share with Testers

Send them:
1. The web link OR QR code
2. Instructions: "Install Expo Go, then open this link"

#### They can test on:
- ✅ iOS (any iPhone, no developer account needed)
- ✅ Android
- ✅ Updates automatically when you publish new version

---

## 📱 Quick Share Commands

### Create shareable link:
```bash
cd C:\ATP\CBI-App
npx expo start --tunnel
```

### Or publish permanently:
```bash
npx expo publish
```

### Build Android APK:
```bash
build-android.bat
```

---

## 🔗 Create Public Testing Link

I'll create a script to make sharing easier:

### Option A: Temporary Link (Active while your computer runs)

```bash
cd C:\ATP\CBI-App
npx expo start --tunnel --qr
```

**Share:**
- The QR code appears
- The expo link: `exp://...`
- Testers scan QR or open link

### Option B: Permanent Link (Hosted by Expo)

```bash
npx expo publish --release-channel production
```

**Share:**
- Get link: `https://exp.host/@yourname/cbi-app`
- This link works forever
- Updates when you publish again

---

## 📋 Tester Instructions

### For iPhone Users (Without TestFlight):

1. **Install Expo Go** from App Store (free)
2. **Open the link** I send you
3. **App loads** in Expo Go
4. Test all features!

### For Android Users:

**Option A:** Use Expo Go (same as iPhone)

**Option B:** Install APK directly
1. Download APK from link
2. Install APK
3. Full app with CBI icon!

---

## 🎨 Comparison Table

| Method | iOS Support | Android Support | Has Icon | Needs Account |
|--------|-------------|-----------------|----------|---------------|
| Expo Go Link | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| Expo Publish | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| Android APK | ❌ No | ✅ Yes | ✅ Yes | ❌ No |
| Dev Build | ⚠️ Limited | ✅ Yes | ✅ Yes | ⚠️ For iOS |

---

## 🚀 Best Strategy While iOS Account Expired

### Phase 1: Test with Expo Go (Now)
```bash
cd C:\ATP\CBI-App
npx expo start --tunnel
```
- Share link with all testers
- Works on iOS and Android immediately
- No accounts needed

### Phase 2: Android APK (For serious testing)
```bash
build-android.bat
```
- Android users get full app with icon
- iOS users continue with Expo Go

### Phase 3: Renew iOS account (Later)
- Build iOS version when account renewed
- Distribute via TestFlight
- Everyone gets full app

---

## 📲 How to Share Testing Link

### Create the link:

```bash
cd C:\ATP\CBI-App
npx expo start --tunnel
```

### Send testers:

```
Hey! Test the CBI app:

For iPhone:
1. Install "Expo Go" from App Store
2. Open this link: [PASTE LINK HERE]
3. App loads in Expo Go

For Android:
Option 1: Use Expo Go (same as iPhone)
Option 2: Download APK: [PASTE APK LINK]

Let me know what you think!
```

---

## 🔧 Commands You Need

```bash
# Create temporary shareable link (while computer runs)
npx expo start --tunnel

# Create permanent shareable link (hosted by Expo)
npx expo publish

# Build Android APK (full app)
build-android.bat

# Check published versions
npx expo publish:history

# Check build status
eas build:list
```

---

## ⚡ Super Quick Testing Setup (30 seconds)

**Right now, run this:**

```bash
cd C:\ATP\CBI-App
npx expo start --tunnel
```

**Then:**
1. QR code appears
2. Take screenshot
3. Send to testers
4. They scan with Expo Go
5. Done!

---

## 💡 Pro Tips

1. **Use tunnel mode** (`--tunnel`) for sharing outside your network
2. **Publish to a release channel** for stable testing versions
3. **Keep dev server running** or use `expo publish` for persistent links
4. **Android APK** is best for serious testers
5. **Expo Go** is best for quick feedback

---

## 🎯 My Recommendation

**For immediate testing:**
```bash
cd C:\ATP\CBI-App
npx expo start --tunnel
```

Send the link to testers. They install Expo Go and test immediately.

**For better testing (30 min setup):**
```bash
build-android.bat
```

Android users get full app. iOS users use Expo Go until account renewed.

---

## 📝 Tester Feedback Form

Create a simple feedback doc and share:

```
CBI App Testing Feedback

Tester name: ___________
Device: iOS / Android
Date: ___________

Features tested:
[ ] Home Dashboard
[ ] Photo meal entry
[ ] Barcode scanner
[ ] Progress tracking
[ ] Education content
[ ] Profile settings

Issues found:
1. ___________
2. ___________

Suggestions:
___________

Overall experience: 1-10: ___
```

---

**Quick Start:** Run `npx expo start --tunnel` and share the link!

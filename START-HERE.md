# 🚀 START HERE - Get Your CBI App with Icon

## What You Want: App with Icon on Your Phone

## What To Do: Run 3 Commands

### 📱 For Android Phone

Open Command Prompt and run:

```bash
cd C:\ATP\CBI-App
build-android.bat
```

**What happens:**
1. ✅ Installs tools (first time only)
2. ✅ Asks you to create free Expo account
3. ✅ Builds your app (10 minutes)
4. ✅ Gives you download link

**Then:**
1. Download the APK file
2. Send to your phone
3. Install it
4. **App icon appears on home screen!** 🎉

---

### 🍎 For iPhone

```bash
cd C:\ATP\CBI-App
build-ios.bat
```

Then install via TestFlight app.

---

## 🎨 Want to Change the Icon?

**Before building:**

1. Open this file in a browser:
   ```
   C:\ATP\CBI-App\create-icons.html
   ```

2. Download the icons (or use your own 1024x1024 image)

3. Replace these files in `C:\ATP\CBI-App\assets\`:
   - `icon.png`
   - `adaptive-icon.png`

4. Run the build script again

---

## 📚 All the Guides

I've created several guides for you:

1. **START-HERE.md** ← You are here (simplest)
2. **HOW-TO-GET-APP-ICON.md** (step-by-step with pictures)
3. **BUILD-GUIDE.md** (detailed technical guide)
4. **QUICKSTART.md** (testing with Expo Go)
5. **README.md** (full documentation)

**Just want the app?** Follow this guide.

**Want to understand?** Read the others.

---

## ⚡ The Absolute Fastest Way

1. Open Command Prompt
2. Copy and paste this:

```bash
cd C:\ATP\CBI-App && build-android.bat
```

3. Press Enter
4. Wait 10 minutes
5. Download and install APK
6. Done! App is on your phone.

---

## 🆘 If Something Goes Wrong

### "Command not found"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
eas login
```
Create free account at https://expo.dev

### "Build failed"
```bash
npm install
```
Then try build again.

### "Can't install on phone"
Settings → Security → Enable Unknown Sources

---

## 🎯 What You're Building

- **Standalone App** - Not Expo Go
- **Real Icon** - Shows on home screen
- **All Features** - Camera, scanning, tracking
- **Shareable** - Send APK to others
- **Free** - No cost to build or use

---

## ⏰ Time Needed

**First time:** 20 minutes total
- 5 min setup
- 10 min build wait
- 5 min install

**Next time:** 10 minutes
- Just run build script
- Wait for build
- Install

---

## 📁 Your App Location

Everything is here:
```
C:\ATP\CBI-App
```

---

## 🎊 That's It!

You now know how to get your app with an icon on your phone.

**Quick command:**
```bash
cd C:\ATP\CBI-App && build-android.bat
```

**Result:**
A real app with CBI icon on your home screen!

---

## 💡 Pro Tip

Test it first with Expo Go:
```bash
npm start
```

Then build the real app when you're happy with it.

---

## ✨ Next Steps After Installing

1. ✅ Open the CBI app from home screen
2. ✅ Grant camera permissions
3. ✅ Test photo capture
4. ✅ Try barcode scanning
5. ✅ Explore all 5 screens
6. ✅ Share APK with friends!

---

## 🚀 Build Command Cheat Sheet

```bash
# Test in Expo Go (fast, no icon)
npm start

# Build Android APK (real app with icon)
build-android.bat

# Build iPhone IPA (real app with icon)
build-ios.bat

# View all your builds
eas build:list
```

---

**You're all set! Run the build script and get your app!** 🎉

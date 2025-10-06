# 🚀 CBI-ENS Complete Setup Guide

## Quick Start (3 Simple Steps)

### ✅ Step 1: Save Your Logo
1. **Right-click** your CBI logo image → **Save As**
2. Save to: `C:\Users\d1pri\cbi-app\cbi-logo.png`
3. Make sure it's named exactly `cbi-logo.png`

### ✅ Step 2: Set Up Database (One-Time)
1. Open **Command Prompt** (Windows Key + R, type `cmd`, Enter)
2. Copy and paste these commands **one at a time**:

```bash
cd C:\Users\d1pri\cbi-app\backend
```
```bash
npm run db:generate
```
```bash
npm run db:migrate
```

When it asks for migration name, just press **Enter**

### ✅ Step 3: Update Desktop Icon
1. Go to folder: `C:\Users\d1pri\cbi-app`
2. Double-click: **`UPDATE_ICON.bat`**
3. Follow the prompts

---

## 🎯 Done! Launch Your App

**Double-click the CBI-ENS icon on your desktop!**

The app will:
- ✅ Start backend server
- ✅ Start web app
- ✅ Open in your browser
- ✅ Ready to track nutrition!

---

## 📱 How to Use CBI-ENS

### First Time:
1. Click **"Sign Up"**
2. Enter email and password
3. Create your account
4. Log in

### Log a Meal:
1. Click **"+ Log Meal"**
2. Choose method:
   - 📷 **Photo** - Take/upload food picture
   - ✍️ **Describe** - Type what you ate
   - 📝 **Manual** - Search database
3. Select meal time (breakfast/lunch/dinner/snack)
4. Click **"Analyze with AI"**
5. Wait 10-20 seconds for analysis
6. Review inflammatory scores and nutrients
7. Click **"Save Meal"**

### View Dashboard:
- See today's meals
- Track inflammatory scores
- Monitor nutrition trends
- View your streak

---

## 🎨 Understanding Scores

### Inflammatory Scores:
- **-10 to -5** 🟢 Excellent (anti-inflammatory)
  - Wild fish, organic veggies, berries

- **-4 to 0** 🟡 Good (mildly anti-inflammatory)
  - Whole grains, lean meats

- **+1 to +5** 🟠 Fair (mildly inflammatory)
  - Refined grains, conventional dairy

- **+6 to +10** 🔴 Poor (highly inflammatory)
  - Processed foods, sugar, seed oils

### Goal:
Keep your daily total score **below 0** (negative is better!)

---

## 🛑 Stop the App

**Option 1:** Double-click **`CBI-ENS-Stop.bat`**

**Option 2:** Close the command windows

---

## 📚 Files Reference

### Main Files:
- **CBI-ENS (Desktop Icon)** - Launch app
- **CBI-ENS-Stop.bat** - Stop servers
- **UPDATE_ICON.bat** - Update desktop icon
- **cbi-logo.png** - Your logo file

### Configuration:
- **backend/.env** - API keys and settings
- **web/.env** - Frontend settings

### Documentation:
- **COMPLETE_SETUP_GUIDE.md** - This file
- **LOGO_SETUP_INSTRUCTIONS.md** - Icon setup
- **README_LAUNCHER.md** - Launcher details
- **COMPLETION_SUMMARY.md** - Development summary

---

## ❓ Troubleshooting

### "Node.js not found"
- Install from: https://nodejs.org/
- Restart computer after installation

### "PostgreSQL not found"
- Install from: https://www.postgresql.org/download/windows/
- Remember password during setup
- Restart computer

### "Port already in use"
1. Run **CBI-ENS-Stop.bat**
2. Wait 5 seconds
3. Launch again

### "Database connection failed"
Check `backend/.env` file:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/cbi_db
```
Replace `YOUR_PASSWORD` with your PostgreSQL password

### "AI analysis not working"
Check `backend/.env` file has your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-api03-ev3...UQAA
```

### Browser doesn't open
Manually go to: http://localhost:3000

---

## 🔄 Daily Usage

### To Start:
🖱️ Double-click **CBI-ENS** on desktop

### To Use:
1. 📸 Take photo of meal
2. 🤖 Get AI analysis
3. 💾 Save to dashboard
4. 📊 Track progress

### To Stop:
🛑 Double-click **CBI-ENS-Stop.bat**

---

## 🎊 You're All Set!

Your CBI-ENS nutrition tracking system is ready to help you optimize your cellular health!

**Questions?** Check the troubleshooting section or the other documentation files.

---

**CBI-ENS** - Cognition Blocks of Intelligence - Enhanced Nutrition System

*Built with AI-powered food analysis using Claude Vision*

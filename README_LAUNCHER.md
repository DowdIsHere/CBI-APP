# CBI-ENS Launcher Guide

## 🚀 Quick Start - Single Click Launch

Your CBI app now has a **single-click launcher** called **CBI-ENS**!

## 📋 Setup (One-Time)

### 1. Create Desktop Shortcut
Double-click: `CREATE_DESKTOP_SHORTCUT.bat`

This will create a **CBI-ENS** icon on your desktop.

### 2. Set Up Database (First Time Only)
```bash
# Open Command Prompt in your CBI app folder
cd backend
npm run db:generate
npm run db:migrate
```

**Note:** Make sure PostgreSQL is installed and running before running these commands.

## 🎯 How to Use

### Start CBI-ENS
**Option 1:** Double-click the **CBI-ENS** icon on your desktop

**Option 2:** Double-click `CBI-ENS.vbs` in the cbi-app folder

**Option 3:** Double-click `CBI-ENS.bat` for console output

### Stop CBI-ENS
Double-click: `CBI-ENS-Stop.bat`

Or just close the browser and command windows.

## 📝 What Happens When You Launch

1. ✅ Backend API starts on port 5000
2. ✅ Web app starts on port 3000
3. ✅ Browser opens automatically to http://localhost:3000
4. ✅ Ready to use!

## 🔧 Available Launchers

| File | Description |
|------|-------------|
| `CBI-ENS.vbs` | **Silent launcher** (no console windows) |
| `CBI-ENS.bat` | **Visible launcher** (shows console output) |
| `CBI-ENS-Stop.bat` | **Stop all servers** |
| `CREATE_DESKTOP_SHORTCUT.bat` | **Create desktop icon** |

## ⚡ First Launch Checklist

- [ ] Node.js installed (`node --version` should work)
- [ ] PostgreSQL installed and running
- [ ] Dependencies installed (run `npm install` in root, web, and backend folders)
- [ ] Anthropic API key added to `backend/.env`
- [ ] PostgreSQL database created (`createdb cbi_db`)
- [ ] Database migrations run (`cd backend && npm run db:migrate`)
- [ ] Desktop shortcut created (run `CREATE_DESKTOP_SHORTCUT.bat`)
- [ ] Ready to launch CBI-ENS!

## 🎨 Icon Customization (Optional)

To use a custom icon:

1. Create or download a `.ico` file named `cbi-icon.ico`
2. Place it in the `cbi-app` folder
3. Edit `CREATE_DESKTOP_SHORTCUT.bat`
4. Change the IconLocation line to:
   ```
   echo oLink.IconLocation = "%~dp0cbi-icon.ico" >> %SCRIPT%
   ```
5. Run `CREATE_DESKTOP_SHORTCUT.bat` again

## 🆘 Troubleshooting

### "Node.js is not installed"
Install Node.js from https://nodejs.org/

### "Port already in use"
1. Run `CBI-ENS-Stop.bat`
2. Wait 5 seconds
3. Launch again

### App doesn't open in browser
Manually navigate to: http://localhost:3000

### Database errors
```bash
cd backend
npm run db:migrate
```

## 🎉 You're All Set!

Just double-click **CBI-ENS** on your desktop and start tracking your nutrition!

---

**CBI-ENS** - Cognition Blocks of Intelligence - Enhanced Nutrition System

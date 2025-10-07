# CBI - Getting Started Guide

Welcome! This comprehensive guide will get your CBI (Cognition Blocks of Intelligence) application up and running in approximately 15 minutes.

**What you'll accomplish:**
- ✅ Install all required dependencies
- ✅ Set up PostgreSQL database
- ✅ Configure environment variables
- ✅ Start the development servers
- ✅ Create your first user account

**Time estimate:** 15 minutes (first-time setup)

---

## 🎯 Quick Reference

**TL;DR - Minimal Setup:**
```bash
# 1. Install dependencies
npm install && cd web && npm install && cd ../backend && npm install && cd ..

# 2. Set up database
createdb cbi_db
cd backend && npm run db:generate && npm run db:migrate && cd ..

# 3. Configure .env files (see Step 3 below for details)

# 4. Start servers (in separate terminals)
cd backend && npm run dev  # Terminal 1
cd web && npm run dev      # Terminal 2
```

For detailed instructions, continue reading below.

---

## Prerequisites

Before starting, make sure you have installed:

- ✅ **Node.js 18+** ([Download](https://nodejs.org/))
  - Verify: `node --version` should show v18 or higher
- ✅ **PostgreSQL 14+** ([Download](https://www.postgresql.org/download/))
  - Verify: `psql --version` should show version 14 or higher
- ✅ **Git** ([Download](https://git-scm.com/))
  - Verify: `git --version` should work
- ✅ **Code Editor** (VS Code recommended: [Download](https://code.visualstudio.com/))

## Quick Start (5 Steps)

### Step 1: Install Dependencies (2 min)

```bash
# Navigate to project root
cd CBI-APP

# Install root dependencies
npm install

# Install workspace dependencies
cd web && npm install && cd ..
cd backend && npm install && cd ..
cd shared && npm install && cd ..
```

**Note:** If workspace directories don't exist yet, skip the individual workspace installs.

### Step 2: Set Up PostgreSQL Database (3 min)

```bash
# Create database (in your terminal or PostgreSQL GUI)
createdb cbi_db

# Or using psql:
psql -U postgres
CREATE DATABASE cbi_db;
\q
```

### Step 3: Configure Environment Variables (2 min)

```bash
# Backend configuration
cd backend
cp .env.example .env

# Edit backend/.env with your details:
# - DATABASE_URL=postgresql://username:password@localhost:5432/cbi_db
# - JWT_SECRET=your-super-secret-key-here
# - (Optional) ANTHROPIC_API_KEY=sk-ant-... for AI features

# Web configuration
cd ../web
cp .env.example .env
# Default values should work for local development
```

**⚠️ Important: Update these values in `backend/.env`:**
- `DATABASE_URL`: Your PostgreSQL connection string (format: `postgresql://username:password@localhost:5432/cbi_db`)
- `JWT_SECRET`: A secure random string (use a password generator - minimum 32 characters recommended)
- `ANTHROPIC_API_KEY`: Your API key from https://console.anthropic.com/ (required for AI features)

### Step 4: Run Database Migrations (1 min)

```bash
cd backend

# Generate Prisma Client
npm run db:generate

# Run migrations to create tables
npm run db:migrate

# (Optional) View database
npm run db:studio
```

### Step 5: Start Development Servers (1 min)

**Open TWO terminal windows:**

```bash
# Terminal 1: Backend API
cd backend
npm run dev
# ✅ Should see: "🚀 CBI Backend API running on port 5000"

# Terminal 2: Web App
cd web
npm run dev
# ✅ Should see: "Local: http://localhost:3000"
```

## 🎉 Success!

Open your browser to **http://localhost:3000**

You should see the CBI landing page!

## Next Steps

### 1. Create Your First User

1. Click "Get Started Free"
2. Sign up with email/password
3. You'll be redirected to onboarding

### 2. Integrate Your React Components

Your existing React components need to be moved into the project structure.

**Component Mapping:**

| Your Component | Move To | Purpose |
|----------------|---------|---------|
| `CBIMainApp` | `web/src/pages/DashboardPage.jsx` | Main dashboard |
| `CompleteMealEntry` | `web/src/pages/MealEntryPage.jsx` | Meal logging |
| `ProgressTracker` | `web/src/pages/ProgressPage.jsx` | Progress tracking |
| `CBIEducation` | `web/src/pages/EducationPage.jsx` | Learning modules |
| `UserProfile` | `web/src/pages/OnboardingPage.jsx` | Profile setup |
| `FoodDatabase` | `web/src/components/meal-entry/` | Food database |
| `PhotoFoodAnalyzer` | `web/src/components/camera/` | Photo analysis |
| `CBILegalFramework` | `web/src/components/legal/` | Legal disclaimers |

**Quick Integration Example:**

```javascript
// web/src/pages/DashboardPage.jsx
import React from 'react'
import CBIMainApp from '../components/CBIMainApp' // Your component

export default function DashboardPage() {
  return <CBIMainApp />
}
```

### 3. Seed Food Database

Create a seed script to load your comprehensive food database:

```bash
cd backend
# Create seed file
# Copy your COMPREHENSIVE_FOOD_DATABASE data
npm run db:seed
```

### 4. Test Everything

- ✅ Sign up/login works
- ✅ Profile can be created/updated
- ✅ Meals can be logged manually
- ✅ Progress tracking saves data
- ✅ Food database searchable

## Common Issues & Solutions

### Issue: "Database connection failed"

**Solution:**
```bash
# Make sure PostgreSQL is running
# Mac:
brew services start postgresql

# Windows:
# Start via Services or pgAdmin

# Test connection:
psql -U postgres -d cbi_db
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill

# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete all node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf web/node_modules web/package-lock.json
rm -rf backend/node_modules backend/package-lock.json

# Reinstall
npm install
cd web && npm install && cd ..
cd backend && npm install && cd ..
```

### Issue: "Prisma Client not generated"

**Solution:**
```bash
cd backend
npm run db:generate
```

## Development Workflow

### Daily Development

```bash
# Start both servers (in separate terminals)
cd backend && npm run dev
cd web && npm run dev

# View database
cd backend && npm run db:studio
```

### Making Database Changes

```bash
# Edit prisma/schema.prisma
# Then:
cd backend
npm run db:migrate
npm run db:generate
```

### Adding New API Endpoints

1. Create controller in `backend/src/controllers/`
2. Create route in `backend/src/routes/`
3. Import route in `backend/src/server.ts`
4. Add corresponding API function in `web/src/api/`

## Advanced Features

### Enable Claude Vision API

1. Sign up at https://console.anthropic.com/ and create an API key
2. Add to `backend/.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   ```
3. Restart the backend server
4. The AI photo analysis feature will now work

**Note:** Without this API key, photo analysis features will not function.

### Deploy to Production

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for:
- Vercel deployment (web)
- Railway deployment (backend)
- Environment variables setup
- SSL configuration

## Mobile Development (Later)

### iOS Setup

```bash
cd mobile
npm install
npm run pod-install
npm run ios
```

### Android Setup

```bash
cd mobile
npm install
npm run android
```

## Testing

```bash
# Run all tests
npm test

# Test specific project
cd web && npm test
cd backend && npm test
```

## Getting Help

**Check logs:**
- Backend: Terminal running `npm run dev`
- Web: Browser console (F12)
- Database: Prisma Studio (http://localhost:5555)

**Documentation:**
- [API Documentation](./docs/API.md)
- [Project Status](./docs/PROJECT_STATUS.md)
- [README](./README.md)

**Still stuck?**
- Check the error message carefully
- Google the specific error
- Check Prisma docs for database issues: https://www.prisma.io/docs
- Check React docs for frontend issues: https://react.dev

## Frequently Asked Questions (FAQ)

### Q: Do I need Redis installed?
**A:** No, Redis is optional and mainly used for caching in production. The app will work fine without it for development.

### Q: Can I use a different database?
**A:** While PostgreSQL is recommended, Prisma supports other databases. However, you'll need to update the schema and connection string accordingly.

### Q: How much does the Anthropic API cost?
**A:** Anthropic charges per token usage. Check their pricing at https://www.anthropic.com/pricing. For typical usage, costs are minimal during development.

### Q: Can I run this on Windows/Mac/Linux?
**A:** Yes! The app is cross-platform and works on all major operating systems that support Node.js and PostgreSQL.

### Q: Do I need to deploy both frontend and backend separately?
**A:** Yes, the frontend (web) and backend (API) are separate applications. The web app can be deployed to Vercel, and the backend to Railway or similar services.

### Q: How do I update the database schema?
**A:** Edit `backend/prisma/schema.prisma`, then run `npm run db:migrate` to create and apply the migration.

## You're All Set! 🚀

Your CBI application foundation is built and running!

**What you have:**
- ✅ Full-stack architecture
- ✅ User authentication
- ✅ Database with migrations
- ✅ API endpoints for all features
- ✅ React app with routing
- ✅ Mobile app structure (pending integration)

**Next:**
- Integrate your existing React components
- Add Claude Vision for photo analysis
- Seed the food database
- Test with real users
- Deploy to production

**Let's build something amazing!** 💪

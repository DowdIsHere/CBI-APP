# CBI - Cognition Blocks of Intelligence

> **Version:** 1.0.0 | **Status:** Active Development | **Last Updated:** 2025

Full-stack nutrition tracking application based on the Dowd Protocol, supporting web and mobile platforms.

**About the Dowd Protocol:** CBI helps users track and optimize their nutrition based on inflammatory response scoring. The app uses AI-powered food analysis to score foods on a scale from -10 (anti-inflammatory) to +10 (pro-inflammatory), helping users make informed dietary choices for cellular health optimization.

## 📋 Table of Contents

- [Project Structure](#️-project-structure)
- [Key Features](#-key-features)
- [Quick Start](#-quick-start)
- [Mobile Development](#-mobile-development)
- [Database](#️-database)
- [Testing](#-testing)
- [Building for Production](#-building-for-production)
- [API Keys Required](#-api-keys-required)
- [Deployment](#-deployment)
- [Tech Stack](#-tech-stack)
- [Documentation](#-documentation)
- [Security](#-security)
- [Legal](#️-legal)
- [Support](#-support)
- [Contributing](#-contributing)

## 🏗️ Project Structure

```
cbi-app/
├── web/                 # React web application (Vite)
├── mobile/              # React Native mobile app (iOS & Android)
├── backend/             # Node.js Express API
├── shared/              # Shared utilities and types
└── docs/                # Documentation
```

## ✨ Key Features

### 🤖 AI-Powered Food Analysis
- Photo-based food recognition using Claude 3.5 Sonnet Vision API
- Automatic nutritional breakdown (calories, protein, carbs, fats, fiber)
- Inflammatory response scoring (-10 to +10 scale)
- Portion size estimation
- Cooking method detection

### 📊 Nutrition Tracking
- Daily meal logging with timestamps
- Historical meal tracking and progress monitoring
- Daily inflammatory score totals
- Streak tracking for consistent usage
- Photo storage for meal history

### 🎯 Personalized Insights
- Custom allergy and sensitivity warnings
- User-specific dietary recommendations
- Progress visualization over time
- Meal analysis with detailed feedback

### 🔐 Secure & Private
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS and security headers configured

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- Redis (optional, for caching)
- For mobile development: Xcode (Mac) and/or Android Studio

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/DowdIsHere/CBI-APP.git
cd CBI-APP

# Install dependencies for the root project
npm install

# Install dependencies for each workspace
cd web && npm install && cd ..
cd backend && npm install && cd ..
cd mobile && npm install && cd ..
cd shared && npm install && cd ..
```

**Note:** If workspace directories don't exist yet, you may need to create them or the repository may be in initial setup phase.

### 2. Set Up Environment Variables

```bash
# Backend configuration
cd backend
cp .env.example .env
# Edit .env with your settings (database URL, API keys, JWT secret, etc.)

# Web configuration
cd ../web
cp .env.example .env
# Edit .env with your settings (typically just the API URL)
```

**Required environment variables for `backend/.env`:**
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secure random string (32+ characters)
- `ANTHROPIC_API_KEY`: Get from https://console.anthropic.com/
- `PORT`: API server port (default: 5000)

**Required environment variables for `web/.env`:**
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

### 3. Set Up Database

```bash
cd backend

# Create the database (ensure PostgreSQL is running)
createdb cbi_db

# Run database migrations
npm run db:migrate

# (Optional) Seed database with initial data
npm run db:seed
```

**Note:** If `createdb` command doesn't work, you can create the database using PostgreSQL GUI tools like pgAdmin or through psql:
```bash
psql -U postgres
CREATE DATABASE cbi_db;
\q
```

### 4. Start Development Servers

**Open separate terminal windows for each service:**

```bash
# Terminal 1: Backend API
cd backend
npm run dev
# Server will start at http://localhost:5000

# Terminal 2: Web App
cd web
npm run dev
# App will start at http://localhost:3000

# Terminal 3 (optional): Mobile App
cd mobile
npm start
# Then run: npm run ios  OR  npm run android
```

**Access the application:**
- Web App: http://localhost:3000
- API: http://localhost:5000
- API Health Check: http://localhost:5000/health

## 📱 Mobile Development

### iOS Setup

```bash
cd mobile
npm run pod-install
npm run ios
```

### Android Setup

```bash
cd mobile
npm run android
```

## 🗄️ Database

We use Prisma ORM with PostgreSQL for database management:

```bash
# Generate Prisma Client (run after schema changes)
cd backend
npm run db:generate

# Create a new migration (run after schema changes)
npm run db:migrate

# Open Prisma Studio (visual database browser)
npm run db:studio
# Opens at http://localhost:5555

# Reset database (⚠️ WARNING: This will delete all data)
npm run db:reset
```

**Database Schema:**
See `backend/prisma/schema.prisma` for the complete database schema including Users, Meals, Foods, and DailyProgress tables.

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific project
cd web && npm test
cd backend && npm test
```

## 📦 Building for Production

### Web App

```bash
cd web
npm run build
# Output in web/dist/
```

### Backend

```bash
cd backend
npm run build
# Output in backend/dist/
```

### Mobile Apps

```bash
cd mobile

# iOS
npm run build:ios

# Android
npm run build:android
```

## 🔑 API Keys Required

### 1. Anthropic Claude API (Required for AI features)
- **Purpose:** AI-powered food photo analysis and nutritional scoring
- **Get key from:** https://console.anthropic.com/
- **Add to:** `backend/.env` as `ANTHROPIC_API_KEY`
- **Cost:** Pay-as-you-go (check Anthropic pricing)

### 2. Email Service (Optional - for production)
- **Purpose:** Account verification and password reset emails
- **Options:** SMTP, SendGrid, AWS SES, Mailgun
- **Configuration:** Add SMTP settings to `backend/.env`

### 3. File Storage (Optional - for production)
- **Purpose:** Photo storage
- **Development:** Local storage in `backend/uploads/`
- **Production:** AWS S3, Cloudflare R2, or similar cloud storage
- **Note:** Local storage is sufficient for development and testing

## 🌐 Deployment

### Web (Vercel)

```bash
cd web
vercel deploy
```

### Backend (Railway)

```bash
cd backend
# Connect to Railway and deploy
railway up
```

### Mobile

- **iOS**: Build in Xcode → Upload to TestFlight
- **Android**: Build APK/AAB → Upload to Play Console

## 📚 Tech Stack

### Frontend (Web)
- React 18
- Vite
- TailwindCSS
- React Router
- React Query
- Zustand (state)

### Frontend (Mobile)
- React Native 0.73
- React Navigation
- NativeWind (Tailwind for RN)
- Vision Camera
- AsyncStorage

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Anthropic Claude SDK

### AI
- Claude 3.5 Sonnet (Vision API)

## 📖 Documentation

### 📚 Which Guide Should I Use?

| Guide | Best For | Description |
|-------|----------|-------------|
| **[README.md](./README.md)** | Everyone | Overview, features, and general project information |
| **[GETTING_STARTED.md](./GETTING_STARTED.md)** | Developers | Complete technical setup guide with detailed steps |
| **[COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)** | End Users | Simple 3-step setup for Windows desktop launcher |
| **[README_LAUNCHER.md](./README_LAUNCHER.md)** | Windows Users | Guide for using the desktop launcher |
| **[COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md)** | Everyone | Feature list and current development status |

### 📄 Available Documentation

- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Complete setup guide for developers
- **[COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)** - End-user setup guide
- **[COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md)** - Development progress and features
- **[README_LAUNCHER.md](./README_LAUNCHER.md)** - Desktop launcher guide
- **API Documentation** - See `docs/API.md` (when available)
- **Database Schema** - See `backend/prisma/schema.prisma`

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- Input validation (Zod)
- CORS configuration
- Helmet.js security headers

## ⚖️ Legal

**Important Disclaimer:** CBI is an educational nutrition tracking tool designed to help users make informed dietary decisions. It is **not** intended to diagnose, treat, cure, or prevent any disease or medical condition. 

- Always consult with qualified healthcare professionals before making significant dietary changes
- Individual results may vary
- The inflammatory scoring system is based on general nutritional principles
- This app is not a substitute for professional medical advice

See the full disclaimer within the application for complete terms.

## 📧 Support

For issues, questions, and feature requests:
- **GitHub Issues:** [Create an Issue](https://github.com/DowdIsHere/CBI-APP/issues)
- **Documentation:** Check the guides in this repository
- **Community:** Join discussions in GitHub Discussions (if enabled)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs:** Open an issue with detailed reproduction steps
2. **Suggest Features:** Share your ideas through GitHub issues
3. **Submit Pull Requests:** Fork the repo, make changes, and submit a PR
4. **Improve Documentation:** Help make our docs even better
5. **Share Feedback:** Let us know how we can improve the app

**Before contributing:**
- Read the code of conduct (if available)
- Check existing issues to avoid duplicates
- Follow the code style used in the project
- Test your changes thoroughly

---

**Built with ❤️ for cellular health optimization through evidence-based nutrition tracking**

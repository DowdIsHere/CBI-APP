[README.md](https://github.com/user-attachments/files/22717904/README.md)
# CBI - Cognition Blocks of Intelligence

Full-stack nutrition tracking application based on the Dowd Protocol, supporting web and mobile platforms.

## 🏗️ Project Structure

```
cbi-app/
├── web/                 # React web application (Vite)
├── mobile/              # React Native mobile app (iOS & Android)
├── backend/             # Node.js Express API
├── shared/              # Shared utilities and types
└── docs/                # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis
- (For mobile) Xcode (Mac) and/or Android Studio

### 1. Clone and Install

```bash
# Install dependencies for all projects
cd cbi-app
npm install

# Install dependencies for each project
cd web && npm install && cd ..
cd backend && npm install && cd ..
cd mobile && npm install && cd ..
cd shared && npm install && cd ..
```

### 2. Set Up Environment Variables

```bash
# Web
cd web
cp .env.example .env
# Edit .env with your settings

# Backend
cd ../backend
cp .env.example .env
# Edit .env with your settings (database, API keys, etc.)
```

### 3. Set Up Database

```bash
cd backend

# Run database migrations
npm run db:migrate

# (Optional) Seed database
npm run db:seed
```

### 4. Start Development Servers

```bash
# Terminal 1: Backend API
cd backend
npm run dev

# Terminal 2: Web App
cd web
npm run dev

# Terminal 3 (optional): Mobile App
cd mobile
npm run start
# Then: npm run ios  OR  npm run android
```

The web app will be at http://localhost:3000
The API will be at http://localhost:5000

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

We use Prisma ORM with PostgreSQL:

```bash
# Generate Prisma Client
npm run db:generate

# Create migration
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio
```

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

1. **Anthropic Claude API**: For photo food analysis
   - Get key from: https://console.anthropic.com/
   - Add to `backend/.env` as `ANTHROPIC_API_KEY`

2. **Email Service**: For verification emails
   - Configure SMTP in `backend/.env`
   - Or use services like SendGrid, AWS SES

3. **(Production) File Storage**:
   - Local development: files stored in `backend/uploads/`
   - Production: AWS S3 or Cloudflare R2 recommended

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

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Mobile Setup Guide](./docs/MOBILE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- Input validation (Zod)
- CORS configuration
- Helmet.js security headers

## ⚖️ Legal

CBI is an educational nutrition tool. It does not diagnose, treat, cure, or prevent any disease. See full disclaimer in the app.

## 📧 Support

For issues and questions:
- GitHub Issues: [Create Issue]
- Email: support@cbi-app.com

---

Built with ❤️ for cellular health optimization

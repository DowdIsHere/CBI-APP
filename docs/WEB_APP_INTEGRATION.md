# Web + Mobile Integration Guide

## Overview

This guide explains how to integrate the Cognition Blocks web platform with the existing React Native mobile app, creating a unified ecosystem.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Users                                 │
└────────────┬────────────────────────────┬────────────────┘
             │                            │
    ┌────────▼────────┐          ┌───────▼───────┐
    │   Web Platform  │          │  Mobile App   │
    │  (Browser)      │          │  (iOS/Android)│
    └────────┬────────┘          └───────┬───────┘
             │                            │
             └────────────┬───────────────┘
                          │
                 ┌────────▼────────┐
                 │  Backend API    │
                 │  (Node.js/PHP)  │
                 └────────┬────────┘
                          │
                 ┌────────▼────────┐
                 │    Database     │
                 │  (PostgreSQL)   │
                 └─────────────────┘
```

## Shared Features

### 1. Assessment System

**Web Implementation**: `website/webapp/assessment.html`
**Mobile Implementation**: Need to create `src/screens/AssessmentScreen.tsx`

#### Shared Data Model
```typescript
interface AssessmentAnswer {
  questionId: number;
  category: 'gradients' | 'blocks' | 'fuel';
  answer: number; // 0-4 scale
}

interface AssessmentResult {
  userId: string;
  timestamp: string;
  gradientsScore: number;
  blocksScore: number;
  fuelScore: number;
  recommendations: Recommendation[];
}

interface Recommendation {
  icon: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}
```

#### Implementation Plan

**Step 1**: Create Shared API Service
```typescript
// src/services/assessmentApi.ts
export const assessmentApi = {
  async submitAssessment(answers: AssessmentAnswer[]): Promise<AssessmentResult> {
    const response = await fetch('https://api.cognitionblocksllc.com/v1/assessment/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    return response.json();
  },

  async getResults(userId: string): Promise<AssessmentResult> {
    const response = await fetch(`https://api.cognitionblocksllc.com/v1/assessment/results/${userId}`);
    return response.json();
  }
};
```

**Step 2**: Create Mobile Assessment Screen
```typescript
// src/screens/AssessmentScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { assessmentApi } from '../services/assessmentApi';
import { assessmentData } from '../data/assessmentQuestions'; // Same as web

const AssessmentScreen = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleSubmit = async () => {
    const result = await assessmentApi.submitAssessment(
      answers.map((answer, index) => ({
        questionId: index,
        category: determineCategory(index),
        answer
      }))
    );
    // Navigate to results screen
  };

  // Rest of implementation...
};
```

### 2. 30-Day Challenge

**Web Implementation**: `website/webapp/challenge.html`
**Mobile Implementation**: Create new challenge screens

#### Shared Data Model
```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  primaryGoal: 'energy' | 'focus' | 'digestion' | 'weight' | 'overall';
  restrictions: string[];
  startDate: string;
}

interface DailyEntry {
  day: number;
  date: string;
  completedChecklist: number[];
  meals: MealLog[];
  metrics: HealthMetrics;
  notes?: string;
}

interface HealthMetrics {
  energy: number; // 1-10
  clarity: number;
  digestion: number;
  mood: number;
}

interface MealLog {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
  description: string;
  photoUrl?: string; // Mobile can upload photos
}
```

#### Backend API Specification

```typescript
// POST /api/v1/challenge/register
interface RegisterChallengeRequest {
  name: string;
  email: string;
  primaryGoal: string;
  restrictions: string[];
}

interface RegisterChallengeResponse {
  userId: string;
  challengeId: string;
  startDate: string;
}

// POST /api/v1/challenge/log-day
interface LogDayRequest {
  userId: string;
  day: number;
  completedChecklist: number[];
  metrics: HealthMetrics;
  meals?: MealLog[];
  notes?: string;
}

// GET /api/v1/challenge/progress/:userId
interface ChallengeProgressResponse {
  currentDay: number;
  completedDays: number[];
  streak: number;
  achievements: Achievement[];
  dailyEntries: Record<number, DailyEntry>;
}
```

### 3. Data Synchronization

#### Strategy: API-First Approach

1. **All data lives in backend**
2. **Web and mobile fetch from same endpoints**
3. **Local storage/AsyncStorage for offline capability**
4. **Sync on app open and after user actions**

#### Implementation

**Shared Sync Service**:
```typescript
// Web: src/services/syncService.js
// Mobile: src/services/syncService.ts

class SyncService {
  private baseUrl = 'https://api.cognitionblocksllc.com/v1';

  async syncChallengeData(userId: string) {
    // Fetch latest from server
    const serverData = await this.fetchChallengeProgress(userId);

    // Get local data
    const localData = await this.getLocalData();

    // Merge (server wins for conflicts)
    const merged = this.mergeData(serverData, localData);

    // Save merged data locally
    await this.saveLocalData(merged);

    // Upload any pending local changes
    await this.uploadPendingChanges(userId);

    return merged;
  }

  private async fetchChallengeProgress(userId: string) {
    const response = await fetch(`${this.baseUrl}/challenge/progress/${userId}`);
    return response.json();
  }

  private async getLocalData() {
    // Web: localStorage.getItem()
    // Mobile: AsyncStorage.getItem()
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('challengeData') || '{}');
    } else {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const data = await AsyncStorage.getItem('challengeData');
      return JSON.parse(data || '{}');
    }
  }

  // ... more methods
}

export const syncService = new SyncService();
```

## Backend Implementation

### Tech Stack Recommendation

**Option 1: Node.js + Express + PostgreSQL**
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(cors());
app.use(express.json());

// Assessment endpoint
app.post('/api/v1/assessment/submit', async (req, res) => {
  const { userId, answers } = req.body;

  // Calculate scores
  const scores = calculateAssessmentScores(answers);

  // Save to database
  await pool.query(
    'INSERT INTO assessments (user_id, answers, scores, created_at) VALUES ($1, $2, $3, NOW())',
    [userId, JSON.stringify(answers), JSON.stringify(scores)]
  );

  // Generate recommendations
  const recommendations = generateRecommendations(scores);

  res.json({ ...scores, recommendations });
});

// Challenge endpoints
app.post('/api/v1/challenge/register', async (req, res) => {
  const { name, email, primaryGoal, restrictions } = req.body;

  const result = await pool.query(
    'INSERT INTO users (name, email, primary_goal, restrictions, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
    [name, email, primaryGoal, JSON.stringify(restrictions)]
  );

  const userId = result.rows[0].id;

  // Create challenge record
  await pool.query(
    'INSERT INTO challenges (user_id, start_date, current_day) VALUES ($1, NOW(), 1)',
    [userId]
  );

  res.json({
    userId,
    challengeId: userId, // For simplicity
    startDate: new Date().toISOString()
  });
});

app.post('/api/v1/challenge/log-day', async (req, res) => {
  const { userId, day, completedChecklist, metrics, meals, notes } = req.body;

  await pool.query(
    'INSERT INTO daily_entries (user_id, day, checklist, metrics, meals, notes, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
    [userId, day, JSON.stringify(completedChecklist), JSON.stringify(metrics), JSON.stringify(meals), notes]
  );

  // Update challenge progress
  await pool.query(
    'UPDATE challenges SET current_day = $1, completed_days = array_append(completed_days, $2) WHERE user_id = $3',
    [day + 1, day, userId]
  );

  res.json({ success: true });
});

app.get('/api/v1/challenge/progress/:userId', async (req, res) => {
  const { userId } = req.params;

  const challenge = await pool.query(
    'SELECT * FROM challenges WHERE user_id = $1',
    [userId]
  );

  const entries = await pool.query(
    'SELECT * FROM daily_entries WHERE user_id = $1 ORDER BY day',
    [userId]
  );

  res.json({
    currentDay: challenge.rows[0].current_day,
    completedDays: challenge.rows[0].completed_days || [],
    streak: calculateStreak(challenge.rows[0].completed_days),
    achievements: calculateAchievements(challenge.rows[0]),
    dailyEntries: entries.rows.reduce((acc, entry) => {
      acc[entry.day] = entry;
      return acc;
    }, {})
  });
});

app.listen(3000, () => console.log('API running on port 3000'));
```

**Option 2: WordPress REST API**
```php
// In your theme's functions.php

// Register custom endpoints
add_action('rest_api_init', function() {
    register_rest_route('cb/v1', '/assessment/submit', [
        'methods' => 'POST',
        'callback' => 'cb_submit_assessment',
        'permission_callback' => '__return_true'
    ]);

    register_rest_route('cb/v1', '/challenge/register', [
        'methods' => 'POST',
        'callback' => 'cb_register_challenge',
        'permission_callback' => '__return_true'
    ]);

    // ... more routes
});

function cb_submit_assessment($request) {
    $params = $request->get_json_params();
    $user_id = $params['userId'];
    $answers = $params['answers'];

    // Calculate scores
    $scores = cb_calculate_scores($answers);

    // Save to custom post type
    $post_id = wp_insert_post([
        'post_type' => 'cb_assessment',
        'post_status' => 'private',
        'post_title' => 'Assessment ' . $user_id,
        'meta_input' => [
            'answers' => json_encode($answers),
            'scores' => json_encode($scores),
            'user_id' => $user_id
        ]
    ]);

    return rest_ensure_response([
        'gradientsScore' => $scores['gradients'],
        'blocksScore' => $scores['blocks'],
        'fuelScore' => $scores['fuel'],
        'recommendations' => cb_generate_recommendations($scores)
    ]);
}
```

### Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    primary_goal VARCHAR(50),
    restrictions JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Assessments table
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    answers JSONB NOT NULL,
    scores JSONB NOT NULL,
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Challenges table
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    start_date DATE NOT NULL,
    current_day INTEGER DEFAULT 1,
    completed_days INTEGER[],
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Daily entries table
CREATE TABLE daily_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    challenge_id UUID REFERENCES challenges(id),
    day INTEGER NOT NULL,
    checklist JSONB,
    metrics JSONB,
    meals JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, day)
);

-- Achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    achievement_type VARCHAR(50),
    unlocked_at TIMESTAMP DEFAULT NOW()
);
```

## Mobile App Updates Needed

### 1. Add Assessment Screen

Create `src/screens/AssessmentScreen.tsx` based on web version

### 2. Add Challenge Screens

- `ChallengeOnboardingScreen.tsx`
- `ChallengeDashboardScreen.tsx`
- `DailyViewScreen.tsx`
- `CalendarViewScreen.tsx`
- `ProgressScreen.tsx` (enhance existing)
- `ShoppingListScreen.tsx`

### 3. Update Navigation

```typescript
// src/navigation/AppNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Assessment" component={AssessmentScreen} />
      <Tab.Screen name="Challenge" component={ChallengeDashboardScreen} />
      <Tab.Screen name="MealEntry" component={MealEntryScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

### 4. Add API Service Layer

```typescript
// src/services/api.ts
const API_BASE_URL = 'https://api.cognitionblocksllc.com/v1';

export const api = {
  // Assessment
  submitAssessment: async (answers: number[]) => {
    const response = await fetch(`${API_BASE_URL}/assessment/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    return response.json();
  },

  // Challenge
  registerChallenge: async (userData: UserProfile) => {
    const response = await fetch(`${API_BASE_URL}/challenge/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  logDay: async (dayData: DailyEntry) => {
    const response = await fetch(`${API_BASE_URL}/challenge/log-day`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dayData)
    });
    return response.json();
  },

  getProgress: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/challenge/progress/${userId}`);
    return response.json();
  }
};
```

## Deployment Strategy

### Phase 1: MVP Launch (Week 1-2)
1. ✅ Web marketing site live
2. ✅ Web apps functional (assessment, challenge)
3. ⬜ Basic backend API
4. ⬜ Database setup
5. ⬜ Mobile app updates

### Phase 2: Full Integration (Week 3-4)
1. ⬜ User authentication
2. ⬜ Data sync working
3. ⬜ Email notifications
4. ⬜ PDF generation
5. ⬜ Analytics tracking

### Phase 3: Enhancement (Week 5-8)
1. ⬜ Payment integration
2. ⬜ Social features
3. ⬜ Advanced analytics
4. ⬜ Community forum
5. ⬜ Recipe database

## Testing Checklist

- [ ] Web assessment saves to backend
- [ ] Mobile assessment fetches same questions
- [ ] Scores calculate identically on web/mobile
- [ ] Challenge data syncs between platforms
- [ ] Shopping lists accessible on both
- [ ] Progress updates in real-time
- [ ] Offline mode works
- [ ] Data persistence works
- [ ] Forms validate correctly
- [ ] Error handling works

## Security Checklist

- [ ] HTTPS everywhere
- [ ] API authentication
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] Data encryption
- [ ] Secure file uploads
- [ ] Environment variables

## Monitoring & Analytics

### Recommended Tools

- **Analytics**: Google Analytics, Mixpanel
- **Error Tracking**: Sentry
- **Performance**: Lighthouse, WebPageTest
- **Uptime**: UptimeRobot
- **Logs**: CloudWatch, LogRocket

### Key Metrics to Track

- Daily/Monthly Active Users
- Assessment completion rate
- Challenge participation rate
- Day completion rate
- User retention (Day 7, Day 30)
- Feature usage
- Page load times
- API response times
- Error rates

---

**Next Steps**:
1. Set up backend infrastructure
2. Implement API endpoints
3. Update mobile app with new screens
4. Test data synchronization
5. Deploy to production

**Questions?** Contact the development team.

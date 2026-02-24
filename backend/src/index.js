import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Allow large images

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later.' },
});

const analysisLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 analyses per minute
  message: { error: 'Too many analysis requests. Please wait a moment.' },
});

// Auth middleware - validates Supabase JWT
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

// Root route - API info
app.get('/', (req, res) => {
  res.json({
    name: 'Mido API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /health',
      analyze: 'POST /api/analyze',
      sync: 'GET|POST /api/sync',
      profile: 'GET|PUT /api/profile',
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// FOOD ANALYSIS ENDPOINT
// ============================================
const ANALYSIS_PROMPT = `You are a nutrition analyst for the Mido app, which focuses on supporting the Enteric Nervous System (ENS) - the "second brain" in the gut.

Analyze the food in this image and return a JSON array of detected food items. For each item, provide:
- name: The food name
- portionSize: Estimated portion (e.g., "6 oz", "1 cup", "2 tbsp")
- score: A score from 1-3 based on how well this food supports ENS health:
  - Score 3: Excellent for ENS (omega-3 rich fish, leafy greens, fermented foods, healthy fats like olive oil/avocado, anti-inflammatory spices)
  - Score 2: Good/Neutral for ENS (quality proteins, whole foods, vegetables, fruits)
  - Score 1: May stress ENS (processed foods, refined sugars, seed oils, fried foods)
- warnings: Array of any concerns (e.g., ["Contains gluten", "Highly processed"])

IMPORTANT: Return ONLY valid JSON in this exact format, no other text:
[
  {"name": "Food Name", "portionSize": "portion", "score": 2, "warnings": []}
]

If no food is detected, return an empty array: []`;

app.post('/api/analyze', authenticateUser, analysisLimiter, async (req, res) => {
  try {
    const { image, mediaType = 'image/jpeg' } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Call Claude Vision API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: image,
              },
            },
            {
              type: 'text',
              text: ANALYSIS_PROMPT,
            },
          ],
        },
      ],
    });

    const content = response.content?.[0]?.text;

    if (!content) {
      return res.status(500).json({
        error: 'No response from analysis service'
      });
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return res.json({
        success: true,
        foods: [],
        message: 'No food detected in the image',
      });
    }

    const foods = JSON.parse(jsonMatch[0]).map((item, index) => ({
      id: `${Date.now()}-${index}`,
      name: item.name || 'Unknown Food',
      portionSize: item.portionSize || '1 serving',
      score: Math.min(3, Math.max(1, item.score || 2)),
      warnings: Array.isArray(item.warnings) ? item.warnings : [],
    }));

    // Log usage for analytics (optional)
    await supabase.from('analysis_logs').insert({
      user_id: req.user.id,
      food_count: foods.length,
      created_at: new Date().toISOString(),
    }).catch(() => {}); // Don't fail if logging fails

    res.json({ success: true, foods });

  } catch (error) {
    console.error('Analysis error:', error);

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Service is busy. Please try again in a moment.'
      });
    }

    res.status(500).json({
      error: 'Failed to analyze image. Please try again.'
    });
  }
});

// ============================================
// USER DATA SYNC ENDPOINTS
// ============================================

// Save user data to cloud
app.post('/api/sync', authenticateUser, apiLimiter, async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }

    const { error } = await supabase
      .from('user_data')
      .upsert({
        user_id: req.user.id,
        data: data,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) {
      console.error('Sync error:', error);
      return res.status(500).json({ error: 'Failed to sync data' });
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

// Get user data from cloud
app.get('/api/sync', authenticateUser, apiLimiter, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('data, updated_at')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json({
      success: true,
      data: data?.data || null,
      updatedAt: data?.updated_at || null,
    });

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// ============================================
// USER PROFILE ENDPOINTS
// ============================================

// Get user profile
app.get('/api/profile', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }

    res.json({
      success: true,
      profile: data || { id: req.user.id, email: req.user.email },
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
app.put('/api/profile', authenticateUser, async (req, res) => {
  try {
    const { name, condition, avatar_url } = req.body;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: req.user.id,
        email: req.user.email,
        name,
        condition,
        avatar_url,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
      });

    if (error) {
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mido API running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});

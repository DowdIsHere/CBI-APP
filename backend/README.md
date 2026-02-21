# Mido API Backend

Backend API for the Mido App, deployed on Railway with Supabase for authentication and database.

## Architecture

```
Mobile App → Backend (Railway) → Claude API
                ↓
            Supabase (Auth + PostgreSQL)
```

## Setup

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema in `supabase-schema.sql`
3. Go to **Settings → API** and note:
   - Project URL (`SUPABASE_URL`)
   - Service Role Key (`SUPABASE_SERVICE_KEY`)
   - Anon/Public Key (for mobile app)

### 2. Railway Setup

1. Create a new project at [railway.app](https://railway.app)
2. Connect this repository or deploy from GitHub
3. Set the **Root Directory** to `/backend`
4. Add environment variables:

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `ALLOWED_ORIGINS` | Comma-separated allowed origins (or `*`) |
| `PORT` | (Optional) Railway sets this automatically |

5. Deploy!

### 3. Mobile App Configuration

Update your `.env` file:

```
API_URL=https://your-app.railway.app
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## API Endpoints

### Health Check
```
GET /health
Response: { status: "ok", timestamp: "..." }
```

### Food Analysis (Auth Required)
```
POST /api/analyze
Headers: Authorization: Bearer <token>
Body: { image: "<base64>", mediaType: "image/jpeg" }
Response: { success: true, foods: [...] }
```

### Data Sync (Auth Required)
```
POST /api/sync
Body: { data: {...} }
Response: { success: true }

GET /api/sync
Response: { success: true, data: {...}, updatedAt: "..." }
```

### User Profile (Auth Required)
```
GET /api/profile
Response: { success: true, profile: {...} }

PUT /api/profile
Body: { name: "...", condition: "...", avatar_url: "..." }
Response: { success: true }
```

## Rate Limits

- General API: 100 requests per 15 minutes
- Analysis: 10 requests per minute

## Local Development

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev
```

## Security Features

- ✅ API key secured server-side
- ✅ JWT authentication via Supabase
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Row Level Security in Supabase

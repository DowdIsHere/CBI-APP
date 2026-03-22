-- =============================================
-- MIDO APP - SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- Stores user profile information
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  condition TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- USER DATA TABLE
-- Stores synced app data (meals, triggers, etc.)
-- =============================================
CREATE TABLE IF NOT EXISTS user_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own data" ON user_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON user_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON user_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- ANALYSIS LOGS TABLE
-- Tracks API usage for analytics/billing
-- =============================================
CREATE TABLE IF NOT EXISTS analysis_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  food_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE analysis_logs ENABLE ROW LEVEL SECURITY;

-- Policies: Users can view their own logs, service can insert
CREATE POLICY "Users can view own logs" ON analysis_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can insert (backend uses service key)
CREATE POLICY "Service can insert logs" ON analysis_logs
  FOR INSERT WITH CHECK (true);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_logs_user_id ON analysis_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_logs_created_at ON analysis_logs(created_at);

-- =============================================
-- FUNCTIONS FOR ANALYTICS
-- =============================================

-- Get user's analysis count this month
CREATE OR REPLACE FUNCTION get_monthly_analysis_count(p_user_id UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(COUNT(*), 0)::INTEGER
  FROM analysis_logs
  WHERE user_id = p_user_id
    AND created_at >= DATE_TRUNC('month', NOW());
$$ LANGUAGE SQL SECURITY DEFINER;
